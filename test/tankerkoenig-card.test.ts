import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest';
import '../src/tankerkoenig-card';
import * as utils from '../src/utils';
import type { TankerkoenigCard } from '../src/tankerkoenig-card';
import { HomeAssistant, TankerkoenigCardConfig } from '../src/types';

// Mock console.info
vi.spyOn(console, 'info').mockImplementation(() => undefined);

// Define a minimal interface for the ha-card element to satisfy TypeScript
interface HaCard extends HTMLElement {
  header?: string;
}

/**
 * Creates a mock station with entities and states.
 * @param id - A unique identifier for the station (e.g., 'aral').
 * @param name - The friendly name of the station.
 * @param brand - The brand of the station.
 * @param prices - An object with fuel prices.
 * @param status - The status of the station ('on' or 'off').
 * @returns An object containing entities and states for the mock station.
 */
const createMockStation = (
  id: string,
  name: string,
  brand: string,
  prices: { e5?: string; e10?: string; diesel?: string },
  status: 'on' | 'off' = 'on',
) => {
  const device_id = `device-${id}`;
  const states: HomeAssistant['states'] = {};
  const entities: HomeAssistant['entities'] = {};
  const devices: HomeAssistant['devices'] = {};

  const commonAttributes = {
    station_name: name,
    brand,
    street: 'Musterstraße',
    house_number: '1',
    postcode: 12345,
    city: 'Musterstadt',
  };

  devices[device_id] = {
    id: device_id,
    name: name,
  };

  for (const fuel of ['e5', 'e10', 'diesel'] as const) {
    if (prices[fuel]) {
      const entity_id = `sensor.${id}_${fuel}`;
      entities[entity_id] = { entity_id, device_id };
      states[entity_id] = {
        entity_id,
        state: prices[fuel] as string,
        attributes: {
          ...commonAttributes,
          friendly_name: `${name} ${fuel.toUpperCase()}`,
          fuel_type: fuel,
          unit_of_measurement: '€',
        },
        last_changed: new Date().toISOString(),
        last_updated: new Date().toISOString(),
      };
    }
  }

  const status_entity_id = `binary_sensor.${id}_status`;
  entities[status_entity_id] = { entity_id: status_entity_id, device_id };
  states[status_entity_id] = {
    entity_id: status_entity_id,
    state: status,
    attributes: { ...commonAttributes, friendly_name: `${name} Status` },
    last_changed: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  };

  return { entities, states, devices, device_id };
};

describe('TankerkoenigCard', () => {
  let element: TankerkoenigCard;
  let hass: HomeAssistant;
  let config: TankerkoenigCardConfig;
  const fireEventSpy = vi.spyOn(utils, 'fireEvent');

  beforeEach(() => {
    hass = {
      localize: (key: string) => key,
      language: 'en',
      locale: {
        language: 'en',
        number_format: 'comma_decimal',
        time_format: '24',
      },
      states: {},
      entities: {},
      devices: {},
      callWS: vi.fn(),
    } as HomeAssistant;

    config = {
      type: 'custom:tankerkoenig-card',
      stations: [],
    };

    element = document.createElement('tankerkoenig-card') as TankerkoenigCard;
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  describe('Initialization and Configuration', () => {
    it('should create the component instance', () => {
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.tagName.toLowerCase()).toBe('tankerkoenig-card');
    });

    it('should throw an error if no stations are provided', () => {
      expect(() => element.setConfig({ type: 'custom:tankerkoenig-card', stations: [] })).toThrow(
        'You need to define at least one station entity',
      );
    });
  });

  describe('Rendering', () => {
    it('should render a title if provided', async () => {
      const station = createMockStation('aral', 'ARAL', 'ARAL', { e5: '1.899' });
      config.stations = [station.device_id];
      config.title = 'Fuel Prices';
      hass.entities = station.entities;
      hass.states = station.states;
      hass.devices = station.devices;
      element.hass = hass;
      element.setConfig(config);
      await element.updateComplete;

      const card = element.shadowRoot?.querySelector<HaCard>('ha-card');
      expect(card?.header).toBe('Fuel Prices');
    });

    it('should render station details correctly', async () => {
      const station = createMockStation('aral', 'ARAL Tankstelle', 'ARAL', {
        e5: '1.899',
        e10: '1.799',
        diesel: '1.699',
      });
      config.stations = [station.device_id];
      hass.entities = station.entities;
      hass.states = station.states;
      hass.devices = station.devices;

      element.hass = hass;
      element.setConfig(config);
      await element.updateComplete;

      const stationEl = element.shadowRoot?.querySelector('.station');
      expect(stationEl).not.toBeNull();

      expect(stationEl?.classList.contains('open')).toBe(true);
      expect(stationEl?.querySelector('.station-name')?.textContent).toBe('ARAL Tankstelle');

      const prices = stationEl?.querySelectorAll('.price-container');
      const fuelTypes = stationEl?.querySelectorAll('.fuel-type');
      const priceValues = stationEl?.querySelectorAll('.price');

      expect(prices?.length).toBe(3);
      expect(fuelTypes?.[0].textContent).toBe('Diesel');
      expect(priceValues?.[0].textContent).toContain('1.69');
      expect(fuelTypes?.[1].textContent).toBe('E10');
      expect(priceValues?.[1].textContent).toContain('1.79');
    });
  });

  describe('Display Options', () => {
    it('should show address when show_address is true', async () => {
      const station = createMockStation('aral', 'ARAL Tankstelle', 'ARAL', { e5: '1.899' });
      config.show_address = true;
      config.stations = [station.device_id];
      hass.entities = station.entities;
      hass.states = station.states;
      hass.devices = station.devices;

      element.hass = hass;
      element.setConfig(config);
      await element.updateComplete;

      const addressEl = element.shadowRoot?.querySelector('.address');
      expect(addressEl).not.toBeNull();
      expect(addressEl?.textContent).toBe('Musterstraße 1, 12345 Musterstadt');
    });

    it('should hide address when show_address is false', async () => {
      const station = createMockStation('aral', 'ARAL Tankstelle', 'ARAL', { e5: '1.899' });
      config.show_address = false;
      config.stations = [station.device_id];
      hass.entities = station.entities;
      hass.states = station.states;
      hass.devices = station.devices;

      element.hass = hass;
      element.setConfig(config);
      await element.updateComplete;

      const addressEl = element.shadowRoot?.querySelector('.address');
      expect(addressEl).toBeNull();
    });

    it('should show last updated when show_last_updated is true', async () => {
      const station = createMockStation('aral', 'ARAL', 'ARAL', { e5: '1.899' });
      config.show_last_updated = true;
      config.stations = [station.device_id];
      hass.entities = station.entities;
      hass.states = station.states;
      hass.devices = station.devices;

      element.hass = hass;
      element.setConfig(config);
      await element.updateComplete;

      const lastUpdatedEl = element.shadowRoot?.querySelector('.last-updated');
      expect(lastUpdatedEl).not.toBeNull();
    });
  });

  describe('Sorting and Filtering', () => {
    it('should sort fuel types based on configuration', async () => {
      const station = createMockStation('aral', 'ARAL', 'ARAL', { e5: '1.899', e10: '1.799', diesel: '1.699' });
      config.fuel_types = ['diesel', 'e10', 'e5'];
      config.stations = [station.device_id];
      hass.entities = station.entities;
      hass.states = station.states;
      hass.devices = station.devices;

      element.hass = hass;
      element.setConfig(config);
      await element.updateComplete;

      const prices = element.shadowRoot?.querySelectorAll('.fuel-type');
      expect(prices?.[0].textContent).toBe('Diesel');
      expect(prices?.[1].textContent).toBe('E10');
      expect(prices?.[2].textContent).toBe('E5');
    });

    it('should hide unavailable stations when configured', async () => {
      const station = createMockStation('aral', 'ARAL', 'ARAL', { e5: '1.899' }, 'off');
      config.hide_unavailable_stations = true;
      config.stations = [station.device_id];
      hass.entities = station.entities;
      hass.states = station.states;
      hass.devices = station.devices;

      element.hass = hass;
      element.setConfig(config);
      await element.updateComplete;

      const stations = element.shadowRoot?.querySelectorAll('.station');
      expect(stations?.length).toBe(0);
    });

    it('should sort stations by price when sort_by is configured', async () => {
      const station1 = createMockStation('station1', 'Station 1', 'Brand1', { e10: '1.80' });
      const station2 = createMockStation('station2', 'Station 2', 'Brand2', { e10: '1.70' });

      config.stations = [station1.device_id, station2.device_id];
      config.sort_by = 'e10';
      hass.entities = { ...station1.entities, ...station2.entities };
      hass.states = { ...station1.states, ...station2.states };
      hass.devices = { ...station1.devices, ...station2.devices };

      element.hass = hass;
      element.setConfig(config);
      await element.updateComplete;

      const stationNames = element.shadowRoot?.querySelectorAll('.station-name');
      expect(stationNames?.[0].textContent).toBe('Station 2');
      expect(stationNames?.[1].textContent).toBe('Station 1');
    });

    describe('show_only_cheapest', () => {
      it('should show only the cheapest station when show_only_cheapest is true', async () => {
        const station1 = createMockStation('station1', 'Station 1', 'Brand1', { e10: '1.80' });
        const station2 = createMockStation('station2', 'Station 2', 'Brand2', { e10: '1.70' });

        config.stations = [station1.device_id, station2.device_id];
        config.sort_by = 'e10';
        config.show_only_cheapest = true;
        hass.entities = { ...station1.entities, ...station2.entities };
        hass.states = { ...station1.states, ...station2.states };
        hass.devices = { ...station1.devices, ...station2.devices };

        element.hass = hass;
        element.setConfig(config);
        await element.updateComplete;

        const stationEls = element.shadowRoot?.querySelectorAll('.station');
        expect(stationEls?.length).toBe(1);
        const stationName = stationEls?.[0].querySelector('.station-name');
        expect(stationName?.textContent).toBe('Station 2');
      });

      it('should show multiple stations if they share the cheapest price', async () => {
        const station1 = createMockStation('station1', 'Station 1', 'Brand1', { e10: '1.80' });
        const station2 = createMockStation('station2', 'Station 2', 'Brand2', { e10: '1.70' });
        const station3 = createMockStation('station3', 'Station 3', 'Brand3', { e10: '1.70' });

        config.stations = [station1.device_id, station2.device_id, station3.device_id];
        config.sort_by = 'e10';
        config.show_only_cheapest = true;
        hass.entities = { ...station1.entities, ...station2.entities, ...station3.entities };
        hass.states = { ...station1.states, ...station2.states, ...station3.states };
        hass.devices = { ...station1.devices, ...station2.devices, ...station3.devices };

        element.hass = hass;
        element.setConfig(config);
        await element.updateComplete;

        const stationEls = element.shadowRoot?.querySelectorAll('.station');
        expect(stationEls?.length).toBe(2);
      });

      it('should not filter stations if show_only_cheapest is true but sort_by is none', async () => {
        const station1 = createMockStation('station1', 'Station 1', 'Brand1', { e10: '1.80' });
        const station2 = createMockStation('station2', 'Station 2', 'Brand2', { e10: '1.70' });

        config.stations = [station1.device_id, station2.device_id];
        config.sort_by = 'none';
        config.show_only_cheapest = true;
        hass.entities = { ...station1.entities, ...station2.entities };
        hass.states = { ...station1.states, ...station2.states };
        hass.devices = { ...station1.devices, ...station2.devices };
        element.hass = hass;
        element.setConfig(config);
        await element.updateComplete;

        expect(element.shadowRoot?.querySelectorAll('.station').length).toBe(2);
      });
    });
  });

  describe('Price Indicators and Data States', () => {
    it('should show price up indicator when price has risen', async () => {
      const station = createMockStation('aral', 'ARAL', 'ARAL', { e5: '1.829' });
      config.stations = [station.device_id];
      config.show_price_changes = true;

      element.setConfig(config);

      (hass.callWS as Mock).mockResolvedValue({
        'sensor.aral_e5': [
          { s: '1.809', lu: Date.now() - 1000 },
          { s: '1.829', lu: Date.now() },
        ],
      });
      hass.entities = station.entities;
      hass.states = station.states;
      hass.devices = station.devices;
      element.hass = hass;
      await element['_fetchPriceChanges']();
      await element.updateComplete;

      const indicator = element.shadowRoot?.querySelector('.price-change-indicator');
      expect(indicator?.classList.contains('price-up')).toBe(true);
    });

    it('should show price down indicator when price has fallen', async () => {
      const station = createMockStation('aral', 'ARAL', 'ARAL', { e5: '1.809' });
      config.stations = [station.device_id];
      config.show_price_changes = true;

      element.setConfig(config);

      (hass.callWS as Mock).mockResolvedValue({
        'sensor.aral_e5': [
          { s: '1.829', lu: Date.now() - 1000 },
          { s: '1.809', lu: Date.now() },
        ],
      });
      hass.entities = station.entities;
      hass.states = station.states;
      hass.devices = station.devices;
      element.hass = hass;
      await element['_fetchPriceChanges']();
      await element.updateComplete;

      const indicator = element.shadowRoot?.querySelector('.price-change-indicator');
      expect(indicator?.classList.contains('price-down')).toBe(true);
    });

    it('should display placeholder for unavailable price', async () => {
      const station = createMockStation('aral', 'ARAL', 'ARAL', { e5: '1.899', e10: 'unavailable' });
      config.stations = [station.device_id];
      config.fuel_types = ['e10', 'e5']; // Set explicit order for test predictability
      hass.entities = station.entities;
      hass.states = station.states;
      hass.devices = station.devices;

      element.hass = hass;
      element.setConfig(config);
      await element.updateComplete;

      const priceValues = element.shadowRoot?.querySelectorAll('.price');
      // e10 is unavailable
      expect(priceValues?.[0].textContent).toContain('-.--');
      // e5 is available
      expect(priceValues?.[1].textContent).toContain('1.89');
    });
  });

  describe('Interactions', () => {
    it('should fire hass-more-info event on click', async () => {
      const station = createMockStation('aral', 'ARAL', 'ARAL', { diesel: '1.899' });
      config.stations = [station.device_id];
      hass.entities = station.entities;
      hass.states = station.states;
      hass.devices = station.devices;
      element.hass = hass;
      element.setConfig(config);
      await element.updateComplete;

      const priceEl = element.shadowRoot?.querySelector<HTMLElement>('.price-container');
      priceEl?.click();

      expect(fireEventSpy).toHaveBeenCalledWith(element, 'hass-more-info', { entityId: 'sensor.aral_diesel' });
    });
  });
});
