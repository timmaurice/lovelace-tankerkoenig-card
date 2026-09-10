import { LitElement, TemplateResult, html, css, unsafeCSS } from 'lit';
import { property, state, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { HomeAssistant, LovelaceCard, LovelaceCardEditor, StationConfig, TankerkoenigCardConfig } from './types.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { localize } from './localize';
import {
  fireEvent,
  formatDate,
  formatPrice,
  formatTimeOfDay,
  entityProblemMessage,
  getLogoUrl,
  handleLogoError,
  resolveLogoUrl,
  parseOpeningHours,
  getOpeningStatus,
  formatRawOpeningTimes,
  parseRawOpeningTimes,
  OpeningRule,
  cleanOpeningHoursDisplay,
  resolveEntity,
  translateDays,
} from './utils';
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

export class TankerkoenigCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @query('ha-card') private _card!: LovelaceCard;
  @state() private _config!: TankerkoenigCardConfig;
  @state() private _priceChanges: Record<string, 'up' | 'down'> = {};
  @state() private _expandedStations: Set<string> = new Set();
  private _stationCache: Record<string, Station> | null = null;
  private _watchedEntities: Set<string> = new Set();
  // Every entity the registry lists for a configured device, whether or not it had a state
  // when the cache was built. Watching these is what lets an entity that only turns up later
  // - a station added while the dashboard is open, or an integration still starting - be
  // picked up without a page reload.
  private _candidateEntities: Set<string> = new Set();

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

  /**
   * The configuration the card picker starts a new card from.
   *
   * Home Assistant calls this before `hass` is necessarily there, and with a list of entities
   * it suggests, so neither may be assumed. The result carries only what actually differs
   * from the card's own defaults: baking `show_street: true` and friends into every new card
   * wrote three lines of YAML that mean exactly nothing.
   * @param hass The Home Assistant object, absent on an early call.
   * @param entities Entity ids Home Assistant suggests for the card.
   * @returns A minimal starting configuration.
   */
  public static getStubConfig(hass?: HomeAssistant, entities?: string[]): Record<string, unknown> {
    const fromRegistry = Object.entries(hass?.entities ?? {})
      .filter(([entityId, entry]) => entry.platform === 'tankerkoenig' && entityId.startsWith('sensor.'))
      .map(([, entry]) => entry.device_id);

    const fromSuggestions = (entities ?? []).map((entityId) => hass?.entities?.[entityId]?.device_id);

    const device = [...fromSuggestions, ...fromRegistry].find((deviceId): deviceId is string => Boolean(deviceId));

    return { title: 'Tankerkönig', stations: device ? [device] : [] };
  }

  public getCardSize(): number {
    return 3;
  }

  /**
   * Sizing for the sections dashboard, which lays cards out on a twelve-column grid rather
   * than in a masonry column. Without this the card is given the default square and a
   * multi-station card is clipped.
   * @returns The grid footprint, in grid units.
   */
  public getGridOptions(): { rows: number; columns: number; min_rows: number; min_columns: number } {
    // One row for the card's own header and padding, then one per station row.
    const stations = Math.max(this._config?.stations?.length ?? 1, 1);
    return { rows: stations + 1, columns: 12, min_rows: 2, min_columns: 6 };
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

    const candidateEntities: Set<string> = new Set();

    config.stations.forEach((station: StationConfig) => {
      const deviceId = typeof station === 'string' ? station : (station as { device: string }).device;

      const deviceEntityIds = deviceToEntities[deviceId] || [];
      deviceEntityIds.forEach((entityId) => candidateEntities.add(entityId));

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
    this._candidateEntities = candidateEntities;
  }

  /**
   * Whether an entity the cache could not use has since turned up. The cache skips a registry
   * entry that has no state yet, so without this check an entity that appeared afterwards - a
   * station added while the dashboard is open, an integration still starting - stayed
   * invisible until the page was reloaded.
   *
   * Deliberately one-directional: an entity that goes away keeps its slot so the card can say
   * which one is missing, rather than quietly dropping a price the user configured.
   * @param oldHass The previous Home Assistant object.
   * @returns true when the station cache has to be rebuilt.
   */
  private _entitiesAppeared(oldHass: HomeAssistant): boolean {
    // A new registry entry can add candidates the cache has never seen at all.
    if (oldHass.entities !== this.hass.entities) return true;

    for (const entityId of this._candidateEntities) {
      if (!this._watchedEntities.has(entityId) && this.hass.states[entityId] !== undefined) {
        return true;
      }
    }
    return false;
  }

  protected shouldUpdate(changedProperties: Map<string | number | symbol, unknown>): boolean {
    if (
      changedProperties.has('_config') ||
      changedProperties.has('_expandedStations') ||
      changedProperties.has('_priceChanges')
    ) {
      if (changedProperties.has('_config')) {
        this._buildStationCache(this.hass, this._config);
      }
      return true;
    }

    const oldHass = changedProperties.get('hass') as HomeAssistant | undefined;
    if (oldHass) {
      if (!this._stationCache) {
        this._buildStationCache(this.hass, this._config);
      }

      if (this._entitiesAppeared(oldHass)) {
        this._buildStationCache(this.hass, this._config);
        this._fetchPriceChanges();
        return true;
      }

      let hasChanged = false;
      for (const entityId of this._watchedEntities) {
        if (oldHass.states[entityId] !== this.hass.states[entityId]) {
          hasChanged = true;
          // Not a break: every changed price entity has to be folded in below.
          this._notePriceChange(oldHass, entityId);
        }
      }

      if (hasChanged || oldHass.language !== this.hass.language) {
        return true;
      }
    }

    return !oldHass; // First render fallback
  }

  private _handleMoreInfo(entityId: string): void {
    fireEvent(this, 'hass-more-info', { entityId });
  }

  private _toggleOpeningHours(stationId: string, event: Event): void {
    event.stopPropagation();
    const expanded = new Set<string>();
    if (!this._expandedStations.has(stationId)) {
      expanded.add(stationId);
    }
    this._expandedStations = expanded;
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('click', this._closeAllTooltips);
  }

  protected updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has('_expandedStations')) {
      if (this._expandedStations.size > 0) {
        document.addEventListener('click', this._closeAllTooltips);
      } else {
        document.removeEventListener('click', this._closeAllTooltips);
      }
    }
    this._markOverflowingNames();
  }

  /**
   * Marks the station names that do not fit their row.
   *
   * The marquee used to be attached to `:hover` for every name, so a name that fits scrolled
   * sideways for no reason the moment the pointer touched it. Overflow is not expressible in
   * CSS, so it has to be measured - here, after each render. A container that is resized
   * without a re-render keeps the previous verdict, which is a far smaller wart than
   * animating text that has nowhere to go.
   */
  private _markOverflowingNames(): void {
    this.shadowRoot?.querySelectorAll<HTMLElement>('.station-name').forEach((name) => {
      name.classList.toggle('can-marquee', name.scrollWidth > name.clientWidth);
    });
  }

  private _closeAllTooltips = (): void => {
    if (this._expandedStations.size > 0) {
      this._expandedStations = new Set();
    }
  };

  /**
   * Folds one observed state change into the price indicators.
   *
   * Once the card is running it already holds both the previous and the current state, which
   * is exactly what the direction arrow needs - so there is no reason to ask the recorder for
   * another 24 hours of history, which is what every observed change used to trigger.
   * @param oldHass The previous Home Assistant object.
   * @param entityId The entity whose state changed.
   */
  private _notePriceChange(oldHass: HomeAssistant, entityId: string): void {
    if (!this._config?.show_price_changes) return;

    const previous = resolveEntity(oldHass, entityId, { numeric: true }).value;
    const current = resolveEntity(this.hass, entityId, { numeric: true }).value;
    // A price that went unavailable and came back says nothing about a direction, so the
    // previous verdict is left standing rather than being cleared at random.
    if (previous === undefined || current === undefined || previous === current) return;

    this._priceChanges = { ...this._priceChanges, [entityId]: current > previous ? 'up' : 'down' };
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

    let history: Record<string, { s: string; lu: number }[]>;
    try {
      history = await this.hass.callWS<Record<string, { s: string; lu: number }[]>>({
        type: 'history/history_during_period',
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        entity_ids: priceEntities,
        minimal_response: true,
        no_attributes: true,
        significant_changes_only: false,
      });
    } catch (error) {
      // An install without the recorder, or one where the call simply fails, rejected here
      // and the unhandled rejection surfaced in the console on every state change. The
      // indicators are a nicety - the card renders perfectly well without them.
      console.warn('tankerkoenig-card: could not load price history', error);
      return;
    }

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
      // Only a status that actually reads 'off' means closed. A station whose status entity
      // is gone or unavailable is not known to be closed, so hiding it would drop a station
      // the user configured on the strength of a guess.
      stationEntries = stationEntries.filter(([, station]) => {
        const status = resolveEntity(this.hass, station.status);
        return !status.stateObj || status.problem !== undefined || status.stateObj.state === 'on';
      });
    }

    // Reading the state straight out of hass.states threw for an entity that has since
    // disappeared from the registry but is still in a stale station cache.
    const sortPrice = (station: Station): number | undefined =>
      resolveEntity(this.hass, station[sortBy as keyof Station], { numeric: true }).value;

    if (sortBy && sortBy !== 'none') {
      stationEntries.sort(([, stationA], [, stationB]) => {
        const priceA = sortPrice(stationA);
        const priceB = sortPrice(stationB);

        if (priceA === undefined) return 1;
        if (priceB === undefined) return -1;

        return priceA - priceB;
      });
    }

    if (this._config.show_only_cheapest && sortBy && sortBy !== 'none') {
      const stationsWithPrice = stationEntries.filter(([, station]) => sortPrice(station) !== undefined);

      if (stationsWithPrice.length > 0) {
        const count = this._config.show_only_cheapest_count || 1;
        if (count === 1) {
          const minPrice = Math.min(...stationsWithPrice.map(([, station]) => sortPrice(station) as number));
          stationEntries = stationsWithPrice.filter(([, station]) => sortPrice(station) === minPrice);
        } else {
          stationEntries = stationsWithPrice.slice(0, count);
        }
      }
    }

    return html`
      <ha-card .header=${this._config.title}>
        <div class="card-content">
          ${stationEntries.map(([stationId, station]) => {
            // The station's attributes - name, address, brand - are read off whichever of its
            // entities is still there. Taking the first configured one on faith crashed the
            // render the moment that entity disappeared while the cache was stale.
            const primary = [station.e5, station.e10, station.diesel, station.status]
              .map((entityId) => resolveEntity(this.hass, entityId))
              .find((resolved) => resolved.stateObj !== undefined);

            if (!primary?.stateObj) {
              return html`
                <div class="warning">
                  ${localize(this.hass, 'component.tankerkoenig-card.card.station_not_found', {
                    station: stationId,
                  })}
                </div>
              `;
            }

            // Tri-state on purpose: undefined means "we do not know", which is not the same
            // as closed. A missing or unavailable status entity used to render a grey
            // "Geschlossen" badge, telling the user something the card had never been told.
            const status = resolveEntity(this.hass, station.status);
            const isOpen = station.status && !status.problem ? status.stateObj?.state === 'on' : undefined;
            const stateObj = primary.stateObj;
            const attributes = stateObj.attributes;
            const device = this.hass.devices[stationId];

            const stationName =
              station.name ||
              device?.name_by_user ||
              device?.name ||
              attributes.station_name ||
              attributes.friendly_name;

            const statusEntity = status.stateObj ?? null;
            const twentyFourSevenAttr =
              statusEntity?.attributes?.twenty_four_seven || statusEntity?.attributes?.twenty_four_seven_status;
            const wholeDayAttr = statusEntity?.attributes?.whole_day;
            const openingHoursAttr =
              statusEntity?.attributes?.opening_hours ||
              statusEntity?.attributes?.opening_times ||
              statusEntity?.attributes?.opening_hours_status;

            const is247 =
              twentyFourSevenAttr === true ||
              wholeDayAttr === true ||
              (typeof openingHoursAttr === 'string' && /24\/7|24h/i.test(openingHoursAttr));

            let openingHours = '';
            let rules: OpeningRule[] = [];

            if (Array.isArray(openingHoursAttr)) {
              openingHours = formatRawOpeningTimes(openingHoursAttr);
              rules = parseRawOpeningTimes(openingHoursAttr);
            } else if (typeof openingHoursAttr === 'string') {
              openingHours = cleanOpeningHoursDisplay(openingHoursAttr);
              rules = parseOpeningHours(openingHoursAttr);
            }

            let badgeHtml: TemplateResult | string = '';
            const show247Badge = this._config.show_24_7_badge !== false;
            const showOpeningStatus = this._config.show_opening_status !== false;

            const clickHandler = openingHours ? (e: Event) => this._toggleOpeningHours(stationId, e) : undefined;
            const badgeTitle = openingHours
              ? localize(this.hass, 'component.tankerkoenig-card.card.click_for_hours')
              : '';

            const handleBadgeKeydown = openingHours
              ? (e: KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this._toggleOpeningHours(stationId, e);
                  }
                }
              : undefined;

            let badgeText = '';
            let badgeClass = '';

            if (is247) {
              if (show247Badge) {
                badgeClass = 'badge-247';
                badgeText = localize(this.hass, 'component.tankerkoenig-card.card.twenty_four_seven_badge');
              }
            } else if (isOpen === undefined && showOpeningStatus) {
              // Nothing told the card whether this station is open. Saying so is the only
              // honest option; the alternative was a confident "closed".
              badgeClass = 'badge-unknown';
              badgeText = localize(this.hass, 'component.tankerkoenig-card.card.status_unknown');
            } else if (openingHours && showOpeningStatus) {
              const status = getOpeningStatus(rules, isOpen === true);
              // A time is only ever rendered when the parser actually found one. Without this
              // guard an open station whose current time falls outside every parsed range was
              // labelled "Schliesst um " with a blank where the time should be.
              const time = status.timeMinutes === undefined ? '' : formatTimeOfDay(status.timeMinutes, this.hass);

              if (status.status === 'closing_soon') {
                badgeClass = 'badge-closing-soon';
                badgeText = localize(this.hass, 'component.tankerkoenig-card.card.closes_soon');
              } else if (status.status === 'open') {
                badgeClass = 'badge-open';
                badgeText = time
                  ? localize(this.hass, 'component.tankerkoenig-card.card.closes_at', { time })
                  : localize(this.hass, 'component.tankerkoenig-card.card.open');
              } else if (status.status === 'opening_soon' && time) {
                badgeClass = 'badge-closed';
                if (status.dayLabel === 'today') {
                  badgeText = localize(this.hass, 'component.tankerkoenig-card.card.opens_at', { time });
                } else if (status.dayLabel === 'tomorrow') {
                  badgeText = localize(this.hass, 'component.tankerkoenig-card.card.opens_tomorrow_at', { time });
                } else if (status.dayLabel) {
                  const dayName = localize(this.hass, `component.tankerkoenig-card.card.day_${status.dayLabel}`);
                  badgeText = localize(this.hass, 'component.tankerkoenig-card.card.opens_day_at', {
                    day: dayName,
                    time,
                  });
                } else {
                  badgeText = localize(this.hass, 'component.tankerkoenig-card.card.closed');
                }
              } else {
                badgeClass = isOpen ? 'badge-open' : 'badge-closed';
                badgeText = isOpen
                  ? localize(this.hass, 'component.tankerkoenig-card.card.open')
                  : localize(this.hass, 'component.tankerkoenig-card.card.closed');
              }
            } else if (showOpeningStatus) {
              badgeClass = isOpen ? 'badge-open' : 'badge-closed';
              badgeText = isOpen
                ? localize(this.hass, 'component.tankerkoenig-card.card.open')
                : localize(this.hass, 'component.tankerkoenig-card.card.closed');
            }

            if (badgeText) {
              // Only a badge that actually opens the opening-hours callout is a button. The
              // rest is a plain label: giving it role="none" and a tabindex stripped its text
              // from the accessibility tree for no gain.
              const isBadgeButton = Boolean(openingHours);
              badgeHtml = html`<span
                class="badge ${badgeClass}"
                @click=${clickHandler}
                @keydown=${handleBadgeKeydown}
                tabindex=${ifDefined(isBadgeButton ? '0' : undefined)}
                role=${ifDefined(isBadgeButton ? 'button' : undefined)}
                aria-expanded=${ifDefined(isBadgeButton ? String(this._expandedStations.has(stationId)) : undefined)}
                title=${badgeTitle}
                >${badgeText}</span
              >`;
            }

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
            // An unavailable station carries no attributes at all, and String(undefined)
            // padded to five characters printed the literal word "undefined" as a postcode.
            const postcode = attributes.postcode;
            if (showPostcode && postcode !== undefined && postcode !== null && String(postcode) !== '') {
              cityPart.push(String(postcode).padStart(5, '0'));
            }
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
              <div
                class="station ${classMap({
                  open: isOpen === true,
                  // Only a station known to be closed is greyed out. An unknown status is
                  // rendered at full contrast, because dimming it reads as "closed".
                  closed: isOpen === false,
                  unknown: isOpen === undefined,
                  'has-expanded-tooltip': this._expandedStations.has(stationId),
                })}"
                role="group"
                aria-label=${stationName}
              >
                <div class="logo-container">
                  ${html`<img
                    class="logo"
                    src=${resolveLogoUrl(station.logo || getLogoUrl(attributes.brand as string))}
                    alt=${attributes.brand}
                    @error=${handleLogoError}
                  />`}
                </div>
                <div class="info">
                  <div class="row-1">
                    <div class="station-name-wrapper">
                      <span class="station-name">${stationName}</span>
                    </div>
                  </div>
                  ${address ? html`<div class="row-2"><span class="address">${addressHtml}</span></div>` : ''}
                  ${
                    badgeHtml || this._config.show_last_updated
                      ? html`<div class="row-3">
                          ${badgeHtml ? html`<div class="badge-container">${badgeHtml}</div>` : ''}
                          ${
                            this._config.show_last_updated
                              ? html`<span class="last-updated">${formatDate(stateObj.last_updated, this.hass)}</span>`
                              : ''
                          }
                        </div>`
                      : ''
                  }
                  <!--
                    A row of its own below the badges, not a tooltip floating over the badge:
                    an absolutely positioned callout covered the next station in the list.
                  -->
                  ${
                    this._expandedStations.has(stationId) && openingHours
                      ? html`<div class="opening-hours-callout" @click=${(e: Event) => e.stopPropagation()}>
                          ${openingHours.split(/\s*•\s*/).map((line) => {
                            const match = line.match(/(.*?)(\d{1,2}:\d{2}.*)/);
                            const days = match ? match[1].replace(/:\s*$/, '').trim() : line;
                            const hours = match ? match[2].trim() : '';
                            const translatedDays = translateDays(days, this.hass);
                            return html`
                              <div class="opening-hours-line">
                                <span class="opening-hours-days">${translatedDays}</span>
                                ${hours ? html`<span class="opening-hours-time">${hours}</span>` : ''}
                              </div>
                            `;
                          })}
                        </div>`
                      : ''
                  }
                </div>
                <div
                  class="prices ${classMap({
                    'prices-side-by-side': this._config.show_prices_side_by_side || false,
                  })}"
                >
                  ${fuelTypesToRender.map((fuel) => {
                    const entityId = station[fuel as keyof Station];
                    if (!entityId) return '';

                    // A configured price entity that cannot be read is worth saying out loud:
                    // rendering '-.--' for a sensor that no longer exists looks like a station
                    // that happens to report no price, and the user never learns why.
                    const resolved = resolveEntity(this.hass, entityId, { numeric: true });
                    if (resolved.problem === 'not_found') {
                      return html`<div class="warning price-warning">
                        ${entityProblemMessage(this.hass, resolved)}
                      </div>`;
                    }

                    const stateObj = resolved.stateObj as NonNullable<typeof resolved.stateObj>;
                    const isUnavailable = resolved.problem !== undefined;

                    const currency = stateObj.attributes.unit_of_measurement || '';
                    // Splitting the raw state on '.' threw whenever the state carried no
                    // decimal point at all, taking the whole card down with it.
                    const price = isUnavailable ? null : formatPrice(stateObj.state, this.hass);
                    const mainPrice = price ? price.main : '-.--';
                    const superPrice = price ? price.superscript : '-';

                    const containerStyle = {
                      '--local-price-bg-color': (this._config.price_bg_color as string) || 'var(--divider-color)',
                      '--local-price-font-color':
                        (this._config.price_font_color as string) || 'var(--primary-text-color)',
                    };

                    const scale = (this._config.font_scale || 100) / 100;

                    const priceStyle = {
                      'font-size': `${1.2 * scale}em`,
                    };

                    const fuelTypeStyle = {
                      'font-size': `${0.85 * scale}em`,
                    };

                    const priceChangeIndicator =
                      this._config.show_price_changes && !isUnavailable ? this._priceChanges[entityId] || '' : '';

                    return html`<div
                      class="price-container ${fuel}"
                      style=${styleMap(containerStyle)}
                      @click=${() => this._handleMoreInfo(entityId)}
                      @keydown=${(e: KeyboardEvent) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          this._handleMoreInfo(entityId);
                        }
                      }}
                      tabindex="0"
                      role="button"
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

// Registered by hand rather than through @customElement, which defines
// unconditionally: an install that collected a duplicate Lovelace resource
// loads this bundle twice, and the second define() throws during module
// evaluation - so the card would not register at all and simply vanish.
if (!customElements.get(ELEMENT_NAME)) {
  customElements.define(ELEMENT_NAME, TankerkoenigCard);
}

if (typeof window !== 'undefined') {
  window.customCards = window.customCards || [];
  if (!window.customCards.some((card) => card.type === ELEMENT_NAME)) {
    window.customCards.push({
      type: ELEMENT_NAME,
      name: 'Tankerkönig Card',
      description: 'A Lovelace card to display German fuel prices from Tankerkönig.',
      documentationURL: 'https://github.com/timmaurice/lovelace-tankerkoenig-card',
    });
  }
}
