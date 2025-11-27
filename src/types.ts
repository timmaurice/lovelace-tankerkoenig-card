export interface HassDevice {
  id: string;
  name: string;
  integration?: string;
  name_by_user?: string;
}

export interface FrontendLocaleData {
  language: string;
  number_format: 'comma_decimal' | 'decimal_comma' | 'space_comma' | 'system';
  time_format: '12' | '24' | 'system' | 'am_pm';
  // You can expand this with more properties if needed
}

// A basic representation of the Home Assistant object
export interface HomeAssistant {
  states: { [entity_id: string]: HassEntity };
  entities: { [entity_id: string]: HassEntityRegistryDisplayEntry };
  devices: { [deviceId: string]: HassDevice };
  localize: (key: string, ...args: unknown[]) => string;
  language: string;
  locale: FrontendLocaleData;
  callWS: <T>(message: { type: string; [key: string]: unknown }) => Promise<T>;
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
  show_address?: boolean; // for backwards compatibility
  show_street?: boolean;
  show_postcode?: boolean;
  show_city?: boolean;
  show_last_updated?: boolean;
  show_price_changes?: boolean;
  fuel_types?: ('e5' | 'e10' | 'diesel')[];
  sort_by?: 'e5' | 'e10' | 'diesel' | 'none';
  hide_unavailable_stations?: boolean;
  show_only_cheapest?: boolean;
  show_prices_side_by_side?: boolean;
  font_scale?: number;
  price_bg_color?: string;
  price_font_color?: string;
}
