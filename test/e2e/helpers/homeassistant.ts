/**
 * Talks to the Home Assistant the repository's docker-compose provides.
 *
 * The suite works from a fresh clone: if the instance has never been set up,
 * global setup onboards it through the API, adds a tracked minimal fixture
 * integration (`ha-fixture/custom_components/e2e_stations`, mounted by
 * docker-compose) that provides the station devices, and registers `dist/` as a
 * Lovelace resource. On an instance that is already set up all of that is a
 * no-op. Everything the suite writes goes into a dashboard of its own, so a
 * manual playground stays intact. No Tankerkoenig API key is ever needed.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const E2E_DIR = resolve(here, '..');
const REPO_ROOT = resolve(E2E_DIR, '../..');
const TOKEN_FILE = resolve(E2E_DIR, '.auth.json');

/** Read from the compose file so the suite cannot drift from the environment. */
function portFromCompose(): string {
  const compose = readFileSync(resolve(REPO_ROOT, 'docker-compose.yml'), 'utf8');
  const match = compose.match(/'(\d+):8123'/) ?? compose.match(/"(\d+):8123"/);
  if (!match) throw new Error('No published Home Assistant port found in docker-compose.yml');
  return match[1];
}

export const PORT = process.env.HA_E2E_PORT ?? portFromCompose();
export const BASE_URL = `http://127.0.0.1:${PORT}`;
export const USERNAME = process.env.HA_E2E_USER ?? 'admin';
export const PASSWORD = process.env.HA_E2E_PASSWORD ?? 'password';

/** Brings the repository's own compose environment up if it is not running. */
export function ensureRunning(): void {
  execFileSync('docker', ['compose', 'up', '-d'], { cwd: REPO_ROOT, stdio: 'inherit' });
}

/**
 * Completes Home Assistant's onboarding through its API when the instance is
 * brand new (CI, a fresh clone). Once onboarding is done the endpoint answers
 * 404 and this does nothing.
 */
export async function ensureOnboarded(): Promise<void> {
  const status = await fetch(`${BASE_URL}/api/onboarding`);
  if (status.status === 404) return;
  const steps = (await status.json()) as { step: string; done: boolean }[];
  if (steps.every((step) => step.done)) return;

  const clientId = `${BASE_URL}/`;
  const json = { 'Content-Type': 'application/json' };
  let accessToken: string | undefined;

  if (!steps.find((step) => step.step === 'user')?.done) {
    const created = await fetch(`${BASE_URL}/api/onboarding/users`, {
      method: 'POST',
      headers: json,
      body: JSON.stringify({
        client_id: clientId,
        name: 'E2E Admin',
        username: USERNAME,
        password: PASSWORD,
        language: 'en',
      }),
    });
    if (!created.ok) throw new Error(`onboarding user step failed: ${created.status} ${await created.text()}`);
    const { auth_code: code } = (await created.json()) as { auth_code: string };
    const token = await fetch(`${BASE_URL}/auth/token`, {
      method: 'POST',
      body: new URLSearchParams({ grant_type: 'authorization_code', code, client_id: clientId }),
    });
    if (!token.ok) throw new Error(`onboarding token exchange failed: ${token.status} ${await token.text()}`);
    accessToken = ((await token.json()) as { access_token: string }).access_token;
  }

  if (!accessToken) {
    throw new Error(
      'Home Assistant is half onboarded (user exists, other steps open); remove test/ha-config and retry.',
    );
  }
  const auth = { ...json, Authorization: `Bearer ${accessToken}` };
  for (const [step, body] of [
    ['core_config', {}],
    ['analytics', {}],
    ['integration', { client_id: clientId, redirect_uri: `${clientId}?auth_callback=1` }],
  ] as const) {
    const res = await fetch(`${BASE_URL}/api/onboarding/${step}`, {
      method: 'POST',
      headers: auth,
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`onboarding ${step} step failed: ${res.status} ${await res.text()}`);
  }
}

/** Adds the fixture station integration unless it is already configured. */
export async function ensureStationFixture(): Promise<void> {
  const headers = { Authorization: `Bearer ${readTokens().access_token}`, 'Content-Type': 'application/json' };
  const entries = await fetch(`${BASE_URL}/api/config/config_entries/entry?domain=e2e_stations`, { headers });
  if (entries.ok && ((await entries.json()) as unknown[]).length > 0) return;
  const flow = await fetch(`${BASE_URL}/api/config/config_entries/flow`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ handler: 'e2e_stations', show_advanced_options: false }),
  });
  const result = (await flow.json()) as { type?: string; reason?: string; message?: string };
  if (!flow.ok || result.type !== 'create_entry') {
    throw new Error(`could not set up the e2e_stations fixture: ${flow.status} ${JSON.stringify(result)}`);
  }
}

/** Registers the built bundle (and the stylesheet) as Lovelace resources if missing. */
export async function ensureCardResources(): Promise<void> {
  const existing = await resources();
  for (const [url, type] of [
    ['/local/tankerkoenig-card/tankerkoenig-card.js', 'module'],
    ['/local/tankerkoenig-card/stylesheet.css', 'css'],
  ] as const) {
    if (existing.some((resource) => new URL(resource.url, 'http://ha.invalid').pathname === url)) continue;
    await callWebsocket({ type: 'lovelace/resources/create', res_type: type, url });
  }
}

export async function waitForFrontend(timeoutMs = 180_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      // Not /api/onboarding: that endpoint is gone once onboarding is done.
      const res = await fetch(`${BASE_URL}/manifest.json`);
      if (res.ok) return;
    } catch {
      // not listening yet
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error(`Home Assistant did not answer at ${BASE_URL} within ${timeoutMs}ms`);
}

export interface Tokens {
  access_token: string;
}

export function saveTokens(tokens: Tokens): void {
  writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
}

export function readTokens(): Tokens {
  if (!existsSync(TOKEN_FILE)) throw new Error('No token file - did global setup run?');
  return JSON.parse(readFileSync(TOKEN_FILE, 'utf8')) as Tokens;
}

/**
 * Sends one command over the websocket API and returns its result. Node ships a
 * WebSocket client, so this needs no dependency, and it is the same API the
 * frontend itself speaks.
 */
export async function callWebsocket<T = unknown>(message: Record<string, unknown>): Promise<T> {
  const token = readTokens().access_token;
  const socket = new WebSocket(`ws://127.0.0.1:${PORT}/api/websocket`);

  return new Promise<T>((resolve_, reject) => {
    const fail = (reason: string) => {
      socket.close();
      reject(new Error(reason));
    };
    const timer = setTimeout(() => fail('websocket timed out'), 30_000);

    socket.addEventListener('error', () => fail('websocket error'));
    socket.addEventListener('message', (event) => {
      const payload = JSON.parse(String(event.data)) as Record<string, unknown>;
      switch (payload.type) {
        case 'auth_required':
          socket.send(JSON.stringify({ type: 'auth', access_token: token }));
          return;
        case 'auth_invalid':
          clearTimeout(timer);
          fail('websocket authentication was refused');
          return;
        case 'auth_ok':
          socket.send(JSON.stringify({ id: 1, ...message }));
          return;
        case 'result': {
          clearTimeout(timer);
          socket.close();
          if (payload.success) resolve_(payload.result as T);
          else reject(new Error(`websocket command failed: ${JSON.stringify(payload.error)}`));
        }
      }
    });
  });
}

export interface StateObject {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

/** Puts a state on the bus, the way any client would. */
export async function setState(
  entityId: string,
  state: string,
  attributes: Record<string, unknown> = {},
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/states/${entityId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${readTokens().access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ state, attributes }),
  });
  if (!res.ok) throw new Error(`setting ${entityId} failed: ${res.status} ${await res.text()}`);
}

export async function getState(entityId: string): Promise<StateObject | null> {
  const res = await fetch(`${BASE_URL}/api/states/${entityId}`, {
    headers: { Authorization: `Bearer ${readTokens().access_token}` },
  });
  if (!res.ok) return null;
  return (await res.json()) as StateObject;
}

export async function removeState(entityId: string): Promise<void> {
  await fetch(`${BASE_URL}/api/states/${entityId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${readTokens().access_token}` },
  });
}

/**
 * Gives the caller its own dashboard.
 *
 * Every spec file asks for a different name, so specs can run in parallel
 * without fighting over one dashboard - and none of them touches whatever the
 * manual test instance has on its own dashboards. Going through a dashboard we
 * created ourselves is also the only reliable path: since 2026.9 `/lovelace/0`
 * redirects to the new home panel.
 */
export async function useDashboard(name: string, config: Record<string, unknown>): Promise<string> {
  const urlPath = `e2e-${name}`;
  const dashboards = await callWebsocket<{ url_path: string }[]>({
    type: 'lovelace/dashboards/list',
  });
  if (!dashboards.some((dashboard) => dashboard.url_path === urlPath)) {
    await callWebsocket({
      type: 'lovelace/dashboards/create',
      url_path: urlPath,
      title: `E2E ${name}`,
      mode: 'storage',
      show_in_sidebar: false,
    });
  }
  await callWebsocket({ type: 'lovelace/config/save', url_path: urlPath, config });
  return urlPath;
}

/** The Lovelace resources Home Assistant has persisted. */
export async function resources(): Promise<{ id: string; url: string; type: string }[]> {
  return callWebsocket({ type: 'lovelace/resources' });
}
