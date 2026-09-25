export interface LovelaceGridOptions {
  columns?: number | 'full';
  min_columns?: number;
  max_columns?: number;
  rows?: number | 'auto';
  min_rows?: number;
  max_rows?: number;
}

export interface HassDevice {
  id: string;
  name: string;
  integration?: string;
  name_by_user?: string;
}

// The serialised values, not the frontend's enum member names: TimeFormat.am_pm is stored as
// '12' and TimeFormat.twenty_four as '24', and both enums carry a 'language' option that the
// previous shape of this type left out entirely.
export interface FrontendLocaleData {
  language: string;
  number_format: 'language' | 'system' | 'comma_decimal' | 'decimal_comma' | 'quote_decimal' | 'space_comma' | 'none';
  time_format: 'language' | 'system' | '12' | '24';
  // You can expand this with more properties if needed
}

// One part of an entity's display name, as Home Assistant composes it from the registries.
export type EntityNameItem = { type: 'entity' | 'device' | 'area' | 'floor' } | { type: 'text'; text: string };

// A basic representation of the Home Assistant object
export interface HomeAssistant {
  states: { [entity_id: string]: HassEntity };
  entities: { [entity_id: string]: HassEntityRegistryDisplayEntry };
  devices: { [deviceId: string]: HassDevice };
  localize: (key: string, ...args: unknown[]) => string;
  language: string;
  locale: FrontendLocaleData;
  callWS: <T>(message: { type: string; [key: string]: unknown }) => Promise<T>;
  /**
   * Composes an entity's name the way Home Assistant's own cards do (since 2026.4). Optional
   * because a hass object from before that release, or a test double, does not carry it.
   */
  formatEntityName?: (
    stateObj: HassEntity,
    name?: string | EntityNameItem | EntityNameItem[],
    options?: { separator?: string },
  ) => string;
  themes?: {
    darkMode?: boolean;
    [key: string]: unknown;
  };
  // You can expand this with more properties from the hass object if needed
}

// A basic representation of a Home Assistant entity state object
export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: {
    friendly_name?: string;
    unit_of_measurement?: string;
    [key: string]: unknown;
  };
  last_changed: string;
  last_updated: string;
}

export interface HassEntityRegistryDisplayEntry {
  entity_id: string;
  display_precision?: number;
  device_id?: string;
  domain?: string;
  platform?: string;
}

// A basic representation of a Lovelace card
export interface LovelaceCard extends HTMLElement {
  hass?: HomeAssistant;
  editMode?: boolean;
  setConfig(config: LovelaceCardConfig): void;
  getCardSize?(): number | Promise<number>;
}

// A basic representation of a Lovelace card configuration
export interface LovelaceCardConfig {
  type: string;
  [key: string]: unknown;
}

export interface LovelaceCardEditor extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: LovelaceCardConfig): void;
}

export type StationConfig = string | { device: string; logo?: string; name?: string };

export interface TankerkoenigCardConfig extends LovelaceCardConfig {
  title?: string;
  stations: StationConfig[];
  /**
   * @deprecated Superseded by show_street / show_postcode / show_city. Still honoured: `false`
   * hides the whole address, and the card warns once when the key is present.
   */
  show_address?: boolean;
  show_street?: boolean;
  show_postcode?: boolean;
  show_city?: boolean;
  clickable_addresses?: boolean;
  map_provider?: 'google' | 'apple' | 'waze';
  show_last_updated?: boolean;
  show_price_changes?: boolean;
  fuel_types?: ('e5' | 'e10' | 'diesel')[];
  sort_by?: 'e5' | 'e10' | 'diesel' | 'none';
  hide_unavailable_stations?: boolean;
  show_only_cheapest?: boolean;
  show_only_cheapest_count?: number;
  show_prices_side_by_side?: boolean;
  font_scale?: number;
  price_bg_color?: string;
  price_font_color?: string;
  show_24_7_badge?: boolean;
  show_opening_status?: boolean;
}
