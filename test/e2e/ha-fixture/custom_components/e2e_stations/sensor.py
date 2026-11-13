"""Price sensors: e5, e10 and diesel per station."""

from homeassistant.components.sensor import SensorEntity

from .const import STATION_COUNT
from .entity import StationEntity

FUELS = {"e5": "E5", "e10": "E10", "diesel": "Diesel"}


class PriceSensor(StationEntity, SensorEntity):
    """A fuel price."""

    def __init__(self, station: int, fuel: str, name: str) -> None:
        super().__init__(station, fuel, name)
        self._attr_native_value = 1.5
        self._attr_extra_state_attributes = {"fuel_type": fuel}


async def async_setup_entry(hass, entry, async_add_entities) -> None:
    """Add three price sensors per station, in the order e5, e10, diesel."""
    async_add_entities(
        PriceSensor(station, fuel, name)
        for station in range(1, STATION_COUNT + 1)
        for fuel, name in FUELS.items()
    )
