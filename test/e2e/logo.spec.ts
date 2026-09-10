import { test, expect } from './fixtures/hass';
import { useDashboard } from './helpers/homeassistant';
import { findStation, restoreStations, seedStation, type StationEntities } from './helpers/stations';

// Served by Home Assistant's /local, so the request is local, fast and a
// guaranteed 404 - no dependency on the logo host being reachable.
const BROKEN_LOGO = '/local/tankerkoenig-card/e2e-missing-logo.png';

const STATION = {
  brand: 'Aral',
  name: 'E2E Broken Logo',
  street: 'Teststrasse',
  houseNumber: '9',
  postcode: '40213',
  city: 'Duesseldorf',
  prices: { e5: '1.909', e10: '1.849', diesel: '1.759' },
  open: true,
};

let urlPath: string;
let station: StationEntities;

test.beforeAll(async () => {
  station = await findStation(1);
  await seedStation(station, STATION);
  urlPath = await useDashboard('logo', {
    views: [
      {
        title: 'Fuel',
        cards: [
          {
            type: 'custom:tankerkoenig-card',
            title: 'E2E broken logo',
            stations: [{ device: station.deviceId, name: STATION.name, logo: BROKEN_LOGO }],
          },
        ],
      },
    ],
  });
});

test.afterAll(async () => {
  await restoreStations();
});

test.describe('A station logo that cannot be loaded', () => {
  test('falls back to the inline placeholder and stops asking', async ({ page }) => {
    // The bug this guards against: the `error` handler used to re-render the
    // same broken src, which fired `error` again - 5083 requests in three
    // seconds. Only a browser can show that, so count the requests here.
    let requests = 0;
    page.on('request', (request) => {
      if (request.url().includes('e2e-missing-logo.png')) requests += 1;
    });

    await page.goto(`/${urlPath}/0`);

    const logo = page.locator('tankerkoenig-card .logo-container .logo');
    await expect(logo).toBeVisible({ timeout: 60_000 });
    await expect(logo).toHaveAttribute('src', /^data:image\/svg\+xml/, { timeout: 30_000 });

    // Give a runaway retry loop every chance to show itself.
    await page.waitForTimeout(3000);
    expect(requests).toBe(1);
  });
});
