import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { RgbaStringBase } from 'vanilla-colorful/lib/entrypoints/rgba-string';
import { HomeAssistant, HassEntity, LovelaceCardEditor, StationConfig, TankerkoenigCardConfig } from './types';
import { localize } from './localize';
import { fireEvent, getLogoUrl } from './utils';
import editorStyles from './styles/editor.styles.scss';

// Conditionally define the rgba-string-color-picker to avoid registration conflicts when another card also uses it.
if (!window.customElements.get('rgba-string-color-picker')) {
  window.customElements.define('rgba-string-color-picker', class extends RgbaStringBase {});
}

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
  station: StationConfig;
}

interface HaDialog extends HTMLElement {
  show(): void;
  closingReason?: string;
}

if (!window.customElements.get('ha-expansion-panel')) {
  window.customElements.define(
    'ha-expansion-panel',
    class extends LitElement {
      static styles = css`
        ha-expansion-panel {
          display: block;
        }
      `;
    },
  );
}

@customElement('tankerkoenig-card-editor')
export class TankerkoenigCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: TankerkoenigCardConfig;
  @state() private _dialogParams: Partial<DialogParams> = {};
  @state() private _customizeInputValue = '';
  @state() private _customizeNameInputValue = '';
  @state() private _selectedTab = 0;
  @state() private _activeColorPicker: string | null = null;
  @state() private _addressExpanded = false;
  @state() private _fontExpanded = false;
  @state() private _colorExpanded = false;

  public setConfig(config: TankerkoenigCardConfig): void {
    this._config = config;
  }

  private _valueChanged(ev: { detail: { value: Partial<TankerkoenigCardConfig> } }): void {
    if (!this.hass || !this._config) return;

    const updatedConfig: Partial<TankerkoenigCardConfig> = { ...ev.detail.value };

    // Special handling for stations to preserve custom logos/names when re-ordering or removing via the selector
    // This block only executes if the 'stations' property is explicitly part of the change event.
    if (ev.detail.value.stations !== undefined) {
      const newStations = ev.detail.value.stations || [];
      updatedConfig.stations = newStations.map((deviceId) => {
        return this._config.stations.find((s) => (typeof s === 'string' ? s : s.device) === deviceId) || deviceId;
      });
    }

    fireEvent(this, 'config-changed', { config: { ...this._config, ...updatedConfig } });
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

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('mousedown', this._handleOutsideClick);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('mousedown', this._handleOutsideClick);
  }

  private _handleOutsideClick = (ev: MouseEvent): void => {
    if (!this._activeColorPicker) return;

    const target = ev.composedPath()[0] as HTMLElement;

    // If the click was on any trigger or inside any popup, do nothing.
    if (target.closest('.color-input-wrapper') || target.closest('.color-picker-popup')) {
      return;
    }

    // Otherwise, the click was outside, so close the picker.
    this._closeActiveColorPicker();
  };

  private _closeActiveColorPicker(): void {
    if (!this._activeColorPicker) return;
    const popups = this.shadowRoot?.querySelectorAll<HTMLElement>('.color-picker-popup');
    popups?.forEach((p) => (p.style.display = 'none'));
    this._activeColorPicker = null;
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) {
      return html``;
    }

    let schema = [
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
              <div class="tab ${this._selectedTab === 0 ? 'active' : ''}" @click=${() => (this._selectedTab = 0)}>
                ${localize(this.hass, 'component.tankerkoenig-card.editor.tab_select')}
              </div>
              <div class="tab ${this._selectedTab === 1 ? 'active' : ''}" @click=${() => (this._selectedTab = 1)}>
                ${localize(this.hass, 'component.tankerkoenig-card.editor.tab_customize')}
              </div>
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
            <ha-expansion-panel
              .header=${localize(this.hass, 'component.tankerkoenig-card.editor.groups.address')}
              .expanded=${this._addressExpanded}
              @click=${(e: Event) => {
                if ((e.target as HTMLElement).classList.contains('expansion-panel-summary')) {
                  this._addressExpanded = !this._addressExpanded;
                }
              }}
            >
              <div class="expansion-content">
                <ha-alert
                  alert-type="info"
                  .title=${localize(this.hass, 'component.tankerkoenig-card.editor.show_address_info')}
                >
                  ${localize(this.hass, 'component.tankerkoenig-card.editor.show_address_detail')}
                </ha-alert>
                <ha-form
                  .schema=${[
                    { name: 'show_street', selector: { boolean: {} } },
                    { name: 'show_postcode', selector: { boolean: {} } },
                    { name: 'show_city', selector: { boolean: {} } },
                  ]}
                  .hass=${this.hass}
                  .data=${{
                    show_street: this._config.show_street ?? true,
                    show_postcode: this._config.show_postcode ?? true,
                    show_city: this._config.show_city ?? true,
                  }}
                  .computeLabel=${(s: { name: string }) =>
                    localize(this.hass, `component.tankerkoenig-card.editor.${s.name}`)}
                  @value-changed=${this._valueChanged}
                ></ha-form>
              </div>
            </ha-expansion-panel>

            <ha-expansion-panel
              .header=${localize(this.hass, 'component.tankerkoenig-card.editor.groups.font')}
              .expanded=${this._fontExpanded}
              @click=${(e: Event) => {
                if ((e.target as HTMLElement).classList.contains('expansion-panel-summary')) {
                  this._fontExpanded = !this._fontExpanded;
                }
              }}
            >
              <div class="expansion-content">
                <div class="row">
                  <div class="font-scale-slider">
                    <label for="font_scale"
                      >${localize(this.hass, 'component.tankerkoenig-card.editor.font_scale')}:
                      <span>${this._config.font_scale || 100}%</span></label
                    >
                    <ha-slider
                      id="font_scale"
                      min="70"
                      max="120"
                      step="1"
                      .value=${this._config.font_scale || 100}
                      @change=${(e: Event) => {
                        const newConfig = {
                          ...this._config,
                          font_scale: parseFloat((e.target as HTMLInputElement).value),
                        };
                        fireEvent(this, 'config-changed', { config: newConfig });
                      }}
                    ></ha-slider>
                  </div>
                </div>
              </div>
            </ha-expansion-panel>
            <ha-expansion-panel
              .header=${localize(this.hass, 'component.tankerkoenig-card.editor.groups.color')}
              .expanded=${this._colorExpanded}
              @click=${(e: Event) => {
                if ((e.target as HTMLElement).classList.contains('expansion-panel-summary')) {
                  this._colorExpanded = !this._colorExpanded;
                }
              }}
            >
              <div class="expansion-content">
                <div class="row">
                  ${this._renderColorPicker(
                    'price_bg_color',
                    localize(this.hass, 'component.tankerkoenig-card.editor.price_bg_color'),
                    (this._config.price_bg_color as string) || 'var(--divider-color)',
                  )}
                  ${this._renderColorPicker(
                    'price_font_color',
                    localize(this.hass, 'component.tankerkoenig-card.editor.price_font_color'),
                    (this._config.price_font_color as string) || 'var(--primary-text-color)',
                  )}
                </div>
              </div>
            </ha-expansion-panel>
          </div>
        </div>

        ${this._renderCustomizeDialog()}
      </ha-card>
    `;
  }

  private _renderColorPicker(configValue: keyof TankerkoenigCardConfig, label: string, color: string): TemplateResult {
    return html` <div class="color-input-wrapper">
      <ha-textfield
        .label=${label}
        .value=${this._config[configValue] || ''}
        .configValue=${configValue as string}
        @input=${(e: Event) => {
          const newConfig = { ...this._config, [configValue]: (e.target as HTMLInputElement).value };
          fireEvent(this, 'config-changed', { config: newConfig });
        }}
      ></ha-textfield>
      <div
        class="color-preview"
        style="background-color: ${color}"
        @click=${(e: MouseEvent) => this._toggleColorPicker(e, String(configValue))}
      ></div>
      <div
        class="color-picker-popup"
        data-picker-id=${configValue}
        @mousedown=${(e: MouseEvent) => e.stopPropagation()}
      >
        <rgba-string-color-picker
          .color=${color}
          .configValue=${configValue as string}
          @color-changed=${(ev: CustomEvent) => {
            const newConfig = { ...this._config, [configValue]: ev.detail.value };
            fireEvent(this, 'config-changed', { config: newConfig });
          }}
        ></rgba-string-color-picker>
      </div>
    </div>`;
  }

  private _toggleColorPicker(ev: MouseEvent, pickerId: string): void {
    ev.stopPropagation();
    const targetPopup = this.shadowRoot?.querySelector<HTMLElement>(
      `.color-picker-popup[data-picker-id="${pickerId}"]`,
    );
    if (!targetPopup) return;

    const isVisible = this._activeColorPicker === pickerId;

    this._closeActiveColorPicker();

    if (!isVisible) {
      targetPopup.style.display = 'block';
      this._activeColorPicker = pickerId;
    }
  }

  private _renderStation(station: StationConfig, index: number): TemplateResult {
    const deviceId = typeof station === 'string' ? station : station.device;
    const customLogo = typeof station === 'object' ? station.logo : undefined;
    const customName = typeof station === 'object' ? station.name : undefined;
    const device = this.hass.devices[deviceId];
    const stationName = customName || device?.name_by_user || device?.name || `Station ${index + 1}`;

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
    const deviceId = typeof station === 'string' ? station : station.device;
    this._customizeInputValue = (typeof station === 'object' && station.logo) || '';
    this._customizeNameInputValue = (typeof station === 'object' && station.name) || '';
    this._dialogParams = {
      index,
      station,
      deviceId,
    };
    this.shadowRoot?.querySelector<HaDialog>('#customize-dialog')?.show();
  }

  private _getBrandFromDevice(deviceId: string): string | undefined {
    // Find an entity for this device that is likely to have the brand attribute.
    // Fuel price sensors are the most reliable source.
    const entityForDevice = Object.values(this.hass.states).find(
      (e: HassEntity) =>
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
        @closed=${(e: CustomEvent) => {
          if (e.detail.action === 'confirm') {
            this._confirmCustomize();
          } else {
            this._customizeInputValue = '';
            this._customizeNameInputValue = '';
          }
        }}
      >
        <div>
          <ha-textfield
            .label=${localize(this.hass, 'component.tankerkoenig-card.editor.station_name')}
            .value=${this._customizeNameInputValue}
            @input=${(e: Event) => (this._customizeNameInputValue = (e.target as HTMLInputElement).value)}
          ></ha-textfield>
          <ha-textfield
            .label=${localize(this.hass, 'component.tankerkoenig-card.editor.logo_url')}
            .placeholder=${localize(this.hass, 'component.tankerkoenig-card.editor.logo_url_placeholder')}
            .value=${this._customizeInputValue}
            @input=${(e: Event) => (this._customizeInputValue = (e.target as HTMLInputElement).value)}
          ></ha-textfield>
        </div>
        <button slot="primaryAction" dialogAction="confirm">
          ${localize(this.hass, 'component.tankerkoenig-card.editor.save')}
        </button>
        <button slot="secondaryAction" dialogAction="cancel">
          ${localize(this.hass, 'component.tankerkoenig-card.editor.cancel')}
        </button>
      </ha-dialog>
    `;
  }

  private _confirmCustomize(): void {
    const { index, deviceId, station } = this._dialogParams;
    const logo = this._customizeInputValue;
    const name = this._customizeNameInputValue;

    if (index === undefined || deviceId === undefined || station === undefined) {
      return;
    }

    if (name || logo) {
      const newStationConf: { device: string; name?: string; logo?: string } = { device: deviceId };
      if (name) newStationConf.name = name;
      if (logo) newStationConf.logo = logo;
      this._updateStation(index, newStationConf);
    } else {
      // If the value is cleared, revert to the simple device ID string
      this._updateStation(index, deviceId);
    }
  }

  static styles = css`
    ${unsafeCSS(editorStyles)}
  `;
}
