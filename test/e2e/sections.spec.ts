/**
 * The card inside a sections dashboard.
 *
 * Sections lay cards out on a twelve-column grid. The card asks for the full width by default
 * and a user narrows it with `grid_options.columns`. (`layout_options.grid_columns` is the
 * pre-2024 spelling; current Home Assistant ignores it, so it leaves the card at full width.)
 */
import { test, expect } from './fixtures/hass';
import { useDashboard } from './helpers/homeassistant';
import { findStation, restoreStations, seedStation, type StationEntities } from './helpers/stations';

let urlPath: string;
let station: StationEntities;

const card = (title: string, extra: Record<string, unknown> = {}) => ({
  type: 'custom:tankerkoenig-card',
  title,
  stations: [{ device: station.deviceId, name: 'E2E Sektion' }],
  ...extra,
});

test.beforeAll(async () => {
  station = await findStation(1);
  await seedStation(station, {
    brand: 'Shell',
    name: 'E2E Sektion',
    street: 'Rasterstrasse',
    houseNumber: '4',
    postcode: '40210',
    city: 'Duesseldorf',
    prices: { e5: '1.859', e10: '1.799', diesel: '1.719' },
    open: true,
  });
  urlPath = await useDashboard('sections', {
    views: [
      {
        title: 'Grid',
        type: 'sections',
        max_columns: 1,
        sections: [
          {
            type: 'grid',
            cards: [card('Full width'), card('Four of twelve', { grid_options: { columns: 4 } })],
          },
        ],
      },
    ],
  });
});

test.afterAll(async () => {
  await restoreStations();
});

test.describe('The card in a sections view', () => {
  test('takes the full section width by default and narrows with grid_options.columns', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 900 });
    await page.goto(`/${urlPath}/0`);

    const cards = page.locator('tankerkoenig-card');
    await expect(cards).toHaveCount(2, { timeout: 60_000 });
    await expect(cards.nth(0).locator('ha-card')).toBeVisible();
    await expect(cards.nth(1).locator('ha-card')).toBeVisible();

    const full = (await cards.nth(0).locator('ha-card').boundingBox())!;
    const narrow = (await cards.nth(1).locator('ha-card').boundingBox())!;

    // 4 of 12 columns, less the gaps between columns: well under half of the full card.
    expect(narrow.width).toBeLessThan(full.width * 0.5);
    expect(narrow.width).toBeGreaterThan(full.width * 0.25);
  });
});
