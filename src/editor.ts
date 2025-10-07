import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor, TankerkoenigCardConfig } from './types';
import { localize } from './localize';
import { fireEvent } from './utils';
import editorStyles from './styles/editor.styles.scss';

@customElement('tankerkoenig-card-editor')
export class TankerkoenigCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: TankerkoenigCardConfig;

  public setConfig(config: TankerkoenigCardConfig): void {
    this._config = config;
  }

  private _valueChanged(ev: CustomEvent): void {
    if (!this.hass || !this._config) return;

    const newConfig = ev.detail.value;
    fireEvent(this, 'config-changed', { config: newConfig });
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) {
      return html``;
    }

    let schema = [
      {
        name: 'title',
        selector: { text: {} },
      },
      {
        name: 'stations',
        selector: {
          device: {
            multiple: true,
            integration: 'tankerkoenig',
          },
        },
      },
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
              .hass=${this.hass}
              .data=${this._config}
              .schema=${schema}
              .computeLabel=${(s: { name: string }) =>
                localize(this.hass, `component.tankerkoenig-card.editor.${s.name}`)}
              @value-changed=${this._valueChanged}
            ></ha-form>
          </div>
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    ${unsafeCSS(editorStyles)}
  `;
}
