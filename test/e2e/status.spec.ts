/**
 * The states a station can be in that no unit test can reach honestly: a status entity Home
 * Assistant itself reports as unavailable, and a price the recorder hands back without a
 * decimal point. Both used to reach the user as something untrue - a confident "Closed" and,
 * for the price, nothing at all, because the render threw.
 */
import { test, expect } from './fixtures/hass';
import { setState, useDashboard } from './helpers/homeassistant';
import { findStation, restoreStations, seedStation, type StationEntities } from './helpers/stations';

const STATION = {
  brand: 'Shell',
  name: 'E2E Sued',
  street: 'Statusweg',
  houseNumber: '3',
  postcode: '80331',
  city: 'Muenchen',
  prices: { e5: '1.959', e10: '1.899', diesel: '2' },
  open: true,
};

let urlPath: string;
let station: StationEntities;

test.beforeAll(async () => {
  station = await findStation(2);
  await seedStation(station, STATION);
  urlPath = await useDashboard('status', {
    views: [
      {
        title: 'Fuel',
        cards: [
          {
            type: 'custom:tankerkoenig-card',
            title: 'E2E status',
            stations: [{ device: station.deviceId, name: STATION.name }],
            fuel_types: ['e5', 'e10', 'diesel'],
          },
        ],
      },
    ],
  });
});

test.afterAll(async () => {
  await restoreStations();
});

test.describe('A station whose state the card cannot read', () => {
  test('renders a price that carries no decimal point', async ({ page, consoleErrors }) => {
    await page.goto(`/${urlPath}/0`);
    const card = page.locator('tankerkoenig-card');

    // Splitting the state on '.' threw here and the whole card came up empty.
    // '2.00' large with a '0' superscript, exactly like any other price.
    await expect(card.locator('.price-container.diesel .price')).toHaveText('2.000€', { timeout: 60_000 });
    await expect(card.locator('.price-container.diesel .price sup')).toHaveText('0');
    await expect(card.locator('.station-name')).toHaveText(STATION.name);
    expect(consoleErrors.filter((text) => /Cannot read properties|TypeError/i.test(text))).toEqual([]);
  });

  test('says the status is unknown rather than claiming the station is closed', async ({ page }) => {
    await page.goto(`/${urlPath}/0`);
    const card = page.locator('tankerkoenig-card');
    await expect(card.locator('ha-card')).toBeVisible({ timeout: 60_000 });

    await setState(station.status, 'unavailable', { friendly_name: `${STATION.name} Status` });

    const badge = card.locator('.badge');
    await expect(badge).toHaveText('Status unknown', { timeout: 30_000 });
    await expect(card.locator('.station')).not.toHaveClass(/closed/);
  });

  test('picks a station up when its entities only turn up later', async ({ page }) => {
    await page.goto(`/${urlPath}/0`);
    const card = page.locator('tankerkoenig-card');
    await expect(card.locator('.price-container.e5')).toBeVisible({ timeout: 60_000 });

    // A price that goes away and comes back must reappear without a reload.
    await setState(station.e5, 'unavailable', { fuel_type: 'e5', unit_of_measurement: '€' });
    await expect(card.locator('.price-container.e5 .price')).toContainText('-.--', { timeout: 30_000 });

    await setState(station.e5, '1.729', { fuel_type: 'e5', unit_of_measurement: '€' });
    await expect(card.locator('.price-container.e5 .price')).toHaveText('1.729€', { timeout: 30_000 });
  });
});

test.describe('Reduced motion', () => {
  test('does not animate the station name', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`/${urlPath}/0`);
    const name = page.locator('tankerkoenig-card').locator('.station-name');
    await expect(name).toBeVisible({ timeout: 60_000 });

    await name.hover();
    await expect(name).toHaveCSS('animation-name', 'none');
  });
});
