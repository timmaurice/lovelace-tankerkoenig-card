"""Config flow: a single click, no input."""

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult

from .const import DOMAIN


class E2EStationsConfigFlow(ConfigFlow, domain=DOMAIN):
    """Create the one fixture entry."""

    VERSION = 1

    async def async_step_user(self, user_input=None) -> ConfigFlowResult:
        """Create the entry straight away."""
        return self.async_create_entry(title="E2E fuel stations", data={})
