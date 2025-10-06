import { LitElement, TemplateResult, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  HomeAssistant,
  LovelaceCard,
  LovelaceCardEditor,
  TankerkoenigCardConfig,
} from './types.js';
import { localize } from './localize';
import styles from './styles/card.styles.scss';

export interface LovelaceHelpers {
  createCardElement(config: { type: string; [key: string]: unknown }): LovelaceCard;
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
  @state() private _config!: TankerkoenigCardConfig;

  public setConfig(config: TankerkoenigCardConfig): void {
    if (!config || !config.stations || !Array.isArray(config.stations) || config.stations.length === 0) {
      throw new Error('You need to define at least one station entity');
    }
    this._config = config;
  }

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    // Ensure that the required Home Assistant components are loaded before creating the editor
    // by loading a core editor that uses them.
    // This is a trick to load the editor dependencies (e.g., ha-entities-picker)
    const helpers = await window.loadCardHelpers();
    if (helpers) {
      const entitiesCard = await helpers.createCardElement({ type: 'entities', entities: [] });
      await (entitiesCard.constructor as LovelaceCardConstructor & { getConfigElement(): Promise<LovelaceCardEditor> }).getConfigElement();
    }

    await import('./editor.js');
    return document.createElement(EDITOR_ELEMENT_NAME) as LovelaceCardEditor;
  }

  public static getStubConfig(): Record<string, unknown> {
    return {
      title: 'Tankerkönig',
      stations: ['sensor.tankerkoenig_aral_super_e5', 'sensor.tankerkoenig_aral_super_e10'],
    };
  }

  public getCardSize(): number {
    return 3;
  }

  protected shouldUpdate(changedProperties: Map<string | number | symbol, unknown>): boolean {
    if (changedProperties.has('_config')) {
      return true;
    }

    const oldHass = changedProperties.get('hass') as HomeAssistant | undefined;

    // Check if the entity that this card uses has changed, or if the language has changed.
    if (oldHass) {
      const hasChanged = this._config.stations.some((entity) => oldHass.states[entity] !== this.hass.states[entity]);

      if (hasChanged || oldHass.language !== this.hass.language) {
        return true;
      }
      return false; // All other hass changes are ignored
    }

    return true; // First render
  }

  protected render(): TemplateResult {
    if (!this._config || !this.hass) {
      return html``;
    }

    return html`
      <ha-card .header=${this._config.title}>
        <div class="card-content">
          ${this._config.stations.map((entity) => {
            const stateObj = this.hass.states[entity];
            if (!stateObj) {
              return html`
                <div class="warning">
                  ${localize(this.hass, 'component.tankerkoenig-card.card.entity_not_found', { entity: entity })}
                </div>
              `;
            }
            const attributes = stateObj.attributes;
            const stationName = attributes.station_name || attributes.friendly_name;
            const address = `${attributes.street || ''} ${attributes.house_number || ''}, ${
              attributes.post_code || ''
            } ${attributes.city || ''}`;

            return html`
              <div class="station ${attributes.is_open ? 'open' : 'closed'}">
                <div class="logo-container">
                  <img
                    class="logo"
                    src="https://raw.githubusercontent.com/home-assistant/brands/master/custom_integrations/tankerkoenig/logo.png"
                    alt="${attributes.brand}"
                  />
                </div>
                <div class="info">
                  <div class="row-1">
                    <span class="station-name">${stationName}</span>
                    <span class="fuel-type">${attributes.fuel_type}</span>
                  </div>
                  ${this._config.show_address
                    ? html`<div class="row-2"><span class="address">${address}</span></div>`
                    : ''}
                </div>
                <div class="price-container">
                  <span class="price">${stateObj.state}</span><span class="unit">€</span>
                </div>
              </div>
            `;
          })}
        </div>
      </ha-card>
    `;
  }

  static styles = [
    css`
      ${unsafeCSS(styles)}
    `,
  ];
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
