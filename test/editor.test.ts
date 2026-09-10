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

      // NOTE: this deliberately does not exercise the panels' @click toggle handlers. Those
      // check `e.target.classList.contains('expansion-panel-summary')`, and the real summary
      // element lives inside ha-expansion-panel's shadow root — which is only present in a real
      // Home Assistant frontend, not here. Synthesising a `.expansion-panel-summary` element in
      // the test and clicking it would only prove that the delegated listener fires for a target
      // the test built itself; it would say nothing about production, where shadow-DOM
      // retargeting makes `e.target` the <ha-expansion-panel> host instead. See the open issue
      // about the toggle handlers in src/editor.ts.
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
