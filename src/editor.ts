import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { property, state } from 'lit/decorators.js';
import { RgbaStringBase } from 'vanilla-colorful/lib/entrypoints/rgba-string';
import { HomeAssistant, HassEntity, LovelaceCardEditor, StationConfig, TankerkoenigCardConfig } from './types';
import { localize } from './localize';
import { fireEvent, getLogoUrl, handleLogoError, migrateShowAddress, resolveLogoUrl } from './utils';
import editorStyles from './styles/editor.styles.scss';

// Conditionally define the rgba-string-color-picker to avoid registration conflicts when another card also uses it.
if (!window.customElements.get('rgba-string-color-picker')) {
  window.customElements.define('rgba-string-color-picker', class extends RgbaStringBase {});
}

const GENERAL_SCHEMA = [{ name: 'title', selector: { text: {} } }];

// What the card falls back to when a key is absent, mirrored from the card's own render.
// This doubles as the data the display form is fed, so every control shows the value that is
// actually in effect: without it a card that never set fuel_types, sort_by or
// show_only_cheapest_count showed nothing ticked, an empty dropdown and an empty count box,
// while the card was quietly rendering Diesel/E10/E5, no sorting and a count of one.
// The editor's forms have to hand ha-form a fully populated data object or the toggles show
// the wrong position, and ha-form then emits every one of those keys back - which is how a
// config that only says `stations:` ended up with a dozen lines restating the defaults.
// Anything equal to its default is dropped again on the way into the saved config, so
// switching an option back off removes the key rather than pinning the default in YAML.
const CONFIG_DEFAULTS: Record<string, unknown> = {
  show_street: true,
  show_postcode: true,
  show_city: true,
  clickable_addresses: false,
  map_provider: 'google',
  show_last_updated: false,
  show_price_changes: false,
  hide_unavailable_stations: false,
  show_24_7_badge: true,
  show_opening_status: true,
  show_only_cheapest: false,
  show_only_cheapest_count: 1,
  show_prices_side_by_side: false,
  sort_by: 'none',
  fuel_types: ['diesel', 'e10', 'e5'],
  font_scale: 100,
};
interface DialogParams {
  index: number;
  deviceId: string;
  station: StationConfig;
}

/**
 * Strips every key whose value is the card's own default, so the saved configuration says
 * only what the user actually chose.
 * @param config The configuration about to be saved.
 * @returns The same configuration without its redundant keys.
 */
function pruneDefaults(config: TankerkoenigCardConfig): TankerkoenigCardConfig {
  const pruned = { ...config };
  for (const [key, value] of Object.entries(CONFIG_DEFAULTS)) {
    if (JSON.stringify(pruned[key]) === JSON.stringify(value)) {
      delete pruned[key];
    }
  }
  // A cleared text field - a colour, a title - hands back an empty string, which is not a
  // value the card has any use for.
  for (const [key, value] of Object.entries(pruned)) {
    if (value === '' || value === undefined) delete pruned[key];
  }
  return pruned;
}

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
  @state() private _isCustomizeDialogOpen = false;
  @state() private _draggedIndex: number | null = null;
  @state() private _dragOverIndex: number | null = null;

  @state() private _stationsData: { stations: string[] } = { stations: [] };
  @state() private _addressData: {
    show_street: boolean;
    show_postcode: boolean;
    show_city: boolean;
    clickable_addresses: boolean;
    map_provider: string;
  } = {
    show_street: true,
    show_postcode: true,
    show_city: true,
    clickable_addresses: false,
    map_provider: 'google',
  };

  public setConfig(config: TankerkoenigCardConfig): void {
    // The deprecated `show_address` is folded into the three explicit keys here, exactly as
    // the card folds it. Without that, the editor showed the three address switches ON for a
    // card that hides the address, and switching one back on rebuilt the configuration the
    // editor had been handed - so the loop guard in `_valueChanged` swallowed it, no
    // `config-changed` was fired at all, and the address could never be restored from the UI.
    // Working from the migrated configuration also means the next edit writes the deprecated
    // key out of the saved YAML instead of keeping it alive forever.
    const migrated = migrateShowAddress(config);
    this._config = migrated;

    const mappedStations = (migrated.stations || []).map((s) => (typeof s === 'string' ? s : s.device));
    if (JSON.stringify(this._stationsData.stations) !== JSON.stringify(mappedStations)) {
      this._stationsData = { stations: mappedStations };
    }

    const addressData = {
      show_street: migrated.show_street ?? true,
      show_postcode: migrated.show_postcode ?? true,
      show_city: migrated.show_city ?? true,
      clickable_addresses: migrated.clickable_addresses ?? false,
      map_provider: migrated.map_provider ?? 'google',
    };
    if (JSON.stringify(this._addressData) !== JSON.stringify(addressData)) {
      this._addressData = addressData;
    }
  }

  protected shouldUpdate(changedProps: import('lit').PropertyValues): boolean {
    if (
      changedProps.has('_config') ||
      changedProps.has('_selectedTab') ||
      changedProps.has('_addressExpanded') ||
      changedProps.has('_fontExpanded') ||
      changedProps.has('_colorExpanded') ||
      changedProps.has('_activeColorPicker') ||
      changedProps.has('_isCustomizeDialogOpen') ||
      changedProps.has('_stationsData') ||
      changedProps.has('_addressData') ||
      changedProps.has('_customizeInputValue') ||
      changedProps.has('_customizeNameInputValue') ||
      changedProps.has('_draggedIndex') ||
      changedProps.has('_dragOverIndex')
    ) {
      return true;
    }

    const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
    if (oldHass && this.hass && oldHass.language !== this.hass.language) {
      return true;
    }

    // Do NOT re-render on standard hass state updates to prevent ha-device-picker blocking the main thread
    return !oldHass;
  }

  /** The one way out of the editor, so nothing can bypass the default pruning. */
  private _fireConfigChanged(config: TankerkoenigCardConfig): void {
    fireEvent(this, 'config-changed', { config: pruneDefaults(config) });
  }

  private _valueChanged(ev: { detail: { value: Partial<TankerkoenigCardConfig> } }): void {
    if (!this.hass || !this._config) return;

    const updatedConfig: Partial<TankerkoenigCardConfig> = { ...ev.detail.value };

    // Special handling for stations to preserve custom logos/names when re-ordering or removing via the selector
    // This block only executes if the 'stations' property is explicitly part of the change event.
    if (ev.detail.value.stations !== undefined) {
      // A picker that is opened and closed without a choice hands back an empty entry, which
      // was written into the config and then rendered as a station that cannot be found.
      const newStations = (ev.detail.value.stations || []).filter((station) =>
        typeof station === 'string' ? station.trim() !== '' : Boolean(station?.device),
      );
      updatedConfig.stations = newStations.map((deviceId) => {
        return (
          (this._config.stations || []).find((s) => (typeof s === 'string' ? s : s.device) === deviceId) || deviceId
        );
      });
    }

    const newConfig = pruneDefaults({ ...this._config, ...updatedConfig });

    // Prevent infinite loops by checking if anything actually changed
    if (JSON.stringify(this._config) === JSON.stringify(newConfig)) {
      return;
    }

    this._fireConfigChanged(newConfig);
  }

  private _updateStation(index: number, newStation: StationConfig): void {
    if (!this._config) return;
    const stations = [...(this._config.stations || [])];
    stations[index] = newStation;
    this._fireConfigChanged({ ...this._config, stations });
  }

  private _removeStation(index: number): void {
    if (!this._config) return;
    const stations = [...(this._config.stations || [])];
    stations.splice(index, 1);
    this._fireConfigChanged({ ...this._config, stations });
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

  private _getStationsSchema() {
    if (!this.hass) return [];

    const tkEntityIDs = Object.keys(this.hass.entities).filter(
      (eid) => this.hass.entities[eid].platform === 'tankerkoenig',
    );
    const tkDeviceIds = new Set(tkEntityIDs.map((eid) => this.hass.entities[eid].device_id).filter(Boolean));

    const tkDevices = Array.from(tkDeviceIds)
      .map((id) => this.hass.devices[id as string])
      .filter(Boolean);

    const options = tkDevices.map((d) => ({
      value: d.id,
      label: d.name_by_user || d.name || d.id,
    }));

    options.sort((a, b) => a.label.localeCompare(b.label));

    return [
      {
        name: 'stations',
        selector: {
          select: {
            multiple: true,
            mode: 'dropdown',
            custom_value: true,
            options: options,
          },
        },
      },
    ];
  }

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
        name: 'show_24_7_badge',
        selector: { boolean: {} },
      },
      {
        name: 'show_opening_status',
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
      {
        name: 'show_only_cheapest_count',
        selector: { number: { min: 1, mode: 'box' } },
      },
      {
        name: 'show_prices_side_by_side',
        selector: { boolean: {} },
      },
    ];

    if (!this._config.sort_by || this._config.sort_by === 'none') {
      schema = schema.filter((item) => item.name !== 'show_only_cheapest' && item.name !== 'show_only_cheapest_count');
    } else if (!this._config.show_only_cheapest) {
      schema = schema.filter((item) => item.name !== 'show_only_cheapest_count');
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
              ${
                this._selectedTab === 0
                  ? html` <ha-form
                      .schema=${this._getStationsSchema()}
                      .hass=${this.hass}
                      .data=${this._stationsData}
                      .computeLabel=${(s: { name: string }) =>
                        localize(this.hass, `component.tankerkoenig-card.editor.${s.name}`)}
                      @value-changed=${this._valueChanged}
                    ></ha-form>`
                  : html`
                      ${(this._config.stations || []).map((station, index) => this._renderStation(station, index))}
                    `
              }
            </div>
          </div>

          <div class="group">
            <div class="group-header">${localize(this.hass, 'component.tankerkoenig-card.editor.groups.display')}</div>
            <ha-form
              .schema=${schema}
              .hass=${this.hass}
              .data=${{ ...CONFIG_DEFAULTS, ...this._config }}
              .computeLabel=${(s: { name: string }) =>
                localize(this.hass, `component.tankerkoenig-card.editor.${s.name}`)}
              @value-changed=${this._valueChanged}
            ></ha-form>
            <ha-expansion-panel
              .header=${localize(this.hass, 'component.tankerkoenig-card.editor.groups.address')}
              .expanded=${this._addressExpanded}
              @expanded-changed=${(e: CustomEvent<{ expanded: boolean }>) => {
                this._addressExpanded = e.detail.expanded;
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
                    { name: 'clickable_addresses', selector: { boolean: {} } },
                    ...(this._addressData.clickable_addresses
                      ? [
                          {
                            name: 'map_provider',
                            selector: {
                              select: {
                                mode: 'dropdown',
                                options: [
                                  {
                                    value: 'google',
                                    label: localize(
                                      this.hass,
                                      'component.tankerkoenig-card.editor.map_providers.google',
                                    ),
                                  },
                                  {
                                    value: 'apple',
                                    label: localize(
                                      this.hass,
                                      'component.tankerkoenig-card.editor.map_providers.apple',
                                    ),
                                  },
                                  {
                                    value: 'waze',
                                    label: localize(this.hass, 'component.tankerkoenig-card.editor.map_providers.waze'),
                                  },
                                ],
                              },
                            },
                          },
                        ]
                      : []),
                  ]}
                  .hass=${this.hass}
                  .data=${this._addressData}
                  .computeLabel=${(s: { name: string }) =>
                    localize(this.hass, `component.tankerkoenig-card.editor.${s.name}`)}
                  @value-changed=${(ev: { detail: { value: Partial<TankerkoenigCardConfig> } }) => {
                    const newValue = { ...ev.detail.value };
                    // If clickable addresses is turned off, we don't necessarily need to clear map_provider,
                    // but we ensure it reacts appropriately.
                    if (newValue.clickable_addresses === false && this._addressData.clickable_addresses) {
                      newValue.map_provider = 'google';
                    }
                    this._addressData = { ...this._addressData, ...newValue } as typeof this._addressData;
                    this._valueChanged({ detail: { value: newValue } });
                  }}
                ></ha-form>
              </div>
            </ha-expansion-panel>

            <ha-expansion-panel
              .header=${localize(this.hass, 'component.tankerkoenig-card.editor.groups.font')}
              .expanded=${this._fontExpanded}
              @expanded-changed=${(e: CustomEvent<{ expanded: boolean }>) => {
                this._fontExpanded = e.detail.expanded;
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
                        this._fireConfigChanged({
                          ...this._config,
                          font_scale: parseFloat((e.target as HTMLInputElement).value),
                        });
                      }}
                    ></ha-slider>
                  </div>
                </div>
              </div>
            </ha-expansion-panel>
            <ha-expansion-panel
              .header=${localize(this.hass, 'component.tankerkoenig-card.editor.groups.color')}
              .expanded=${this._colorExpanded}
              @expanded-changed=${(e: CustomEvent<{ expanded: boolean }>) => {
                this._colorExpanded = e.detail.expanded;
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
      <ha-input
        .label=${label}
        .value=${this._config[configValue] || ''}
        .configValue=${configValue as string}
        @input=${(e: Event) => {
          this._fireConfigChanged({ ...this._config, [configValue]: (e.target as HTMLInputElement).value });
        }}
      ></ha-input>
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
            this._fireConfigChanged({ ...this._config, [configValue]: ev.detail.value });
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

  private _handleDragStart(e: DragEvent, index: number) {
    this._draggedIndex = index;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', index.toString());
    }
  }

  private _handleDragEnd() {
    this._draggedIndex = null;
  }

  private _handleDragOver(e: DragEvent, targetIndex: number) {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    if (this._draggedIndex !== null && this._draggedIndex !== targetIndex) {
      this._dragOverIndex = targetIndex;
    }
  }

  private _handleDragLeave(e: DragEvent, targetIndex: number) {
    if (this._dragOverIndex === targetIndex) {
      this._dragOverIndex = null;
    }
  }

  private _handleDrop(e: DragEvent, targetIndex: number) {
    e.preventDefault();
    this._dragOverIndex = null;
    if (this._draggedIndex === null || this._draggedIndex === targetIndex) return;

    const newStations = [...(this._config.stations || [])];
    const item = newStations.splice(this._draggedIndex, 1)[0];
    newStations.splice(targetIndex, 0, item);

    this._draggedIndex = null;

    this._fireConfigChanged({ ...this._config, stations: newStations });
  }

  private _handleDragEnter() {
    // Left empty for strict compliance but drop handled by dragover
  }

  private _renderStation(station: StationConfig, index: number): TemplateResult {
    const deviceId = typeof station === 'string' ? station : station.device;
    const customLogo = typeof station === 'object' ? station.logo : undefined;
    const customName = typeof station === 'object' ? station.name : undefined;
    const device = this.hass.devices[deviceId];
    const stationName =
      customName ||
      device?.name_by_user ||
      device?.name ||
      localize(this.hass, 'component.tankerkoenig-card.editor.station_fallback_name', { index: index + 1 });

    const brand = this._getBrandFromDevice(deviceId);
    const defaultLogo = getLogoUrl(brand);

    const isDropAbove = this._dragOverIndex === index && this._draggedIndex !== null && this._draggedIndex > index;
    const isDropBelow = this._dragOverIndex === index && this._draggedIndex !== null && this._draggedIndex < index;

    return html`
      <div
        class="station-row ${this._draggedIndex === index ? 'dragged' : ''} ${
          isDropAbove ? 'drop-above' : ''
        } ${isDropBelow ? 'drop-below' : ''}"
        draggable="true"
        @dragstart=${(e: DragEvent) => this._handleDragStart(e, index)}
        @dragend=${this._handleDragEnd}
        @dragover=${(e: DragEvent) => this._handleDragOver(e, index)}
        @dragleave=${(e: DragEvent) => this._handleDragLeave(e, index)}
        @dragenter=${this._handleDragEnter}
        @drop=${(e: DragEvent) => this._handleDrop(e, index)}
      >
        <div class="drag-handle"><ha-icon icon="mdi:drag"></ha-icon></div>
        <img class="logo" src=${resolveLogoUrl(customLogo || defaultLogo)} @error=${handleLogoError} />
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
    this._isCustomizeDialogOpen = true;
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
        .open=${this._isCustomizeDialogOpen}
        .headerTitle=${localize(this.hass, 'component.tankerkoenig-card.editor.customize')}
        @closed=${(e: Event) => {
          // Fired after every hide, whatever caused it, and without a detail. Save has already
          // written the config by the time it arrives, so all that is left is to reset.
          e.stopPropagation();
          this._isCustomizeDialogOpen = false;
          this._customizeInputValue = '';
          this._customizeNameInputValue = '';
        }}
      >
        <div>
          <ha-input
            .label=${localize(this.hass, 'component.tankerkoenig-card.editor.station_name')}
            .value=${this._customizeNameInputValue}
            @input=${(e: Event) => (this._customizeNameInputValue = (e.target as HTMLInputElement).value)}
          ></ha-input>
          <ha-input
            .label=${localize(this.hass, 'component.tankerkoenig-card.editor.logo_url')}
            .placeholder=${localize(this.hass, 'component.tankerkoenig-card.editor.logo_url_placeholder')}
            .value=${this._customizeInputValue}
            @input=${(e: Event) => (this._customizeInputValue = (e.target as HTMLInputElement).value)}
          ></ha-input>
        </div>
        <div class="dialog-actions" slot="footer">
          <button
            class="action-btn"
            @click=${() => {
              this._isCustomizeDialogOpen = false;
              this._customizeInputValue = '';
              this._customizeNameInputValue = '';
            }}
          >
            ${localize(this.hass, 'component.tankerkoenig-card.editor.cancel')}
          </button>
          <button
            class="action-btn primary"
            @click=${() => {
              this._confirmCustomize();
              this._isCustomizeDialogOpen = false;
            }}
          >
            ${localize(this.hass, 'component.tankerkoenig-card.editor.save')}
          </button>
        </div>
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
      const newStationConf: {
        device: string;
        name?: string;
        logo?: string;
      } = { device: deviceId };
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

const EDITOR_ELEMENT_NAME = 'tankerkoenig-card-editor';

// Guarded for the same reason as the card: @customElement defines
// unconditionally, and a bundle loaded twice would throw on the second pass.
if (!customElements.get(EDITOR_ELEMENT_NAME)) {
  customElements.define(EDITOR_ELEMENT_NAME, TankerkoenigCardEditor);
}
