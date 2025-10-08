import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor, StationConfig, TankerkoenigCardConfig } from './types';
import { localize } from './localize';
import { fireEvent, getLogoUrl } from './utils';
import editorStyles from './styles/editor.styles.scss';

const GENERAL_SCHEMA = [{ name: 'title', selector: { text: {} } }];
const STATIONS_SCHEMA = [
  {
    name: 'stations',
    selector: {
      device: {
        multiple: true,
        integration: 'tankerkoenig',
      },
    },
  },
];

interface DialogParams {
  index: number;
  deviceId: string;
}

interface HaDialog extends HTMLElement {
  show(): void;
  closingReason?: string;
}

@customElement('tankerkoenig-card-editor')
export class TankerkoenigCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: TankerkoenigCardConfig;
  @state() private _dialogParams: Partial<DialogParams> = {};
  @state() private _customizeInputValue = '';
  @state() private _selectedTab = 0;

  public setConfig(config: TankerkoenigCardConfig): void {
    this._config = config;
  }

  private _valueChanged(ev: { detail: { value: Partial<TankerkoenigCardConfig> } }): void {
    if (!this.hass || !this._config) return;

    const newStations = ev.detail.value.stations || [];

    // Preserve custom logos when stations are re-ordered or removed via the selector
    const stations = newStations.map((deviceId) => {
      return this._config.stations.find((s) => (typeof s === 'string' ? s : s.device) === deviceId) || deviceId;
    });
    const newConfig = { ...this._config, ...ev.detail.value, stations };
    fireEvent(this, 'config-changed', { config: newConfig });
  }

  private _updateStation(index: number, newStation: StationConfig): void {
    if (!this._config) return;
    const stations = [...this._config.stations];
    stations[index] = newStation;
    const newConfig = { ...this._config, stations };
    fireEvent(this, 'config-changed', { config: newConfig });
  }

  private _removeStation(index: number): void {
    if (!this._config) return;
    const stations = [...this._config.stations];
    stations.splice(index, 1);
    const newConfig = { ...this._config, stations };
    fireEvent(this, 'config-changed', { config: newConfig });
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) {
      return html``;
    }

    let schema = [
      {
        name: 'show_address',
        selector: { boolean: {} },
      },
      {
        name: 'show_last_updated',
        selector: { boolean: {} },
      },
      {
        name: 'show_price_changes',
        selector: { boolean: {} },
      },
      {
        name: 'hide_unavailable_stations',
        selector: { boolean: {} },
      },
      {
        name: 'fuel_types',
        selector: {
          select: {
            multiple: true,
            mode: 'list',
            options: [
              {
                value: 'diesel',
                label: localize(this.hass, 'component.tankerkoenig-card.editor.fuel_type_options.diesel'),
              },
              { value: 'e10', label: localize(this.hass, 'component.tankerkoenig-card.editor.fuel_type_options.e10') },
              { value: 'e5', label: localize(this.hass, 'component.tankerkoenig-card.editor.fuel_type_options.e5') },
            ],
          },
        },
      },
      {
        name: 'sort_by',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: 'none', label: localize(this.hass, 'component.tankerkoenig-card.editor.sort_by_options.none') },
              {
                value: 'diesel',
                label: localize(this.hass, 'component.tankerkoenig-card.editor.fuel_type_options.diesel'),
              },
              { value: 'e10', label: localize(this.hass, 'component.tankerkoenig-card.editor.fuel_type_options.e10') },
              { value: 'e5', label: localize(this.hass, 'component.tankerkoenig-card.editor.fuel_type_options.e5') },
            ],
          },
        },
      },
      {
        name: 'show_only_cheapest',
        selector: { boolean: {} },
      },
    ];

    if (!this._config.sort_by || this._config.sort_by === 'none') {
      schema = schema.filter((item) => item.name !== 'show_only_cheapest');
    }

    return html`
      <ha-card>
        <div class="card-content card-config">
          <div class="group">
            <div class="group-header">${localize(this.hass, 'component.tankerkoenig-card.editor.groups.core')}</div>
            <ha-form
              .schema=${GENERAL_SCHEMA}
              .hass=${this.hass}
              .data=${this._config}
              .computeLabel=${(s: { name: string }) =>
                localize(this.hass, `component.tankerkoenig-card.editor.${s.name}`)}
              @value-changed=${this._valueChanged}
            ></ha-form>
          </div>

          <div class="group">
            <div class="group-header">${localize(this.hass, 'component.tankerkoenig-card.editor.stations')}</div>
            <!-- Tabs -->
            <div class="tabs">
              <ha-tab class=${this._selectedTab === 0 ? 'active' : ''} @click=${() => (this._selectedTab = 0)}
                >${localize(this.hass, 'component.tankerkoenig-card.editor.tab_select')}</ha-tab
              >
              <ha-tab class=${this._selectedTab === 1 ? 'active' : ''} @click=${() => (this._selectedTab = 1)}
                >${localize(this.hass, 'component.tankerkoenig-card.editor.tab_customize')}</ha-tab
              >
            </div>
            <div class="tab-content">
              ${this._selectedTab === 0
                ? html` <ha-form
                    .schema=${STATIONS_SCHEMA}
                    .hass=${this.hass}
                    .data=${{
                      stations: (this._config.stations || []).map((s) => (typeof s === 'string' ? s : s.device)),
                    }}
                    .computeLabel=${(s: { name: string }) =>
                      localize(this.hass, `component.tankerkoenig-card.editor.${s.name}`)}
                    @value-changed=${this._valueChanged}
                  ></ha-form>`
                : html` ${(this._config.stations || []).map((station, index) => this._renderStation(station, index))} `}
            </div>
          </div>

          <div class="group">
            <div class="group-header">${localize(this.hass, 'component.tankerkoenig-card.editor.groups.display')}</div>
            <ha-form
              .schema=${schema}
              .hass=${this.hass}
              .data=${this._config}
              .computeLabel=${(s: { name: string }) =>
                localize(this.hass, `component.tankerkoenig-card.editor.${s.name}`)}
              @value-changed=${this._valueChanged}
            ></ha-form>
          </div>
        </div>

        ${this._renderCustomizeDialog()}
      </ha-card>
    `;
  }

  private _renderStation(station: StationConfig, index: number): TemplateResult {
    const deviceId = typeof station === 'string' ? station : station.device;
    const customLogo = typeof station === 'object' ? station.logo : undefined;
    const device = this.hass.devices[deviceId];
    const stationName = device?.name_by_user || device?.name || `Station ${index + 1}`;

    const brand = this._getBrandFromDevice(deviceId);
    const defaultLogo = getLogoUrl(brand);

    return html`
      <div class="station-row">
        <img
          class="logo"
          src="${customLogo || defaultLogo}"
          @error=${(e: Event) => ((e.target as HTMLImageElement).src = getLogoUrl())}
        />
        <span class="station-name">${stationName}</span>
        <ha-icon-button
          .label=${localize(this.hass, 'component.tankerkoenig-card.editor.customize')}
          @click=${() => this._showCustomizeDialog(station, index)}
        >
          <ha-icon icon="mdi:pencil"></ha-icon>
        </ha-icon-button>
        <ha-icon-button
          .label=${localize(this.hass, 'component.tankerkoenig-card.editor.remove')}
          @click=${() => this._removeStation(index)}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </ha-icon-button>
      </div>
    `;
  }

  private _showCustomizeDialog(station: StationConfig, index: number): void {
    console.log('[Tankerkoenig Editor] Firing show-dialog for CustomizeDialog');
    const deviceId = typeof station === 'string' ? station : station.device;
    this._customizeInputValue = typeof station === 'object' ? station.logo || '' : '';
    this._dialogParams = {
      index,
      deviceId,
    };
    this.shadowRoot?.querySelector<HaDialog>('#customize-dialog')?.show();
  }

  private _getBrandFromDevice(deviceId: string): string | undefined {
    // Find an entity for this device that is likely to have the brand attribute.
    // Fuel price sensors are the most reliable source.
    const entityForDevice = Object.values(this.hass.states).find(
      (e) =>
        this.hass.entities[e.entity_id]?.device_id === deviceId &&
        ['e5', 'e10', 'diesel'].includes(e.attributes.fuel_type as string),
    );

    const brand = entityForDevice?.attributes.brand;
    return typeof brand === 'string' && brand.toLowerCase() !== 'none' ? brand : undefined;
  }

  private _renderCustomizeDialog(): TemplateResult {
    return html`
      <ha-dialog
        id="customize-dialog"
        .heading=${localize(this.hass, 'component.tankerkoenig-card.editor.customize')}
        @closed=${(e: Event) => {
          if ((e.target as HaDialog).closingReason !== 'primary') this._customizeInputValue = '';
        }}
      >
        <ha-textfield
          .label=${localize(this.hass, 'component.tankerkoenig-card.editor.logo_url')}
          .placeholder=${localize(this.hass, 'component.tankerkoenig-card.editor.logo_url_placeholder')}
          .value=${this._customizeInputValue}
          @input=${(e: Event) => (this._customizeInputValue = (e.target as HTMLInputElement).value)}
        ></ha-textfield>
        <mwc-button dialogAction="primary" slot="primaryAction" @click=${this._confirmCustomize}>
          ${localize(this.hass, 'component.tankerkoenig-card.editor.save')}
        </mwc-button>
        <mwc-button dialogAction="cancel" slot="secondaryAction">
          ${localize(this.hass, 'component.tankerkoenig-card.editor.cancel')}
        </mwc-button>
      </ha-dialog>
    `;
  }

  private _confirmCustomize(): void {
    const { index, deviceId } = this._dialogParams;
    const value = this._customizeInputValue;

    if (index === undefined || deviceId === undefined) {
      return;
    }

    if (value) {
      this._updateStation(index, { device: deviceId, logo: value });
    } else {
      // If the value is cleared, revert to the simple device ID string
      this._updateStation(index, deviceId);
    }
  }

  static styles = css`
    ${unsafeCSS(editorStyles)}
  `;
}
