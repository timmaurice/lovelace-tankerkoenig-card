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
  });

  afterEach(() => {
    if (element && element.parentNode) {
      document.body.removeChild(element);
    }
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
