/**
 * The card editor against Home Assistant's own components.
 *
 * ha-expansion-panel is the reason this file exists: its summary lives in a shadow root that
 * only the real frontend provides, so no jsdom test can say whether the editor's panels
 * actually follow the user. The editor is mounted directly rather than through the dashboard's
 * edit dialog - it is the same element the dashboard creates, and it keeps the test off the
 * dialog's own chrome, which changes between releases.
 */
import { test, expect } from './fixtures/hass';
import { useDashboard } from './helpers/homeassistant';
import { findStation, restoreStations, seedStation, type StationEntities } from './helpers/stations';

let urlPath: string;
let station: StationEntities;

test.beforeAll(async () => {
  station = await findStation(3);
  await seedStation(station, {
    brand: 'Esso',
    name: 'E2E Editor',
    street: 'Redaktionsweg',
    houseNumber: '1',
    postcode: '20095',
    city: 'Hamburg',
    prices: { e5: '1.879', e10: '1.819', diesel: '1.749' },
    open: true,
  });
  urlPath = await useDashboard('editor', {
    views: [{ title: 'Fuel', cards: [{ type: 'custom:tankerkoenig-card', stations: [station.deviceId] }] }],
  });
});

test.afterAll(async () => {
  await restoreStations();
});

/** Mounts the card's own config element over the page and hands back a locator for it. */
async function mountEditor(page: import('@playwright/test').Page, deviceId: string): Promise<void> {
  await page.evaluate(async (device) => {
    const ctor = customElements.get('tankerkoenig-card') as unknown as {
      getConfigElement(): Promise<HTMLElement>;
    };
    const editor = await ctor.getConfigElement();
    (editor as unknown as { hass: unknown }).hass = (
      document.querySelector('home-assistant') as unknown as { hass: unknown }
    ).hass;
    (editor as unknown as { setConfig(config: unknown): void }).setConfig({
      type: 'custom:tankerkoenig-card',
      stations: [device],
    });
    editor.id = 'e2e-editor';
    editor.style.cssText = 'position:fixed;inset:0;z-index:99999;overflow:auto;background:var(--card-background-color)';
    document.body.appendChild(editor);
    await (editor as unknown as { updateComplete: Promise<unknown> }).updateComplete;
  }, deviceId);
}

test.describe('The card editor', () => {
  test('opens and closes an expansion panel when its summary is clicked', async ({ page }) => {
    await page.goto(`/${urlPath}/0`);
    await expect(page.locator('tankerkoenig-card').locator('ha-card')).toBeVisible({ timeout: 60_000 });
    await mountEditor(page, station.deviceId);

    const panel = page.locator('#e2e-editor ha-expansion-panel').first();
    await expect(panel)
      .toHaveAttribute('header', /.+/, { timeout: 30_000 })
      .catch(() => undefined);

    // The summary is inside ha-expansion-panel's shadow root; Playwright pierces it, which is
    // exactly what the editor's old `e.target.classList` check could not do.
    const summary = panel.locator('#summary');
    await expect(summary).toHaveAttribute('aria-expanded', 'false');

    await summary.click();
    await expect(summary).toHaveAttribute('aria-expanded', 'true');

    // And it must still be open after the editor re-renders: the editor used to keep its own
    // state at false and write that back over the panel on the next render.
    await page.evaluate(async () => {
      const editor = document.getElementById('e2e-editor') as HTMLElement & {
        requestUpdate(): void;
        updateComplete: Promise<unknown>;
      };
      editor.requestUpdate();
      await editor.updateComplete;
    });
    await expect(summary).toHaveAttribute('aria-expanded', 'true');

    await summary.click();
    await expect(summary).toHaveAttribute('aria-expanded', 'false');
  });
});
