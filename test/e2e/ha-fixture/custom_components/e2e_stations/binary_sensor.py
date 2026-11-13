"""Open/closed status per station."""

from homeassistant.components.binary_sensor import BinarySensorEntity

from .const import STATION_COUNT
from .entity import StationEntity


class StatusSensor(StationEntity, BinarySensorEntity):
    """Whether the station is open."""

    def __init__(self, station: int) -> None:
        super().__init__(station, "status", "Status")
        self._attr_is_on = True


async def async_setup_entry(hass, entry, async_add_entities) -> None:
    """Add one status sensor per station."""
    async_add_entities(StatusSensor(station) for station in range(1, STATION_COUNT + 1))
