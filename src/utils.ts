import { HassEntity, HomeAssistant } from './types';
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

// Home Assistant serialises its locale enums as these values, not as the member names the
// frontend code uses: TimeFormat.am_pm is stored as '12' and TimeFormat.twenty_four as '24',
// and both 'language' and 'system' mean "work it out from a locale". Matching on the member
// names instead of these values is why a user set to 24 hours could still see AM/PM.
const TIME_FORMAT_TWELVE = '12';
const TIME_FORMAT_TWENTY_FOUR = '24';

// The number formats map onto the locales that produce exactly the separators HA promises.
// Grouping is irrelevant for fuel prices, but the decimal separator is not: a German user
// must read 1,899 and never 1.899.
const NUMBER_FORMAT_LOCALES: Record<string, string> = {
  comma_decimal: 'en-US', // 1,234.56
  decimal_comma: 'de-DE', // 1.234,56
  space_comma: 'fr-FR', // 1 234,56
  quote_decimal: 'de-CH', // 1'234.56
};

/**
 * Picks the locale to format numbers in. `system` means "whatever the browser is set to",
 * which is what passing no locale to Intl does.
 * @param hass The Home Assistant object.
 * @returns A BCP 47 tag, or undefined to fall back to the browser.
 */
function numberLocale(hass: HomeAssistant): string | undefined {
  const format = hass?.locale?.number_format;
  if (format && NUMBER_FORMAT_LOCALES[format]) return NUMBER_FORMAT_LOCALES[format];
  if (format === 'system') return undefined;
  return hass?.language || undefined;
}

/** Same choice for times, which have no per-format override of their own. */
function timeLocale(hass: HomeAssistant): string | undefined {
  return hass?.locale?.time_format === 'system' ? undefined : hass?.language || undefined;
}

/**
 * Formats a number the way the user's Home Assistant profile asks for.
 * @param value The number to format.
 * @param hass The Home Assistant object, used for the locale.
 * @param options Intl options, e.g. a fixed number of fraction digits.
 * @returns The formatted number.
 */
export function formatNumber(value: number, hass: HomeAssistant, options: Intl.NumberFormatOptions = {}): string {
  // 'none' is HA's explicit opt-out of formatting, so it must not go through Intl at all.
  if (hass?.locale?.number_format === 'none') {
    return options.minimumFractionDigits !== undefined ? value.toFixed(options.minimumFractionDigits) : String(value);
  }
  return new Intl.NumberFormat(numberLocale(hass), options).format(value);
}

/** The decimal separator the user's number format produces, read back from the formatter itself. */
export function decimalSeparator(hass: HomeAssistant): string {
  return formatNumber(1.1, hass, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).replace(/[\d\s]/g, '');
}

export interface FormattedPrice {
  /** The euro amount with two decimals, e.g. `1,89`. */
  main: string;
  /** The third decimal the card paints as a superscript, e.g. `9`. */
  superscript: string;
}

/**
 * Splits a fuel price into the part the card renders large and the third decimal it renders
 * as a superscript.
 *
 * The card used to do this by splitting the raw state on '.', which threw outright for a
 * state that carries no decimal point at all (an integer price, or a station reporting
 * `2`) and always printed an English decimal point even for a German user.
 * @param state The raw entity state.
 * @param hass The Home Assistant object, used for the locale.
 * @returns The two parts, or null when the state is not a number.
 */
export function formatPrice(state: string, hass: HomeAssistant): FormattedPrice | null {
  const value = parseFloat(state);
  if (!Number.isFinite(value)) return null;

  const text = formatNumber(value, hass, { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  const separator = decimalSeparator(hass);
  const index = separator ? text.lastIndexOf(separator) : -1;
  if (index === -1) {
    return { main: text, superscript: '' };
  }

  const decimals = text.slice(index + separator.length);
  return {
    main: `${text.slice(0, index)}${separator}${decimals.slice(0, 2)}`,
    superscript: decimals.slice(2, 3),
  };
}

/**
 * Whether the user reads a 12-hour clock.
 * @param hass The Home Assistant object.
 * @returns true or false when the profile is explicit, undefined when the locale decides.
 */
export function usesTwelveHourClock(hass: HomeAssistant): boolean | undefined {
  const format = hass?.locale?.time_format;
  if (format === TIME_FORMAT_TWELVE) return true;
  if (format === TIME_FORMAT_TWENTY_FOUR) return false;
  return undefined;
}

/**
 * Formats a time of day given as minutes past midnight, honouring the user's clock setting.
 * @param minutesFromMidnight Minutes since 00:00; values of 1440 and above wrap.
 * @param hass The Home Assistant object, used for locale and clock settings.
 * @returns The formatted time, e.g. `22:00` or `10:00 PM`.
 */
export function formatTimeOfDay(minutesFromMidnight: number, hass: HomeAssistant): string {
  const date = new Date(2023, 0, 1);
  date.setMinutes(minutesFromMidnight);

  const hour12 = usesTwelveHourClock(hass);
  return date.toLocaleTimeString(timeLocale(hass), {
    // A 24-hour clock wants a padded hour so the badges stay the same width; a 12-hour clock
    // conventionally does not pad, and Intl only pads 'numeric' for some locales.
    hour: hour12 === false ? '2-digit' : 'numeric',
    minute: '2-digit',
    ...(hour12 === undefined ? {} : { hour12 }),
  });
}

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

  const hour12 = usesTwelveHourClock(hass);
  const options: Intl.DateTimeFormatOptions = {
    hour: hour12 === false ? '2-digit' : 'numeric',
    minute: '2-digit',
    ...(hour12 === undefined ? {} : { hour12 }),
  };

  if (!isToday) {
    Object.assign(options, { year: 'numeric', month: 'short', day: '2-digit' });
  }

  return dateObj.toLocaleString(timeLocale(hass), options);
}

/**
 * Why an entity could not be used. Callers switch on this instead of on a boolean, so the
 * card can say what is actually wrong rather than silently rendering a plausible lie - a
 * missing status entity used to be painted as "closed", and a non-numeric price used to
 * take the render down with it.
 */
export type EntityProblem = 'not_found' | 'unavailable' | 'wrong_domain' | 'not_numeric';

export interface ResolvedEntity {
  entityId: string;
  /** Present only when the entity resolved cleanly. */
  stateObj?: HassEntity;
  /** The parsed state, present only when `numeric` was asked for and the state parsed. */
  value?: number;
  /** Absent exactly when the entity is usable. */
  problem?: EntityProblem;
}

export interface ResolveOptions {
  /** Accepted entity domains, e.g. `['binary_sensor']`. Any domain when omitted. */
  domains?: string[];
  /** Require the state to parse as a finite number. */
  numeric?: boolean;
}

/**
 * Looks an entity up and reports, in one typed shape, whether it can be used.
 * @param hass The Home Assistant object.
 * @param entityId The entity to resolve.
 * @param options Domain and numeric requirements.
 * @returns The resolved entity, carrying a `problem` when it is unusable.
 */
export function resolveEntity(
  hass: HomeAssistant | undefined,
  entityId: string | undefined,
  options: ResolveOptions = {},
): ResolvedEntity {
  const id = entityId ?? '';
  const stateObj = id ? hass?.states?.[id] : undefined;

  if (!stateObj) return { entityId: id, problem: 'not_found' };

  if (options.domains && !options.domains.includes(id.split('.')[0])) {
    return { entityId: id, stateObj, problem: 'wrong_domain' };
  }

  // 'unknown' counts as unavailable here: both mean the card has no value to show, and
  // treating either as a normal state is exactly how "unknown" became "closed".
  if (stateObj.state === 'unavailable' || stateObj.state === 'unknown') {
    return { entityId: id, stateObj, problem: 'unavailable' };
  }

  if (options.numeric) {
    const value = parseFloat(stateObj.state);
    if (!Number.isFinite(value)) return { entityId: id, stateObj, problem: 'not_numeric' };
    return { entityId: id, stateObj, value };
  }

  return { entityId: id, stateObj };
}

/**
 * The localised warning a caller renders in place of the entity it could not use.
 * @param hass The Home Assistant object, used for the language.
 * @param resolved The result of `resolveEntity`.
 * @returns The message, or an empty string when there is nothing to warn about.
 */
export function entityProblemMessage(hass: HomeAssistant, resolved: ResolvedEntity): string {
  if (!resolved.problem) return '';
  return localize(hass, `component.tankerkoenig-card.card.entity_${resolved.problem}`, {
    entity: resolved.entityId,
  });
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
  /**
   * The relevant time as minutes past midnight rather than a formatted string: only the
   * caller knows the user's clock setting, and a hard-coded `HH:MM` here reached a 12-hour
   * user as 24-hour text.
   */
  timeMinutes?: number;
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
};

// Holiday tokens are recognised, but deliberately map to no weekday at all. They used to map
// to Sunday, which made a "Feiertag 08:00-20:00" line dictate the card's Sunday hours - a
// station closed on Sundays was then reported as opening at 08:00 every Sunday.
const HOLIDAY_TOKENS = new Set(['feiertag', 'feiertage', 'fei', 'holiday', 'holidays']);

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
  // Tracked separately from `days`: a rule that names only holidays applies to no weekday,
  // which is not the same as a rule whose day names we failed to understand at all.
  let recognised = false;

  for (const part of parts) {
    if (!part) continue;
    if (HOLIDAY_TOKENS.has(part.trim())) {
      recognised = true;
      continue;
    }
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = DAY_MAP[startStr.trim()];
      const end = DAY_MAP[endStr.trim()];
      if (start !== undefined && end !== undefined) {
        recognised = true;
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
        recognised = true;
        days.push(day);
      }
    }
  }

  if (days.length > 0) return days;
  // Nothing we could read - assume the hours are meant for every day, as before.
  return recognised ? [] : [0, 1, 2, 3, 4, 5, 6];
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

      if (minutesLeft <= 60 && minutesLeft >= 0) {
        return {
          status: 'closing_soon',
          timeMinutes: activeRange.endMin,
          minutesLeft,
        };
      } else {
        return {
          status: 'open',
          timeMinutes: activeRange.endMin,
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
      return {
        status: 'opening_soon',
        timeMinutes: nextRangeToday.startMin,
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
        return {
          status: 'opening_soon',
          timeMinutes: earliestRange.startMin,
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

// Written-out day names keep their written-out translation.
const DAY_NAME_MAP: Record<string, string> = {
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
};

// What the integration actually sends for a range is 'Mo-Fr'. Expanding that to
// 'Monday-Friday' made the callout several times wider than the source text, and in Ukrainian
// the full names are the accusative forms the 'opens on ...' badge needs - 'суботу' - which
// reads wrong in a range. Abbreviations therefore stay abbreviations.
const DAY_ABBREVIATION_MAP: Record<string, string> = {
  mo: 'day_short_1',
  di: 'day_short_2',
  mi: 'day_short_3',
  do: 'day_short_4',
  fr: 'day_short_5',
  sa: 'day_short_6',
  so: 'day_short_0',
  fei: 'holiday',
};

const TRANSLATION_MAP: Record<string, string> = { ...DAY_NAME_MAP, ...DAY_ABBREVIATION_MAP };

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
