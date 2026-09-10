/**
 * The opening-hours callout against a real layout.
 *
 * It used to be an absolutely positioned tooltip - `top: 24px; z-index: 99` - so it was
 * painted straight over the next station in the list, hiding that station's name and address
 * until it was dismissed. Nothing in jsdom has a box, so only a real browser can say whether
 * the callout keeps out of the way of the row below it.
 */
import { test, expect } from './fixtures/hass';
import { setState, useDashboard } from './helpers/homeassistant';
import { findStations, restoreStations, seedStation, type StationEntities } from './helpers/stations';

const HOURS = 'Mo-Fr 06:00-22:00';

const NAMES = ['E2E Callout Oben', 'E2E Callout Unten'];

let urlPath: string;
let stations: StationEntities[];

test.beforeAll(async () => {
  stations = (await findStations(6)).slice(4);

  for (const [index, station] of stations.entries()) {
    await seedStation(station, {
      brand: 'Jet',
      name: NAMES[index],
      street: 'Kalenderweg',
      houseNumber: String(index + 1),
      postcode: '50667',
      city: 'Koeln',
      prices: { e5: '1.889', e10: '1.829', diesel: '1.759' },
      open: true,
    });
    // seedStation marks a station as open around the clock, which renders the 24/7 badge and
    // no opening hours at all. These stations keep hours, so their badge opens the callout.
    await setState(station.status, 'on', {
      friendly_name: `${NAMES[index]} Status`,
      device_class: 'door',
      opening_hours: HOURS,
    });
  }

  urlPath = await useDashboard('callout', {
    views: [
      {
        title: 'Fuel',
        cards: [
          {
            type: 'custom:tankerkoenig-card',
            title: 'E2E callout',
            stations: stations.map((station, index) => ({ device: station.deviceId, name: NAMES[index] })),
          },
        ],
      },
    ],
  });
});

test.afterAll(async () => {
  await restoreStations();
});

/** Opens the first station's callout and hands back the boxes that must not overlap. */
async function openFirstCallout(page: import('@playwright/test').Page) {
  const card = page.locator('tankerkoenig-card');
  await expect(card.locator('ha-card')).toBeVisible({ timeout: 60_000 });
  await expect(card.locator('.station')).toHaveCount(2);

  await card.locator('.station').first().locator('.badge').click();
  const callout = card.locator('.opening-hours-callout');
  await expect(callout).toBeVisible();
  await expect(callout.locator('.opening-hours-time')).toHaveText('06:00-22:00');

  return { card, callout };
}

test.describe('The opening-hours callout', () => {
  test('does not cover the station below it', async ({ page }) => {
    await page.goto(`/${urlPath}/0`);
    const { card, callout } = await openFirstCallout(page);

    const calloutBox = (await callout.boundingBox())!;
    const nextRow = card.locator('.station').nth(1);
    const nextBox = (await nextRow.boundingBox())!;
    const nextName = (await nextRow.locator('.station-name').boundingBox())!;

    expect(calloutBox.y + calloutBox.height).toBeLessThanOrEqual(nextBox.y);
    expect(calloutBox.y + calloutBox.height).toBeLessThanOrEqual(nextName.y);
    await expect(nextRow.locator('.station-name')).toHaveText(NAMES[1]);
  });

  test('pushes the list down rather than floating over it, on a phone too', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${urlPath}/0`);

    const card = page.locator('tankerkoenig-card');
    await expect(card.locator('ha-card')).toBeVisible({ timeout: 60_000 });
    const before = (await card.locator('.station').nth(1).boundingBox())!;

    const { callout } = await openFirstCallout(page);
    const after = (await card.locator('.station').nth(1).boundingBox())!;
    const calloutBox = (await callout.boundingBox())!;

    // The row below moved down to make room instead of being painted over. It moves by less
    // than the callout's own height, because the row is as tall as its price column already.
    expect(after.y).toBeGreaterThan(before.y);
    expect(calloutBox.y + calloutBox.height).toBeLessThanOrEqual(after.y);
    // And it stays inside the card rather than hanging over its edge.
    const cardBox = (await card.locator('ha-card').boundingBox())!;
    expect(calloutBox.x + calloutBox.width).toBeLessThanOrEqual(cardBox.x + cardBox.width + 1);
  });

  test('gets the width of the card, not of the info column', async ({ page }) => {
    // As a child of .info it was handed the card's width minus the logo, the gaps and the
    // price column, so a multi-rule hours string wrapped far more than it had to.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${urlPath}/0`);
    const { card, callout } = await openFirstCallout(page);

    const calloutBox = (await callout.boundingBox())!;
    const infoBox = (await card.locator('.station').first().locator('.info').boundingBox())!;
    const cardBox = (await card.locator('ha-card').boundingBox())!;

    // Wider than the column it used to live in, and it starts to the left of it.
    expect(calloutBox.width).toBeGreaterThan(infoBox.width);
    expect(calloutBox.x).toBeLessThan(infoBox.x);
    // Which is to say: the card's own content width, give or take its padding.
    expect(calloutBox.width).toBeGreaterThan(cardBox.width * 0.85);
    expect(calloutBox.x + calloutBox.width).toBeLessThanOrEqual(cardBox.x + cardBox.width + 1);
  });

  test('does not shift the row it belongs to when it opens', async ({ page }) => {
    // .station is align-items: center, so a callout inside the row made the row taller and
    // re-centred the logo and the price column - the row jumped under the finger that opened
    // it. As a wrapped line of its own the callout leaves the first line's height alone.
    await page.goto(`/${urlPath}/0`);

    const card = page.locator('tankerkoenig-card');
    await expect(card.locator('ha-card')).toBeVisible({ timeout: 60_000 });
    const row = card.locator('.station').first();
    const logoBefore = (await row.locator('.logo-container').boundingBox())!;
    const pricesBefore = (await row.locator('.prices').boundingBox())!;

    await openFirstCallout(page);

    const logoAfter = (await row.locator('.logo-container').boundingBox())!;
    const pricesAfter = (await row.locator('.prices').boundingBox())!;

    expect(Math.abs(logoAfter.y - logoBefore.y)).toBeLessThanOrEqual(1);
    expect(Math.abs(pricesAfter.y - pricesBefore.y)).toBeLessThanOrEqual(1);
  });

  test('points its arrow at the badge that opened it', async ({ page }) => {
    // The arrow was pinned to the callout's own left edge, which stopped being anywhere near
    // the badge the moment the callout spanned the card.
    await page.goto(`/${urlPath}/0`);
    const { card, callout } = await openFirstCallout(page);

    const calloutBox = (await callout.boundingBox())!;
    const badgeBox = (await card.locator('.station').first().locator('.badge').boundingBox())!;
    const arrowLeft = await callout.evaluate(
      (el) => parseFloat(window.getComputedStyle(el, '::after').left as string) || 0,
    );

    const arrowX = calloutBox.x + arrowLeft;
    expect(arrowX).toBeGreaterThanOrEqual(badgeBox.x - 1);
    expect(arrowX).toBeLessThanOrEqual(badgeBox.x + badgeBox.width + 1);
  });
});
