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

    describe('the deprecated show_address', () => {
      it('should show the switches in the position the card is actually rendering', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        element.setConfig({ ...config, show_address: false });

        // Not "all three ON" while the card hides the address.
        expect(element['_addressData']).toMatchObject({
          show_street: false,
          show_postcode: false,
          show_city: false,
        });
        warn.mockRestore();
      });

      it('should let the address be switched back on instead of trapping the card', () => {
        // The editor used to keep `show_address` and leave the switches ON. Turning
        // show_street back on then rebuilt the configuration the editor had been handed, the
        // loop guard matched, and no config-changed was fired at all - so the address could
        // never be restored from the UI and the deprecated key lived forever.
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        element.setConfig({ ...config, show_address: false });
        fireEventSpy.mockClear();

        element['_valueChanged']({ detail: { value: { show_street: true } } });

        expect(fireEventSpy).toHaveBeenCalledTimes(1);
        expect(fireEventSpy.mock.calls.at(-1)?.[1]).toBe('config-changed');

        const saved = savedConfig();
        // show_street is on by default, so it is pruned rather than restated - and the two
        // parts the user is still hiding are written out explicitly.
        expect('show_address' in saved).toBe(false);
        expect('show_street' in saved).toBe(false);
        expect(saved.show_postcode).toBe(false);
        expect(saved.show_city).toBe(false);
        warn.mockRestore();
      });

      it('should clear the deprecated key on any edit, not just an address one', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        element.setConfig({ ...config, show_address: false });
        fireEventSpy.mockClear();

        element['_valueChanged']({ detail: { value: { show_last_updated: true } } });

        const saved = savedConfig();
        expect('show_address' in saved).toBe(false);
        expect(saved.show_street).toBe(false);
        expect(saved.show_postcode).toBe(false);
        expect(saved.show_city).toBe(false);
        warn.mockRestore();
      });
    });
  });

  describe('Effective values in the form', () => {
    /** The display form is the one that carries the fuel types. */
    const displayData = (): Record<string, unknown> => {
      const forms = Array.from(element.shadowRoot?.querySelectorAll('ha-form') ?? []) as (Element & {
        data?: Record<string, unknown>;
      })[];
      const form = forms.find((candidate) => candidate.data && 'fuel_types' in candidate.data);
      return form?.data as Record<string, unknown>;
    };

    it('should show what the card actually renders, not blanks', async () => {
      // A card that never set these showed nothing ticked, an empty dropdown and an empty
      // count box, while the card was rendering Diesel/E10/E5, no sorting and a count of one.
      await element.updateComplete;

      const data = displayData();
      expect(data.fuel_types).toEqual(['diesel', 'e10', 'e5']);
      expect(data.sort_by).toBe('none');
      expect(data.show_only_cheapest_count).toBe(1);
      expect(data.show_24_7_badge).toBe(true);
      expect(data.show_opening_status).toBe(true);
    });

    it('should let the saved configuration win over the default', async () => {
      // A config that sets some of the keys and not others has to come out of one data object
      // mixed both ways round: the saved values on top, the defaults filling the rest. Asserting
      // only the saved keys passed just as well when the form was handed the raw config, and
      // asserting only the defaults would pass with the spread written the wrong way round.
      element.setConfig({ ...config, sort_by: 'diesel', show_only_cheapest_count: 3 });
      await element.updateComplete;

      const data = displayData();
      expect(data.sort_by).toBe('diesel');
      expect(data.show_only_cheapest_count).toBe(3);
      // Never set, so the form shows what the card renders rather than a blank.
      expect(data.fuel_types).toEqual(['diesel', 'e10', 'e5']);
      expect(data.show_24_7_badge).toBe(true);
    });

    it('should not write those defaults back into the saved configuration', async () => {
      const fireEventSpy = vi.spyOn(utils, 'fireEvent');
      // ha-form emits its whole data object back, defaults and all.
      element['_valueChanged']({
        detail: {
          value: {
            fuel_types: ['diesel', 'e10', 'e5'],
            sort_by: 'none',
            show_only_cheapest_count: 1,
            show_last_updated: true,
          },
        },
      });

      const saved = (fireEventSpy.mock.calls.at(-1)?.[2] as { config: TankerkoenigCardConfig }).config;
      expect(saved.show_last_updated).toBe(true);
      expect('fuel_types' in saved).toBe(false);
      expect('sort_by' in saved).toBe(false);
      expect('show_only_cheapest_count' in saved).toBe(false);
      fireEventSpy.mockRestore();
    });
  });

  describe('Station rows', () => {
    it('should localize the fallback name of a station the registry does not know', async () => {
      element.setConfig({ ...config, stations: ['device-1', 'device-gone'] });
      element['_selectedTab'] = 1;
      await element.updateComplete;

      const names = Array.from(element.shadowRoot?.querySelectorAll('.station-row .station-name') ?? []).map(
        (name) => name.textContent,
      );
      expect(names[1]).toBe('Station 2');

      element.hass = { ...element.hass, language: 'de' };
      element.requestUpdate();
      await element.updateComplete;

      const german = Array.from(element.shadowRoot?.querySelectorAll('.station-row .station-name') ?? []).map(
        (name) => name.textContent,
      );
      expect(german[1]).toBe('Tankstelle 2');
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

    // Since 2026.3 ha-dialog is the Web Awesome dialog. It reads its title from `headerTitle`
    // and has a single `footer` slot; a `heading` property or an action row left in the body
    // is silently ignored or scrolls away with the content.
    it('should hand its title to ha-dialog through headerTitle', async () => {
      element['_showCustomizeDialog']('device-2', 1);
      await element.updateComplete;

      const dialog = element.shadowRoot?.querySelector('ha-dialog') as
        (HTMLElement & { headerTitle?: string; open?: boolean; heading?: string }) | null;
      expect(dialog?.open).toBe(true);
      expect(dialog?.headerTitle).toBe('Customize');
      expect(dialog?.heading).toBeUndefined();
    });

    it('should put Cancel and Save into the footer slot of ha-dialog', async () => {
      element['_showCustomizeDialog']('device-2', 1);
      await element.updateComplete;

      const dialog = element.shadowRoot?.querySelector('ha-dialog');
      const footer = Array.from(dialog?.children ?? []).filter((child) => child.getAttribute('slot') === 'footer');
      expect(footer).toHaveLength(1);
      const labels = Array.from(footer[0].querySelectorAll('button')).map((button) => button.textContent?.trim());
      expect(labels).toEqual(['Cancel', 'Save']);
    });

    it('should reset both fields when the dialog reports it has closed', async () => {
      const fireEventSpy = vi.spyOn(utils, 'fireEvent');
      element['_showCustomizeDialog']('device-2', 1);
      element['_customizeNameInputValue'] = 'Dismissed';
      await element.updateComplete;

      element.shadowRoot?.querySelector('ha-dialog')?.dispatchEvent(new Event('closed'));
      await element.updateComplete;

      expect(element['_isCustomizeDialogOpen']).toBe(false);
      expect(element['_customizeNameInputValue']).toBe('');
      expect(fireEventSpy).not.toHaveBeenCalled();
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
