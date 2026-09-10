import { test, expect } from './fixtures/hass';
import { callWebsocket, resources, useDashboard } from './helpers/homeassistant';

const CARD_PREFIX = '/local/tankerkoenig-card/';
const BUNDLE = `${CARD_PREFIX}tankerkoenig-card.js`;

let duplicateId: string | undefined;

test.beforeAll(async () => {
  // Register the bundle a second time. That is exactly the situation the guards
  // around `customElements.define` exist for: the browser then evaluates the
  // module twice, and an unguarded define throws on the second pass and takes
  // the whole card down. Only a real frontend can produce that.
  const created = await callWebsocket<{ id: string }>({
    type: 'lovelace/resources/create',
    res_type: 'module',
    url: `${BUNDLE}?e2e-duplicate=1`,
  });
  duplicateId = created.id;
});

test.afterAll(async () => {
  if (duplicateId) await callWebsocket({ type: 'lovelace/resources/delete', resource_id: duplicateId });
});

test.describe('Lovelace resource registration', () => {
  test('serves the bundle as a module resource', async () => {
    const ours = (await resources()).filter((resource) => resource.url.startsWith(CARD_PREFIX));
    expect(ours.map((resource) => resource.url)).toContain(BUNDLE);
  });

  test('defines card and editor without a clash when the bundle is loaded twice', async ({ page, consoleErrors }) => {
    const urlPath = await useDashboard('resources', { views: [{ title: 'Empty', cards: [] }] });

    await page.goto(`/${urlPath}/0`);
    await page.waitForFunction(() => customElements.get('tankerkoenig-card') !== undefined, {
      timeout: 60_000,
    });

    // The editor is a dynamic import, and only `getConfigElement` pulls it in -
    // so ask for it the way the Lovelace editor does.
    await page.evaluate(async () => {
      const ctor = customElements.get('tankerkoenig-card') as unknown as {
        getConfigElement(): Promise<HTMLElement>;
      };
      await ctor.getConfigElement();
    });
    await expect.poll(() => page.evaluate(() => !!customElements.get('tankerkoenig-card-editor'))).toBe(true);

    // A bundle loaded twice must not throw on the second define().
    expect(consoleErrors.filter((text) => /has already been used/i.test(text))).toEqual([]);
  });
});
