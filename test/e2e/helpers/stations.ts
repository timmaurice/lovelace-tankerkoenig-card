/**
 * Seeds fuel-station entities in the shape the `tankerkoenig` integration really
 * produces.
 *
 * The card looks a station up by **device id**: it walks `hass.entities` for the
 * entities that belong to that device and sorts them by their `fuel_type`
 * attribute. Home Assistant has no API for creating a device - only an
 * integration can - so the suite borrows devices that already exist in the
 * repository's own docker instance, writes its own states onto their entities,
 * and puts the original states back when it is done. Nothing is deleted, and the
 * attribute shape below is copied from the integration's `sensor.py` /
 * `binary_sensor.py`, not invented.
 */
import { callWebsocket, getState, setState, type StateObject } from './homeassistant';

interface RegistryEntity {
  entity_id: string;
  device_id: string | null;
  platform: string;
}

export interface StationEntities {
  deviceId: string;
  e5: string;
  e10: string;
  diesel: string;
  status: string;
}

export interface StationData {
  brand: string;
  name: string;
  street: string;
  houseNumber: string;
  postcode: string;
  city: string;
  prices: { e5: string; e10: string; diesel: string };
  open: boolean;
}

const snapshots = new Map<string, StateObject | null>();

/**
 * Finds devices that carry a full set of fuel entities - three price sensors and
 * a status binary sensor - which is exactly what the integration creates per
 * station.
 */
export async function findStations(count: number): Promise<StationEntities[]> {
  const entities = await callWebsocket<RegistryEntity[]>({ type: 'config/entity_registry/list' });
  const byDevice = new Map<string, string[]>();
  for (const entity of entities) {
    if (!entity.device_id) continue;
    if (!entity.entity_id.startsWith('sensor.') && !entity.entity_id.startsWith('binary_sensor.')) continue;
    const list = byDevice.get(entity.device_id) ?? [];
    list.push(entity.entity_id);
    byDevice.set(entity.device_id, list);
  }

  const found: StationEntities[] = [];
  for (const [deviceId, ids] of byDevice) {
    const sensors = ids.filter((id) => id.startsWith('sensor.'));
    const status = ids.find((id) => id.startsWith('binary_sensor.') && id.endsWith('_status'));
    if (!status || sensors.length < 3) continue;
    found.push({ deviceId, e5: sensors[0], e10: sensors[1], diesel: sensors[2], status });
    if (found.length === count) break;
  }

  if (found.length < count) {
    throw new Error(
      `Need ${count} station device(s) with three sensors and a status binary sensor, found ${found.length}. ` +
        'Configure the tankerkoenig integration in the docker instance first.',
    );
  }
  return found;
}

/**
 * One station by position. Spec files run in parallel, so each asks for a
 * different index and they never write onto the same entities.
 */
export async function findStation(index: number): Promise<StationEntities> {
  const stations = await findStations(index + 1);
  return stations[index];
}

async function remember(entityId: string): Promise<void> {
  if (!snapshots.has(entityId)) snapshots.set(entityId, await getState(entityId));
}

/** Writes one station, attribute for attribute the way the integration does. */
export async function seedStation(station: StationEntities, data: StationData): Promise<void> {
  const common = {
    brand: data.brand,
    station_name: data.name,
    street: data.street,
    house_number: data.houseNumber,
    postcode: data.postcode,
    city: data.city,
    unit_of_measurement: '€',
    attribution: 'Data provided by https://creativecommons.tankerkoenig.de',
  };

  for (const fuel of ['e5', 'e10', 'diesel'] as const) {
    await remember(station[fuel]);
    await setState(station[fuel], data.prices[fuel], {
      ...common,
      fuel_type: fuel,
      friendly_name: `${data.name} ${fuel}`,
      state_class: 'measurement',
    });
  }

  await remember(station.status);
  await setState(station.status, data.open ? 'on' : 'off', {
    friendly_name: `${data.name} Status`,
    device_class: 'door',
    // How the integration reports a station that never closes; it has no whole_day flag.
    opening_times: [{ text: 'Mo-So', start: '00:00:00', end: '24:00:00' }],
  });
}

/** Puts every state this run overwrote back the way it found it. */
export async function restoreStations(): Promise<void> {
  for (const [entityId, original] of snapshots) {
    if (!original) continue;
    await setState(entityId, original.state, original.attributes);
  }
  snapshots.clear();
}
