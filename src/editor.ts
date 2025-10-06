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

    const schema = [
      {
        name: 'title',
        selector: { text: {} },
        label: localize(this.hass, 'component.tankerkoenig-card.editor.title'),
      },
      {
        name: 'stations',
        selector: {
          entity: {
            domain: 'sensor',
            multiple: true,
          },
        },
        label: localize(this.hass, 'component.tankerkoenig-card.editor.stations'),
      },
      {
        name: 'show_address',
        selector: { boolean: {} },
        label: localize(this.hass, 'component.tankerkoenig-card.editor.show_address'),
      },
    ];

    return html`
      <ha-card>
        <div class="card-content card-config">
          <div class="group">
            <div class="group-header">${localize(this.hass, 'component.tankerkoenig-card.editor.groups.core')}</div>
            <ha-form
              .hass=${this.hass}
              .data=${this._config}
              .schema=${schema}
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
