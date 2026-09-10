import { HomeAssistant } from './types';
import { localize } from './localize';

/**
 * Dispatches a custom event with an optional detail value.
 *
 * @param node The element to dispatch the event from.
 * @param type The name of the event.
 * @param detail The detail value to pass with the event.
 * @param options The options for the event.
 */
export const fireEvent = <T>(
  node: HTMLElement | Window,
  type: string,
  detail?: T,
  options?: CustomEventInit<T>,
): void => {
  const event = new CustomEvent(type, { bubbles: true, cancelable: false, composed: true, ...options, detail });
  // Dispatch from window to ensure it reaches the dialog manager
  node.dispatchEvent(event);
};

/**
 * Formats a date string or object into a locale-aware string.
 * If the date is today, only the time is shown.
 * @param date The date to format.
 * @param hass The Home Assistant object, used for locale and language settings.
 * @returns A formatted date string.
 */
export function formatDate(date: string | Date, hass: HomeAssistant): string {
  const dateObj = new Date(date);
  const today = new Date();
  const isToday =
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear();

  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
  };

  if (!isToday) {
    Object.assign(options, { year: 'numeric', month: 'short', day: '2-digit' });
  }

  if (hass.locale?.time_format === '12') {
    options.hour12 = true;
  }

  return dateObj.toLocaleString(hass.language, options);
}

const LOGO_BASE_URL =
  'https://raw.githubusercontent.com/timmaurice/lovelace-tankerkoenig-card/main/src/gasstation_logos/';

const BRAND_PREFIXES = ['globus', 'raiffeisen', 'svg', 'orlen', 'bft'];

// A generic gas pump, inlined as a data URI. The fallback must never hit the network:
// if the logo host is unreachable, a remote fallback fails as well and its own `error`
// event swaps in the next one, which loops until the browser gives up.
const FALLBACK_LOGO_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
  '<path fill="#888" d="M18,10A1,1 0 0,1 17,9A1,1 0 0,1 18,8A1,1 0 0,1 19,9A1,1 0 0,1 18,10M12,10H6V5H12M19.77,' +
  '7.23L19.78,7.22L16.06,3.5L15,4.56L17.11,6.67C16.17,7.03 15.5,7.93 15.5,9A2.5,2.5 0 0,0 18,11.5C18.36,11.5 ' +
  '18.69,11.42 19,11.29V18.5A1,1 0 0,1 18,19.5A1,1 0 0,1 17,18.5V14A2,2 0 0,0 15,12H14V5A2,2 0 0,0 12,3H6A2,2 ' +
  '0 0,0 4,5V21H14V13.5H15.5V18.5A2.5,2.5 0 0,0 18,21A2.5,2.5 0 0,0 20.5,18.5V9C20.5,8.31 20.22,7.68 19.77,7.23Z"/>' +
  '</svg>';

/** Static placeholder shown when a station logo cannot be loaded. */
export const FALLBACK_LOGO_URL = `data:image/svg+xml,${encodeURIComponent(FALLBACK_LOGO_SVG)}`;

// How long a logo URL stays marked as broken before it is probed again. A dashboard is a
// long-lived SPA that often stays open for days, so a permanent mark would pin a logo to the
// placeholder for the whole life of the tab after a single transient failure — a wifi blip, a
// CDN hiccup, or images racing a Home Assistant restart. Five minutes is comfortably longer
// than those transients (an HA restart and the frontend's reconnect backoff are seconds to
// about a minute), so the anti-loop guard still covers a whole outage and every re-render
// during it, while a host that recovers is picked up on the next render a few minutes later
// instead of never.
const LOGO_FAILURE_TTL_MS = 5 * 60 * 1000;

// Timestamps of URLs that failed to load. Keyed by URL rather than by element: both lists
// rendering these logos are unkeyed `.map()`s, so Lit recycles the `<img>` nodes positionally
// (the card sorts by price, the editor reorders by drag and drop). An element-scoped guard
// would leave a recycled `<img>` unable to fall back for its new, different station.
const failedLogoUrls = new Map<string, number>();

/**
 * Resolves the `src` for a station logo, substituting the inline placeholder for any URL that
 * failed within the last `LOGO_FAILURE_TTL_MS`. Templates must render through this so a later
 * re-render cannot write the known-broken remote URL back over the placeholder. An older
 * failure is forgotten, so a host that has come back is tried again.
 * @param url The logo URL the configuration or brand lookup yields.
 * @returns The URL to render.
 */
export function resolveLogoUrl(url: string): string {
  const failedAt = failedLogoUrls.get(url);
  if (failedAt === undefined) {
    return url;
  }
  if (Date.now() - failedAt >= LOGO_FAILURE_TTL_MS) {
    // Stale mark: drop it and let the image try the real URL again. If it is still broken the
    // `error` handler simply re-arms the mark, so this can never turn into a tight retry loop.
    failedLogoUrls.delete(url);
    return url;
  }
  return FALLBACK_LOGO_URL;
}

/**
 * Swaps a logo that failed to load for the inline placeholder and records when that URL failed,
 * so every image showing that URL — now or after a re-render — resolves to the placeholder until
 * the failure ages out.
 * @param e The `error` event fired by the `<img>` element.
 */
export function handleLogoError(e: Event): void {
  const img = e.target as HTMLImageElement;
  const failedUrl = img.getAttribute('src');
  // The placeholder is inline and cannot fail, but bail out on it regardless so a broken
  // data URI could never re-enter this handler in a loop.
  if (!failedUrl || failedUrl === FALLBACK_LOGO_URL) {
    return;
  }
  failedLogoUrls.set(failedUrl, Date.now());
  img.src = FALLBACK_LOGO_URL;
}

/** Clears the remembered logo failures. Exposed so tests can start from a clean slate. */
export function resetFailedLogoUrls(): void {
  failedLogoUrls.clear();
}

/**
 * Generates a URL for a gas station logo based on the brand name.
 * @param brand The brand name of the gas station.
 * @returns The URL for the logo.
 */
export function getLogoUrl(brand?: string): string {
  if (!brand) {
    return `${LOGO_BASE_URL}404.png`;
  }

  let formattedBrand = brand
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  const matchedPrefix = BRAND_PREFIXES.find((prefix) => formattedBrand.startsWith(prefix));
  if (matchedPrefix) {
    formattedBrand = matchedPrefix;
  }

  return `${LOGO_BASE_URL}${formattedBrand}.png`;
}

export interface TimeRange {
  startMin: number;
  endMin: number;
}

export interface OpeningRule {
  days: number[];
  ranges: TimeRange[];
}

export interface OpeningStatusResult {
  status: 'open' | 'closed' | 'closing_soon' | 'opening_soon' | 'unknown';
  timeLabel?: string;
  dayLabel?: string;
  minutesLeft?: number;
}

const DAY_MAP: Record<string, number> = {
  mo: 1,
  mon: 1,
  montag: 1,
  di: 2,
  tue: 2,
  dienstag: 2,
  mi: 3,
  wed: 3,
  mittwoch: 3,
  do: 4,
  thu: 4,
  donnerstag: 4,
  fr: 5,
  fri: 5,
  freitag: 5,
  sa: 6,
  sat: 6,
  samstag: 6,
  sonnabend: 6,
  so: 0,
  sun: 0,
  sonntag: 0,
  feiertag: 0,
  holiday: 0,
};

export function parseOpeningHours(str: string): OpeningRule[] {
  const rules: OpeningRule[] = [];
  if (!str) return rules;

  const rawParts = str.split(/[;,]/);
  const parts: string[] = [];
  let buffer = '';
  for (const rawPart of rawParts) {
    if (buffer) {
      buffer += ',' + rawPart;
    } else {
      buffer = rawPart;
    }
    if (/\d{1,2}:\d{2}/.test(rawPart)) {
      parts.push(buffer);
      buffer = '';
    }
  }
  if (buffer) {
    parts.push(buffer);
  }

  for (let part of parts) {
    part = part.trim();
    if (!part) continue;

    const match = part.match(/^([a-zA-Z\s\-öäüß,]+)[\s:]+(.*)$/i);
    let dayStr = '';
    let timeStr = part;

    if (match) {
      dayStr = match[1].trim();
      timeStr = match[2].trim();
    }

    const timeRanges: TimeRange[] = [];
    const rangeMatches = timeStr.matchAll(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/g);
    for (const rangeMatch of rangeMatches) {
      const startMin = parseInt(rangeMatch[1], 10) * 60 + parseInt(rangeMatch[2], 10);
      const endMin = parseInt(rangeMatch[3], 10) * 60 + parseInt(rangeMatch[4], 10);
      timeRanges.push({ startMin, endMin });
    }

    if (timeRanges.length === 0) {
      continue;
    }

    let days: number[] = [0, 1, 2, 3, 4, 5, 6];
    if (dayStr) {
      days = parseDays(dayStr);
    }

    rules.push({ days, ranges: timeRanges });
  }

  return rules;
}

function parseDays(dayStr: string): number[] {
  const days: number[] = [];
  const parts = dayStr.toLowerCase().split(/[\s,]+/);

  for (const part of parts) {
    if (!part) continue;
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = DAY_MAP[startStr.trim()];
      const end = DAY_MAP[endStr.trim()];
      if (start !== undefined && end !== undefined) {
        let current = start;
        while (current !== end) {
          days.push(current);
          current = (current + 1) % 7;
        }
        days.push(end);
      }
    } else {
      const day = DAY_MAP[part.trim()];
      if (day !== undefined) {
        days.push(day);
      }
    }
  }

  return days.length > 0 ? days : [0, 1, 2, 3, 4, 5, 6];
}

export function getOpeningStatus(rules: OpeningRule[], isOpen: boolean, now: Date = new Date()): OpeningStatusResult {
  if (rules.length === 0) {
    return { status: isOpen ? 'open' : 'closed' };
  }

  const today = now.getDay();
  const currentMin = now.getHours() * 60 + now.getMinutes();

  if (isOpen) {
    const todayRules = rules.filter((r) => r.days.includes(today));
    let activeRange: TimeRange | null = null;

    for (const rule of todayRules) {
      for (const range of rule.ranges) {
        if (range.startMin <= currentMin && currentMin < range.endMin) {
          activeRange = range;
          break;
        }
        if (range.startMin > range.endMin) {
          if (currentMin >= range.startMin || currentMin < range.endMin) {
            activeRange = range;
            break;
          }
        }
      }
      if (activeRange) break;
    }

    if (activeRange) {
      const minutesLeft =
        activeRange.startMin > activeRange.endMin
          ? currentMin >= activeRange.startMin
            ? 24 * 60 - currentMin + activeRange.endMin
            : activeRange.endMin - currentMin
          : activeRange.endMin - currentMin;

      const h = Math.floor(activeRange.endMin / 60)
        .toString()
        .padStart(2, '0');
      const m = (activeRange.endMin % 60).toString().padStart(2, '0');

      if (minutesLeft <= 60 && minutesLeft >= 0) {
        return {
          status: 'closing_soon',
          timeLabel: `${h}:${m}`,
          minutesLeft,
        };
      } else {
        return {
          status: 'open',
          timeLabel: `${h}:${m}`,
        };
      }
    }

    return { status: 'open' };
  } else {
    const todayRules = rules.filter((r) => r.days.includes(today));
    let nextRangeToday: TimeRange | null = null;
    let minDiffToday = Infinity;

    for (const rule of todayRules) {
      for (const range of rule.ranges) {
        if (range.startMin > currentMin) {
          const diff = range.startMin - currentMin;
          if (diff < minDiffToday) {
            minDiffToday = diff;
            nextRangeToday = range;
          }
        }
      }
    }

    if (nextRangeToday) {
      const h = Math.floor(nextRangeToday.startMin / 60)
        .toString()
        .padStart(2, '0');
      const m = (nextRangeToday.startMin % 60).toString().padStart(2, '0');
      return {
        status: 'opening_soon',
        timeLabel: `${h}:${m}`,
        dayLabel: 'today',
      };
    }

    for (let i = 1; i <= 7; i++) {
      const nextDay = (today + i) % 7;
      const nextDayRules = rules.filter((r) => r.days.includes(nextDay));
      let earliestRange: TimeRange | null = null;
      let minStartMin = Infinity;

      for (const rule of nextDayRules) {
        for (const range of rule.ranges) {
          if (range.startMin < minStartMin) {
            minStartMin = range.startMin;
            earliestRange = range;
          }
        }
      }

      if (earliestRange) {
        const h = Math.floor(earliestRange.startMin / 60)
          .toString()
          .padStart(2, '0');
        const m = (earliestRange.startMin % 60).toString().padStart(2, '0');
        return {
          status: 'opening_soon',
          timeLabel: `${h}:${m}`,
          dayLabel: i === 1 ? 'tomorrow' : nextDay.toString(),
        };
      }
    }

    return { status: 'closed' };
  }
}

export interface RawOpeningTime {
  start: string;
  end: string;
  text: string;
}

export function parseRawOpeningTimes(rawTimes: RawOpeningTime[]): OpeningRule[] {
  const rules: OpeningRule[] = [];
  if (!Array.isArray(rawTimes)) return rules;

  for (const item of rawTimes) {
    if (!item.start || !item.end) continue;
    const startParts = item.start.split(':');
    const endParts = item.end.split(':');
    if (startParts.length < 2 || endParts.length < 2) continue;

    const startMin = parseInt(startParts[0], 10) * 60 + parseInt(startParts[1], 10);
    const endMin = parseInt(endParts[0], 10) * 60 + parseInt(endParts[1], 10);

    const days = item.text ? parseDays(item.text) : [0, 1, 2, 3, 4, 5, 6];

    rules.push({
      days,
      ranges: [{ startMin, endMin }],
    });
  }

  return rules;
}

export function formatRawOpeningTimes(rawTimes: RawOpeningTime[]): string {
  if (!Array.isArray(rawTimes)) return '';
  return rawTimes
    .map((item) => {
      const start = item.start.split(':').slice(0, 2).join(':');
      const end = item.end.split(':').slice(0, 2).join(':');
      const days = item.text || '';
      return days ? `${days}: ${start}-${end}` : `${start}-${end}`;
    })
    .join(' • ');
}

export function cleanOpeningHoursDisplay(str: string): string {
  if (!str) return '';
  return str.replace(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/g, '$1-$2').replace(/[;,]\s*/g, ' • ');
}

const TRANSLATION_MAP: Record<string, string> = {
  montag: 'day_1',
  dienstag: 'day_2',
  mittwoch: 'day_3',
  donnerstag: 'day_4',
  freitag: 'day_5',
  samstag: 'day_6',
  sonnabend: 'day_6',
  sonntag: 'day_0',
  feiertag: 'holiday',
  täglich: 'daily',
  werktags: 'weekdays',
  wochentags: 'weekdays',
  mo: 'day_1',
  di: 'day_2',
  mi: 'day_3',
  do: 'day_4',
  fr: 'day_5',
  sa: 'day_6',
  so: 'day_0',
  fei: 'holiday',
};

export function translateDays(str: string, hass: HomeAssistant): string {
  if (!str) return '';
  return str.replace(/[a-zA-ZäöüÄÖÜß]+/g, (word) => {
    const lower = word.toLowerCase();
    const key = TRANSLATION_MAP[lower];
    if (key) {
      const localized = localize(hass, `component.tankerkoenig-card.card.${key}`);
      if (localized && !localized.startsWith('component.')) {
        if (word[0] === word[0].toUpperCase()) {
          return localized.charAt(0).toUpperCase() + localized.slice(1);
        }
        return localized;
      }
    }
    return word;
  });
}
