"""Shared base entity."""

from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity import Entity

from .const import DOMAIN


class StationEntity(Entity):
    """An entity that belongs to one fixture station device."""

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, station: int, key: str, name: str) -> None:
        self._attr_unique_id = f"station_{station}_{key}"
        self._attr_name = name
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, f"station_{station}")},
            name=f"E2E Station {station}",
            manufacturer="E2E",
        )
