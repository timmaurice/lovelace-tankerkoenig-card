import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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
    } as HomeAssistant;

    config = {
      type: 'custom:tankerkoenig-card',
      stations: ['test-device-id'],
    };

    element = document.createElement('tankerkoenig-card') as TankerkoenigCard;
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should create the component instance', () => {
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.tagName.toLowerCase()).toBe('tankerkoenig-card');
  });

  it('should throw an error if no stations are provided', () => {
    expect(() => element.setConfig({ type: 'custom:tankerkoenig-card', stations: [] })).toThrow(
      'You need to define at least one station entity',
    );
  });

  it('should render a title if provided', async () => {
    element.hass = hass;
    element.setConfig({ ...config, title: 'Fuel Prices' });
    await element.updateComplete;

    const card = element.shadowRoot?.querySelector<HaCard>('ha-card');
    expect(card?.header).toBe('Fuel Prices');
  });

  it('should render station details correctly', async () => {
    const commonAttributes = {
      station_name: 'ARAL Tankstelle',
      brand: 'ARAL',
      street: 'Musterstraße',
      house_number: '1',
      post_code: 12345,
      city: 'Musterstadt',
    };

    hass.entities = {
      'sensor.aral_e5': { entity_id: 'sensor.aral_e5', device_id: 'test-device-id' },
      'sensor.aral_e10': { entity_id: 'sensor.aral_e10', device_id: 'test-device-id' },
      'sensor.aral_diesel': { entity_id: 'sensor.aral_diesel', device_id: 'test-device-id' },
      'binary_sensor.aral_status': { entity_id: 'binary_sensor.aral_status', device_id: 'test-device-id' },
    };

    hass.states = {
      'sensor.aral_e5': {
        entity_id: 'sensor.aral_e5',
        state: '1.899',
        attributes: { ...commonAttributes, friendly_name: 'Aral Super E5', fuel_type: 'e5', unit_of_measurement: '€' },
        last_changed: new Date().toISOString(),
        last_updated: new Date().toISOString(),
      },
      'sensor.aral_e10': {
        entity_id: 'sensor.aral_e10',
        state: '1.799',
        attributes: {
          ...commonAttributes,
          friendly_name: 'Aral Super E10',
          fuel_type: 'e10',
          unit_of_measurement: '€',
        },
        last_changed: new Date().toISOString(),
        last_updated: new Date().toISOString(),
      },
      'sensor.aral_diesel': {
        entity_id: 'sensor.aral_diesel',
        state: '1.699',
        attributes: {
          ...commonAttributes,
          friendly_name: 'Aral Diesel',
          fuel_type: 'diesel',
          unit_of_measurement: '€',
        },
        last_changed: new Date().toISOString(),
        last_updated: new Date().toISOString(),
      },
      'binary_sensor.aral_status': {
        entity_id: 'binary_sensor.aral_status',
        state: 'on',
        attributes: { ...commonAttributes, friendly_name: 'Aral Status' },
        last_changed: new Date().toISOString(),
        last_updated: new Date().toISOString(),
      },
    };

    element.hass = hass;
    element.setConfig(config);
    await element.updateComplete;

    const stationEl = element.shadowRoot?.querySelector('.station');
    expect(stationEl).not.toBeNull();

    expect(stationEl?.classList.contains('open')).toBe(true);
    expect(stationEl?.querySelector('.station-name')?.textContent).toBe('ARAL Tankstelle');

    const prices = stationEl?.querySelectorAll('.price-container');
    expect(prices?.length).toBe(3);
    expect(prices?.[0].textContent).toContain('E5');
    expect(prices?.[0].textContent).toContain('1.899');
  });

  it('should show address when show_address is true', async () => {
    config.show_address = true;
    hass.entities = {
      'sensor.aral_e5': { entity_id: 'sensor.aral_e5', device_id: 'test-device-id' },
    };
    hass.states = {
      'sensor.aral_e5': {
        entity_id: 'sensor.aral_e5',
        state: '1.899',
        attributes: {
          street: 'Musterstraße',
          house_number: '1',
          post_code: 12345,
          city: 'Musterstadt',
          station_name: 'ARAL Tankstelle',
          fuel_type: 'e5',
        },
        last_changed: new Date().toISOString(),
        last_updated: new Date().toISOString(),
      },
    };

    element.hass = hass;
    element.setConfig(config);
    await element.updateComplete;

    const addressEl = element.shadowRoot?.querySelector('.address');
    expect(addressEl).not.toBeNull();
    expect(addressEl?.textContent).toBe('Musterstraße 1, 12345 Musterstadt');
  });

  it('should hide address when show_address is false', async () => {
    config.show_address = false;
    hass.entities = {
      'sensor.aral_e5': { entity_id: 'sensor.aral_e5', device_id: 'test-device-id' },
    };
    hass.states = {
      'sensor.aral_e5': {
        entity_id: 'sensor.aral_e5',
        state: '1.899',
        attributes: {},
        last_changed: new Date().toISOString(),
        last_updated: new Date().toISOString(),
      },
    };

    element.hass = hass;
    element.setConfig(config);
    await element.updateComplete;

    const addressEl = element.shadowRoot?.querySelector('.address');
    expect(addressEl).toBeNull();
  });

  it('should sort fuel types based on configuration', async () => {
    config.fuel_types = ['diesel', 'e10', 'e5'];
    hass.entities = {
      'sensor.aral_e5': { entity_id: 'sensor.aral_e5', device_id: 'test-device-id' },
      'sensor.aral_e10': { entity_id: 'sensor.aral_e10', device_id: 'test-device-id' },
      'sensor.aral_diesel': { entity_id: 'sensor.aral_diesel', device_id: 'test-device-id' },
    };
    hass.states = {
      'sensor.aral_e5': {
        entity_id: 'sensor.aral_e5',
        state: '1.899',
        attributes: { station_name: 'ARAL', fuel_type: 'e5', unit_of_measurement: '€' },
        last_changed: '',
        last_updated: '',
      },
      'sensor.aral_e10': {
        entity_id: 'sensor.aral_e10',
        state: '1.799',
        attributes: { station_name: 'ARAL', fuel_type: 'e10', unit_of_measurement: '€' },
        last_changed: '',
        last_updated: '',
      },
      'sensor.aral_diesel': {
        entity_id: 'sensor.aral_diesel',
        state: '1.699',
        attributes: { station_name: 'ARAL', fuel_type: 'diesel', unit_of_measurement: '€' },
        last_changed: '',
        last_updated: '',
      },
    };

    element.hass = hass;
    element.setConfig(config);
    await element.updateComplete;

    const prices = element.shadowRoot?.querySelectorAll('.fuel-type');
    expect(prices?.[0].textContent).toBe('Diesel');
    expect(prices?.[1].textContent).toBe('E10');
    expect(prices?.[2].textContent).toBe('E5');
  });

  it('should hide unavailable fuel types when configured', async () => {
    config.hide_unavailable_fuel = true;
    hass.entities = {
      'sensor.aral_e5': { entity_id: 'sensor.aral_e5', device_id: 'test-device-id' },
      'sensor.aral_e10': { entity_id: 'sensor.aral_e10', device_id: 'test-device-id' },
    };
    hass.states = {
      'sensor.aral_e5': {
        entity_id: 'sensor.aral_e5',
        state: '1.899',
        attributes: { station_name: 'ARAL', fuel_type: 'e5', unit_of_measurement: '€' },
        last_changed: '',
        last_updated: '',
      },
      'sensor.aral_e10': {
        entity_id: 'sensor.aral_e10',
        state: 'unavailable',
        attributes: { station_name: 'ARAL', fuel_type: 'e10', unit_of_measurement: '€' },
        last_changed: '',
        last_updated: '',
      },
    };

    element.hass = hass;
    element.setConfig(config);
    await element.updateComplete;

    const prices = element.shadowRoot?.querySelectorAll('.price-container');
    expect(prices?.length).toBe(1);
    expect(prices?.[0].textContent).toContain('E5');
  });

  it('should sort stations by price when sort_by is configured', async () => {
    config.stations = ['device-1', 'device-2'];
    config.sort_by = 'e10';
    hass.entities = {
      'sensor.station1_e10': { entity_id: 'sensor.station1_e10', device_id: 'device-1' },
      'sensor.station2_e10': { entity_id: 'sensor.station2_e10', device_id: 'device-2' },
    };
    hass.states = {
      'sensor.station1_e10': {
        entity_id: 'sensor.station1_e10',
        state: '1.80',
        attributes: { station_name: 'Station 1', fuel_type: 'e10' },
        last_changed: '',
        last_updated: '',
      },
      'sensor.station2_e10': {
        entity_id: 'sensor.station2_e10',
        state: '1.70',
        attributes: { station_name: 'Station 2', fuel_type: 'e10' },
        last_changed: '',
        last_updated: '',
      },
    };

    element.hass = hass;
    element.setConfig(config);
    await element.updateComplete;

    const stationNames = element.shadowRoot?.querySelectorAll('.station-name');
    expect(stationNames?.[0].textContent).toBe('Station 2');
    expect(stationNames?.[1].textContent).toBe('Station 1');
  });

  it('should fire hass-more-info event on click', async () => {
    hass.entities = {
      'sensor.aral_e5': { entity_id: 'sensor.aral_e5', device_id: 'test-device-id' },
    };
    hass.states = {
      'sensor.aral_e5': {
        entity_id: 'sensor.aral_e5',
        state: '1.899',
        attributes: { fuel_type: 'e5' },
        last_changed: new Date().toISOString(),
        last_updated: new Date().toISOString(),
      },
    };
    element.hass = hass;
    element.setConfig(config);
    await element.updateComplete;

    const priceEl = element.shadowRoot?.querySelector<HTMLElement>('.price-container');
    priceEl?.click();

    expect(fireEventSpy).toHaveBeenCalledWith(element, 'hass-more-info', { entityId: 'sensor.aral_e5' });
  });
});
