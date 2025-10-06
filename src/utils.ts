import { HomeAssistant } from './types';

/**
 * Dispatches a custom event with an optional detail value.
 *
 * @param node The element to dispatch the event from.
 * @param type The name of the event.
 * @param detail The detail value to pass with the event.
 * @param options The options for the event.
 */
export const fireEvent = <T>(node: HTMLElement, type: string, detail?: T, options?: CustomEventInit<T>): void => {
  const event = new CustomEvent(type, { bubbles: true, cancelable: false, composed: true, ...options, detail });
  node.dispatchEvent(event);
};

/**
 * Formats a date string or object into a locale-aware string.
 * @param date The date to format.
 * @param hass The Home Assistant object, used for locale and language settings.
 * @returns A formatted date string.
 */
export function formatDate(date: string | Date, hass: HomeAssistant): string {
  const dateObj = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
  };

  // Respect the user's 12/24 hour format setting from Home Assistant
  if (hass.locale) {
    // hass.locale.time_format can be '12', '24', or 'system'.
    // Let's be explicit. 'system' will fallback to browser default which is what we want.
    if (hass.locale.time_format === '12') {
      options.hour12 = true;
    } else if (hass.locale.time_format === '24') {
      options.hour12 = false;
    }
  }

  return dateObj.toLocaleString(hass.language, options);
}
