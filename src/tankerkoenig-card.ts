import { LitElement, TemplateResult, html, css, unsafeCSS } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { HomeAssistant, LovelaceCard, LovelaceCardEditor, StationConfig, TankerkoenigCardConfig } from './types.js';
import { classMap } from 'lit/directives/class-map.js';
import { localize } from './localize';
import { fireEvent, formatDate, getLogoUrl } from './utils';
import styles from './styles/card.styles.scss';

export interface LovelaceHelpers {
  createCardElement(config: { type: string; [key: string]: unknown }): LovelaceCard;
}

interface Station {
  e5?: string;
  e10?: string;
  diesel?: string;
  name?: string;
  logo?: string;
  status?: string;
}

type LovelaceCardConstructor = new () => LovelaceCard;

const ELEMENT_NAME = 'tankerkoenig-card';
const EDITOR_ELEMENT_NAME = `${ELEMENT_NAME}-editor`;

declare global {
  interface Window {
    customCards?: {
      type: string;
      name: string;
      description: string;
      documentationURL: string;
      preview?: boolean;
    }[];
    loadCardHelpers(): Promise<LovelaceHelpers>;
  }
}

@customElement(ELEMENT_NAME)
export class TankerkoenigCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @query('ha-card') private _card!: LovelaceCard;
  @state() private _config!: TankerkoenigCardConfig;
  @state() private _priceChanges: Record<string, 'up' | 'down'> = {};
  private _stationCache: Record<string, Station> | null = null;
  private _watchedEntities: Set<string> = new Set();

  public setConfig(config: TankerkoenigCardConfig): void {
    if (!config || !config.stations || !Array.isArray(config.stations) || config.stations.length === 0) {
      throw new Error('You need to define at least one station entity');
    }
    this._config = config;
    this._stationCache = null; // Invalidate cache so it recalculates on next update
  }

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    // Ensure that the required Home Assistant components are loaded before creating the editor
    // by loading a core editor that uses them.
    // This is a trick to load the editor dependencies (e.g., ha-entities-picker)
    const helpers = await window.loadCardHelpers();
    const entitiesCard = await helpers.createCardElement({ type: 'entities', entities: [] });
    await (
      entitiesCard.constructor as LovelaceCardConstructor & { getConfigElement(): Promise<LovelaceCardEditor> }
    ).getConfigElement();

    await import('./editor.js');
    return document.createElement(EDITOR_ELEMENT_NAME) as LovelaceCardEditor;
  }

  public static getStubConfig(): Record<string, unknown> {
    return {
      title: 'Tankerkönig',
      stations: [],
      show_street: true,
      show_postcode: true,
      show_city: true,
    };
  }

  public getCardSize(): number {
    return 3;
  }

  private _buildStationCache(hass: HomeAssistant, config: TankerkoenigCardConfig): void {
    const stations: Record<string, Station> = {};
    const watchedEntities: Set<string> = new Set();

    // 1. Pre-map devices to their entity IDs to avoid O(N * M) registry looping
    const deviceToEntities: Record<string, string[]> = {};
    for (const [entityId, entityInfo] of Object.entries(hass.entities)) {
      if (entityInfo.device_id && (entityId.startsWith('sensor.') || entityId.startsWith('binary_sensor.'))) {
        if (!deviceToEntities[entityInfo.device_id]) {
          deviceToEntities[entityInfo.device_id] = [];
        }
        deviceToEntities[entityInfo.device_id].push(entityId);
      }
    }

    config.stations.forEach((station: StationConfig) => {
      const deviceId = typeof station === 'string' ? station : (station as { device: string }).device;

      const deviceEntityIds = deviceToEntities[deviceId] || [];

      if (!stations[deviceId]) {
        stations[deviceId] = {};
      }

      if (typeof station !== 'string' && (station as { logo?: string }).logo) {
        stations[deviceId].logo = (station as { logo: string }).logo;
      }

      if (typeof station !== 'string' && (station as { name?: string }).name) {
        stations[deviceId].name = (station as { name: string }).name;
      }

      deviceEntityIds.forEach((entityId) => {
        const stateObj = hass.states[entityId];
        if (!stateObj) return;

        watchedEntities.add(entityId);
        const fuelType = stateObj.attributes.fuel_type;

        if (fuelType === 'e5') stations[deviceId].e5 = entityId;
        if (fuelType === 'e10') stations[deviceId].e10 = entityId;
        if (fuelType === 'diesel') stations[deviceId].diesel = entityId;
        if (entityId.endsWith('_status')) {
          stations[deviceId].status = entityId;
        }
      });
    });

    this._stationCache = stations;
    this._watchedEntities = watchedEntities;
  }

  protected shouldUpdate(changedProperties: Map<string | number | symbol, unknown>): boolean {
    if (changedProperties.has('_config')) {
      this._buildStationCache(this.hass, this._config);
      return true;
    }

    const oldHass = changedProperties.get('hass') as HomeAssistant | undefined;
    if (oldHass) {
      if (!this._stationCache) {
        this._buildStationCache(this.hass, this._config);
      }

      let hasChanged = false;
      for (const entityId of this._watchedEntities) {
        if (oldHass.states[entityId] !== this.hass.states[entityId]) {
          hasChanged = true;
          break;
        }
      }

      if (hasChanged || oldHass.language !== this.hass.language) {
        if (hasChanged) {
          this._fetchPriceChanges();
        }
        return true;
      }
    }

    return !oldHass; // First render fallback
  }

  private _handleMoreInfo(entityId: string): void {
    fireEvent(this, 'hass-more-info', { entityId });
  }

  private async _fetchPriceChanges(): Promise<void> {
    if (!this._config || !this._config.show_price_changes) return;

    if (!this._stationCache) this._buildStationCache(this.hass, this._config);
    const stations = this._stationCache || {};
    const priceEntities = Object.values(stations)
      .flatMap((s) => [s.e5, s.e10, s.diesel])
      .filter((id): id is string => !!id);

    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

    if (priceEntities.length === 0) return;

    const history = await this.hass.callWS<Record<string, { s: string; lu: number }[]>>({
      type: 'history/history_during_period',
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      entity_ids: priceEntities,
      minimal_response: true,
      no_attributes: true,
      significant_changes_only: false,
    });

    const newPriceChanges: Record<string, 'up' | 'down'> = {};
    for (const entityId of priceEntities) {
      // Filter out null, 'unknown', or 'unavailable' states from history.
      const entityHistory = history[entityId];
      const validHistory = Array.isArray(entityHistory)
        ? entityHistory.filter(
            (entry) => entry && entry.s !== null && entry.s !== 'unknown' && !isNaN(parseFloat(entry.s)),
          )
        : [];

      if (validHistory && validHistory.length > 1) {
        // The history is returned in chronological order. The last item is the most recent.
        const lastStateStr = validHistory[validHistory.length - 1].s;
        const previousStateStr = validHistory[validHistory.length - 2].s;

        const lastState = parseFloat(lastStateStr);
        const previousState = parseFloat(previousStateStr);

        if (!isNaN(lastState) && !isNaN(previousState)) {
          if (lastState > previousState) newPriceChanges[entityId] = 'up';
          else if (lastState < previousState) newPriceChanges[entityId] = 'down';
        }
      }
    }
    this._priceChanges = newPriceChanges;
  }

  protected render(): TemplateResult {
    if (!this._config || !this.hass) {
      return html``;
    }

    const fuelTypesToRender = this._config.fuel_types || ['diesel', 'e10', 'e5'];
    const fuelTypeMap = {
      e5: { label: 'E5' },
      e10: { label: 'E10' },
      diesel: { label: 'Diesel' },
    };

    const sortBy = this._config.sort_by;
    if (!this._stationCache) this._buildStationCache(this.hass, this._config);
    let stationEntries = Object.entries(this._stationCache || {}) as [string, Station][];

    if (this._config.hide_unavailable_stations) {
      stationEntries = stationEntries.filter(
        ([, station]) => !station.status || this.hass.states[station.status].state === 'on',
      );
    }

    if (sortBy && sortBy !== 'none') {
      stationEntries.sort(([, stationA], [, stationB]) => {
        const entityA = stationA[sortBy as keyof Station];
        const entityB = stationB[sortBy as keyof Station];

        if (!entityA) return 1;
        if (!entityB) return -1;

        const priceA = parseFloat(this.hass.states[entityA as string].state);
        const priceB = parseFloat(this.hass.states[entityB as string].state);

        if (isNaN(priceA)) return 1;
        if (isNaN(priceB)) return -1;

        return priceA - priceB;
      });
    }

    if (this._config.show_only_cheapest && sortBy && sortBy !== 'none') {
      const stationsWithPrice = stationEntries.filter(([, station]) => {
        const entityId = station[sortBy as keyof Station];
        return entityId && !isNaN(parseFloat(this.hass.states[entityId].state));
      });

      if (stationsWithPrice.length > 0) {
        const count = this._config.show_only_cheapest_count || 1;
        if (count === 1) {
          const minPrice = Math.min(
            ...stationsWithPrice.map(([, station]) =>
              parseFloat(this.hass.states[station[sortBy as keyof Station]!].state),
            ),
          );
          stationEntries = stationsWithPrice.filter(
            ([, station]) => parseFloat(this.hass.states[station[sortBy as keyof Station]!].state) === minPrice,
          );
        } else {
          stationEntries = stationsWithPrice.slice(0, count);
        }
      }
    }

    return html`
      <ha-card .header=${this._config.title} tabindex="0">
        <div class="card-content">
          ${stationEntries.map(([stationId, station]) => {
            const primaryEntity = station.e5 || station.e10 || station.diesel || station.status;
            if (!primaryEntity) {
              return html`
                <div class="warning">
                  ${localize(this.hass, 'component.tankerkoenig-card.card.station_not_found', {
                    station: stationId,
                  })}
                </div>
              `;
            }

            const isOpen = station.status ? this.hass.states[station.status].state === 'on' : false;
            const stateObj = this.hass.states[primaryEntity];
            const attributes = stateObj.attributes;
            const device = this.hass.devices[stationId];

            const stationName =
              station.name ||
              device?.name_by_user ||
              device?.name ||
              attributes.station_name ||
              attributes.friendly_name;

            const capitalize = (str: string): string =>
              str ? str.toLowerCase().replace(/(?:^|\s|["'([{]|-)+\S/g, (match) => match.toUpperCase()) : '';

            const showStreet = this._config.show_street !== false;
            const showPostcode = this._config.show_postcode !== false;
            const showCity = this._config.show_city !== false;

            const addressParts: string[] = [];
            if (showStreet) {
              const street = capitalize((attributes.street as string) || '');
              const houseNumber = attributes.house_number as string;
              const streetPart = [street, houseNumber && houseNumber.toLowerCase() !== 'none' ? houseNumber.trim() : '']
                .filter(Boolean)
                .join(' ');
              if (streetPart) addressParts.push(streetPart);
            }

            const cityPart: string[] = [];
            if (showPostcode) cityPart.push(String(attributes.postcode).padStart(5, '0'));
            if (showCity) cityPart.push(capitalize((attributes.city as string) || ''));
            const cityPartStr = cityPart.filter(Boolean).join(' ');
            if (cityPartStr) addressParts.push(cityPartStr);

            const address = addressParts.join(', ');

            let addressHtml: string | TemplateResult = address;
            if (this._config.clickable_addresses && address) {
              const fullAddressQuery = [stationName, address].filter(Boolean).join(', ');
              const fallbackQuery =
                attributes.latitude && attributes.longitude
                  ? `${attributes.latitude},${attributes.longitude}`
                  : fullAddressQuery;

              let mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fallbackQuery)}`;
              const provider = this._config.map_provider || 'google';

              if (provider === 'apple') {
                mapsUrl = `https://maps.apple.com/?q=${encodeURIComponent(fullAddressQuery)}${
                  attributes.latitude && attributes.longitude
                    ? `&ll=${attributes.latitude},${attributes.longitude}`
                    : ''
                }`;
              } else if (provider === 'waze') {
                mapsUrl =
                  attributes.latitude && attributes.longitude
                    ? `https://waze.com/ul?ll=${attributes.latitude},${attributes.longitude}&navigate=yes`
                    : `https://waze.com/ul?q=${encodeURIComponent(fullAddressQuery)}`;
              }

              addressHtml = html`<a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="address-link"
                >${address}</a
              >`;
            }

            return html`
              <div class="station ${isOpen ? 'open' : 'closed'}" tabindex="0">
                <div class="logo-container">
                  ${html`<img
                    class="logo"
                    src=${station.logo || getLogoUrl(attributes.brand as string)}
                    alt=${attributes.brand}
                    @error=${(e: Event) => ((e.target as HTMLImageElement).src = getLogoUrl())}
                  />`}
                </div>
                <div class="info">
                  <div class="row-1">
                    <span class="station-name">${stationName}</span>
                  </div>
                  ${address ? html`<div class="row-2"><span class="address">${addressHtml}</span></div>` : ''}
                  ${this._config.show_last_updated
                    ? html`<div class="row-3">
                        <span class="last-updated">${formatDate(stateObj.last_updated, this.hass)}</span>
                      </div>`
                    : ''}
                </div>
                <div
                  class="prices ${classMap({
                    'prices-side-by-side': this._config.show_prices_side_by_side || false,
                  })}"
                >
                  ${fuelTypesToRender.map((fuel) => {
                    const entityId = station[fuel as keyof Station];
                    if (!entityId) return '';

                    const stateObj = this.hass.states[entityId];
                    const isUnavailable = stateObj.state === 'unavailable' || isNaN(parseFloat(stateObj.state));

                    let mainPrice = '-.--';
                    let superPrice = '-';
                    const currency = stateObj.attributes.unit_of_measurement || '';

                    if (!isUnavailable) {
                      const priceParts = stateObj.state.split('.');
                      mainPrice = `${priceParts[0]}.${priceParts[1].substring(0, 2)}`;
                      superPrice = priceParts[1].substring(2, 3);
                    }

                    const containerStyle = {
                      'background-color': (this._config.price_bg_color as string) || 'var(--divider-color)',
                      color: (this._config.price_font_color as string) || 'var(--primary-text-color)',
                    };

                    const scale = (this._config.font_scale || 100) / 100;

                    const priceStyle = {
                      'font-size': `${1.5 * scale}em`,
                    };

                    const fuelTypeStyle = {
                      'font-size': `${1 * scale}em`,
                    };

                    const priceChangeIndicator =
                      this._config.show_price_changes && !isUnavailable ? this._priceChanges[entityId] || '' : '';

                    return html`<div
                      class="price-container"
                      style=${styleMap(containerStyle)}
                      @click=${() => this._handleMoreInfo(entityId)}
                      tabindex="0"
                    >
                      <div class="fuel-header">
                        <span class="fuel-type" style=${styleMap(fuelTypeStyle)}
                          >${fuelTypeMap[fuel as keyof typeof fuelTypeMap].label}</span
                        >
                        <span
                          class="price-change-indicator ${classMap({
                            'price-up': priceChangeIndicator === 'up',
                            'price-down': priceChangeIndicator === 'down',
                          })}"
                        ></span>
                      </div>
                      <span class="price" style=${styleMap(priceStyle)}
                        >${mainPrice}<sup>${superPrice}</sup><span class="currency">${currency}</span></span
                      >
                    </div>`;
                  })}
                </div>
              </div>
            `;
          })}
        </div>
      </ha-card>
    `;
  }

  protected firstUpdated(): void {
    this._fetchPriceChanges();
  }

  static styles = css`
    ${unsafeCSS(styles)}
  `;
}

if (typeof window !== 'undefined') {
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: ELEMENT_NAME,
    name: 'Tankerkönig Card',
    description: 'A Lovelace card to display German fuel prices from Tankerkönig.',
    documentationURL: 'https://github.com/timmaurice/lovelace-tankerkoenig-card',
  });
}
