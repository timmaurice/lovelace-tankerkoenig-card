import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../src/tankerkoenig-card';
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

  beforeEach(() => {
    hass = {
      localize: (key: string) => key,
      states: {},
      language: 'en',
    } as HomeAssistant;

    config = {
      type: 'custom:tankerkoenig-card',
      stations: ['sensor.aral_e5'],
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
    hass.states['sensor.aral_e5'] = {
      entity_id: 'sensor.aral_e5',
      state: '1.899',
      attributes: {
        friendly_name: 'Aral Super E5',
        station_name: 'ARAL Tankstelle',
        fuel_type: 'e5',
        brand: 'ARAL',
        street: 'Musterstraße',
        house_number: '1',
        post_code: 12345,
        city: 'Musterstadt',
        is_open: true,
      },
    };
    element.hass = hass;
    element.setConfig(config);
    await element.updateComplete;

    const stationEl = element.shadowRoot?.querySelector('.station');
    expect(stationEl).not.toBeNull();
    expect(stationEl?.classList.contains('open')).toBe(true);
    expect(stationEl?.querySelector('.station-name')?.textContent).toBe('ARAL Tankstelle');
    expect(stationEl?.querySelector('.fuel-type')?.textContent).toBe('e5');
    expect(stationEl?.querySelector('.price')?.textContent).toBe('1.899');
  });
});
