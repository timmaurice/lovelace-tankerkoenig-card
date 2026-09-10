import { test, expect } from './fixtures/hass';
import { useDashboard } from './helpers/homeassistant';
import { findStation, restoreStations, seedStation, type StationEntities } from './helpers/stations';

const STATION = {
  brand: 'Aral',
  name: 'E2E Nord',
  street: 'Teststrasse',
  houseNumber: '7',
  postcode: '40213',
  city: 'Duesseldorf',
  prices: { e5: '1.859', e10: '1.799', diesel: '1.719' },
  open: true,
};

let urlPath: string;
let station: StationEntities;

test.beforeAll(async () => {
  station = await findStation(0);
  await seedStation(station, STATION);
  urlPath = await useDashboard('card', {
    views: [
      {
        title: 'Fuel',
        cards: [
          {
            type: 'custom:tankerkoenig-card',
            title: 'E2E fuel',
            stations: [{ device: station.deviceId, name: STATION.name }],
            fuel_types: ['e5', 'e10', 'diesel'],
            show_street: true,
            show_postcode: true,
            show_city: true,
          },
        ],
      },
      { title: 'Elsewhere', cards: [{ type: 'markdown', content: 'nothing here' }] },
    ],
  });
});

test.afterAll(async () => {
  await restoreStations();
});

test.describe('The card on a real dashboard', () => {
  test('renders the seeded station', async ({ page, consoleErrors }) => {
    await page.goto(`/${urlPath}/0`);

    // Assert on what the card paints, not on the custom element itself: the host
    // has no box of its own, so Playwright rightly calls it hidden.
    const card = page.locator('tankerkoenig-card');
    await expect(card.locator('ha-card')).toBeVisible({ timeout: 60_000 });
    await expect(card.locator('.station-name')).toHaveText(STATION.name);
    await expect(card.locator('.address')).toHaveText('Teststrasse 7, 40213 Duesseldorf');
    expect(consoleErrors.filter((text) => /has already been used/i.test(text))).toEqual([]);
  });

  test('renders every fuel price the station reports', async ({ page }) => {
    await page.goto(`/${urlPath}/0`);
    const card = page.locator('tankerkoenig-card');
    await expect(card.locator('.price-container.e5 .price')).toHaveText('1.859€');
    await expect(card.locator('.price-container.e10 .price')).toHaveText('1.799€');
    await expect(card.locator('.price-container.diesel .price')).toHaveText('1.719€');
  });

  test('comes back after leaving the view and returning', async ({ page }) => {
    // Views are torn out of the DOM on a switch. A card that does not notice it
    // is visible again comes back empty, and no unit test sees that.
    await page.goto(`/${urlPath}/0`);
    const name = page.locator('tankerkoenig-card').locator('.station-name');
    await expect(name).toHaveText(STATION.name, { timeout: 60_000 });

    await page.getByRole('tab', { name: 'Elsewhere' }).click();
    await expect(page.locator('tankerkoenig-card')).toHaveCount(0);

    await page.getByRole('tab', { name: 'Fuel' }).click();
    await expect(name).toHaveText(STATION.name, { timeout: 30_000 });
  });
});
