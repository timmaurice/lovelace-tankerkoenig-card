"""Minimal stand-in for the tankerkoenig integration, used only by the e2e suite.

The card looks a station up by device id and reads its entities, so all the suite
needs is devices with three price sensors and a status binary sensor. Creating
those here means the suite never needs a Tankerkoenig API key or network access.
The suite overwrites the states it cares about through the REST API.
"""

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

PLATFORMS = ["sensor", "binary_sensor"]


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up the fixture stations."""
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload the fixture stations."""
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
