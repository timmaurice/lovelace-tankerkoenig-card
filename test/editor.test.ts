import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TankerkoenigCardEditor } from '../src/editor';
import { TankerkoenigCardConfig, HomeAssistant } from '../src/types';
import * as utils from '../src/utils';

describe('TankerkoenigCardEditor', () => {
  let element: TankerkoenigCardEditor;
  let config: TankerkoenigCardConfig;

  beforeEach(() => {
    element = new TankerkoenigCardEditor();
    config = {
      type: 'custom:tankerkoenig-card',
      stations: ['device-1', 'device-2', 'device-3'],
    };
    element.hass = {
      devices: {
        'device-1': { id: 'device-1', name: 'Station 1', identifiers: [['tankerkoenig', 'device-1']] },
        'device-2': { id: 'device-2', name: 'Station 2', identifiers: [['tankerkoenig', 'device-2']] },
        'device-3': { id: 'device-3', name: 'Station 3', identifiers: [['tankerkoenig', 'device-3']] },
      },
      entities: {},
      states: {},
      localize: (key: string) => key,
    } as unknown as HomeAssistant;
    document.body.appendChild(element);
    element.setConfig(config);
    utils.resetFailedLogoUrls();
  });

  afterEach(() => {
    if (element && element.parentNode) {
      document.body.removeChild(element);
    }
  });

  describe('Custom element registration', () => {
    it('should not define a stub for ha-expansion-panel', () => {
      // HA ships ha-expansion-panel in a lazily loaded chunk. If the card wins that race,
      // Home Assistant's own customElements.define() throws and settings pages break.
      expect(window.customElements.get('ha-expansion-panel')).toBeUndefined();
    });

    it('should render expansion panels with their header, state and content', async () => {
      await element.updateComplete;

      const panels = element.shadowRoot?.querySelectorAll<HTMLElement & { expanded?: boolean; header?: string }>(
        'ha-expansion-panel',
      );
      expect(panels?.length).toBe(3);

      const panel = panels![0];
      expect(panel.header).toBe('Address Settings');
      expect(panel.expanded).toBe(false);
      // The panel's content lives in its light DOM and must actually be there.
      expect(panel.querySelector('.expansion-content ha-form')).not.toBeNull();
    });

    it('should follow the panel when Home Assistant toggles it', async () => {
      await element.updateComplete;
      const panel = element.shadowRoot?.querySelector('ha-expansion-panel') as HTMLElement;

      // ha-expansion-panel opens itself and announces it with `expanded-changed`. The editor
      // used to listen for a click whose target carried the class 'expansion-panel-summary',
      // but that element lives inside the panel's own shadow root: retargeting makes
      // `e.target` the <ha-expansion-panel> host, so the condition was never true and the
      // editor's state never followed the panel. On the next render Lit then wrote its stale
      // `.expanded` back and the panel snapped shut under the user.
      panel.dispatchEvent(new CustomEvent('expanded-changed', { detail: { expanded: true } }));
      await element.updateComplete;
      expect((element as unknown as { _addressExpanded: boolean })._addressExpanded).toBe(true);

      panel.dispatchEvent(new CustomEvent('expanded-changed', { detail: { expanded: false } }));
      await element.updateComplete;
      expect((element as unknown as { _addressExpanded: boolean })._addressExpanded).toBe(false);
    });

    it('should not toggle a panel when a click merely bubbles out of its content', async () => {
      await element.updateComplete;
      const panel = element.shadowRoot?.querySelector('ha-expansion-panel') as HTMLElement;
      const content = panel.querySelector('.expansion-content') as HTMLElement;

      content.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      await element.updateComplete;

      expect((element as unknown as { _addressExpanded: boolean })._addressExpanded).toBe(false);
    });
  });

  describe('Station logos', () => {
    it('should keep the placeholder after the station list is reordered', async () => {
      // The station rows, and with them the logos, live on the second tab.
      (element as unknown as { _selectedTab: number })._selectedTab = 1;
      await element.updateComplete;

      const logos = element.shadowRoot?.querySelectorAll<HTMLImageElement>('.logo');
      const firstLogo = logos?.[0] as HTMLImageElement;
      const brokenUrl = firstLogo.getAttribute('src') as string;
      firstLogo.dispatchEvent(new Event('error'));
      expect(firstLogo.getAttribute('src')).toBe(utils.FALLBACK_LOGO_URL);

      // The list is unkeyed, so a reorder makes Lit re-commit the URLs positionally.
      element.setConfig({ ...config, stations: ['device-2', 'device-1', 'device-3'] });
      element.requestUpdate();
      await element.updateComplete;
      element.setConfig({ ...config, stations: ['device-1', 'device-2', 'device-3'] });
      element.requestUpdate();
      await element.updateComplete;

      const logosAfter = element.shadowRoot?.querySelectorAll<HTMLImageElement>('.logo');
      const stillBroken = Array.from(logosAfter ?? []).filter((img) => img.getAttribute('src') === brokenUrl);
      expect(stillBroken).toHaveLength(0);
    });
  });

  describe('Saved configuration', () => {
    const savedConfig = (): TankerkoenigCardConfig =>
      (fireEventSpy.mock.calls.at(-1)?.[2] as { config: TankerkoenigCardConfig }).config;

    let fireEventSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      fireEventSpy = vi.spyOn(utils, 'fireEvent');
    });

    afterEach(() => {
      fireEventSpy.mockRestore();
    });

    it('should not write a value that is already the default', async () => {
      // ha-form is handed a fully populated data object so its toggles sit right, and it
      // emits all of it back. Storing those keys filled the YAML with restated defaults.
      element['_valueChanged']({
        detail: { value: { show_street: true, show_postcode: true, show_city: true, show_price_changes: true } },
      });

      const config = savedConfig();
      expect(config.show_price_changes).toBe(true);
      expect('show_street' in config).toBe(false);
      expect('show_postcode' in config).toBe(false);
      expect('show_city' in config).toBe(false);
    });

    it('should remove a key again when the option is switched back to its default', async () => {
      element.setConfig({ ...config, show_price_changes: true });
      element['_valueChanged']({ detail: { value: { show_price_changes: false } } });

      expect('show_price_changes' in savedConfig()).toBe(false);
    });

    it('should drop a cleared colour rather than storing an empty string', async () => {
      element.setConfig({ ...config, price_bg_color: 'rgb(1, 2, 3)' });
      element['_valueChanged']({ detail: { value: { price_bg_color: '' } } });

      expect('price_bg_color' in savedConfig()).toBe(false);
    });

    it('should not store a font scale of 100, which is what the card already uses', async () => {
      element.setConfig({ ...config, font_scale: 120 });
      element['_valueChanged']({ detail: { value: { font_scale: 100 } } });

      expect('font_scale' in savedConfig()).toBe(false);
    });

    it('should drop an empty station entry instead of adding it', async () => {
      // A picker opened and closed without a choice hands back an empty entry, which was
      // saved and then rendered by the card as a station that cannot be found.
      element['_valueChanged']({ detail: { value: { stations: ['device-1', '', 'device-2'] } } });

      expect(savedConfig().stations).toEqual(['device-1', 'device-2']);
    });

    it('should keep a customised station intact when the list is edited', async () => {
      element.setConfig({ ...config, stations: [{ device: 'device-1', name: 'My station' }, 'device-2', 'device-3'] });
      element['_valueChanged']({ detail: { value: { stations: ['device-2', 'device-1'] } } });

      expect(savedConfig().stations).toEqual(['device-2', { device: 'device-1', name: 'My station' }]);
    });

    it('should prune defaults on every path out of the editor, not just the forms', async () => {
      element.setConfig({ ...config, show_city: true, stations: ['device-1', 'device-2', 'device-3'] });
      element['_removeStation'](2);

      const saved = savedConfig();
      expect(saved.stations).toEqual(['device-1', 'device-2']);
      expect('show_city' in saved).toBe(false);
    });
  });

  describe('Customize dialog', () => {
    it('should store a name and a logo on the station it was opened for', async () => {
      const fireEventSpy = vi.spyOn(utils, 'fireEvent');
      element['_showCustomizeDialog']('device-2', 1);
      element['_customizeNameInputValue'] = 'Corner station';
      element['_customizeInputValue'] = 'https://example.com/logo.png';
      element['_confirmCustomize']();

      const saved = (fireEventSpy.mock.calls.at(-1)?.[2] as { config: TankerkoenigCardConfig }).config;
      expect(saved.stations?.[1]).toEqual({
        device: 'device-2',
        name: 'Corner station',
        logo: 'https://example.com/logo.png',
      });
      fireEventSpy.mockRestore();
    });

    it('should fall back to the plain device id when both fields are cleared', async () => {
      const fireEventSpy = vi.spyOn(utils, 'fireEvent');
      element.setConfig({ ...config, stations: ['device-1', { device: 'device-2', name: 'Corner' }, 'device-3'] });
      element['_showCustomizeDialog']({ device: 'device-2', name: 'Corner' }, 1);
      element['_customizeNameInputValue'] = '';
      element['_customizeInputValue'] = '';
      element['_confirmCustomize']();

      const saved = (fireEventSpy.mock.calls.at(-1)?.[2] as { config: TankerkoenigCardConfig }).config;
      expect(saved.stations?.[1]).toBe('device-2');
      fireEventSpy.mockRestore();
    });
  });

  describe('Drag and Drop Sorting', () => {
    it('should reorder stations when drag and drop events occur', async () => {
      const fireEventSpy = vi.spyOn(utils, 'fireEvent');

      await element.updateComplete;

      // Mock the DragEvent
      const createDragEvent = (type: string, dataTransfer?: DataTransfer) => {
        const event = new Event(type) as unknown as DragEvent;
        Object.defineProperty(event, 'dataTransfer', {
          value: dataTransfer,
          writable: true,
        });
        Object.defineProperty(event, 'preventDefault', {
          value: vi.fn(),
        });
        return event;
      };

      const mockDataTransfer = {
        effectAllowed: 'uninitialized',
        dropEffect: 'none',
        setData: vi.fn(),
      } as unknown as DataTransfer;

      interface TestableEditor {
        _draggedIndex: number | null;
        _handleDragStart: (e: DragEvent, index: number) => void;
        _handleDrop: (e: DragEvent, targetIndex: number) => void;
      }

      const testableElement = element as unknown as TestableEditor;

      // Simulate dragging index 0 (device-1)
      const dragStartEvent = createDragEvent('dragstart', mockDataTransfer);
      testableElement._handleDragStart(dragStartEvent, 0);

      // Verify state updated
      expect(testableElement._draggedIndex).toBe(0);

      // Simulate dropping it on index 2 (device-3)
      const dropEvent = createDragEvent('drop');
      testableElement._handleDrop(dropEvent, 2);

      // Validate config-changed event was fired with the correct reordered array
      expect(fireEventSpy).toHaveBeenCalled();
      const eventDetails = fireEventSpy.mock.calls[0][2] as { config: TankerkoenigCardConfig };
      expect(eventDetails.config.stations).toEqual(['device-2', 'device-3', 'device-1']);
    });
  });
});
