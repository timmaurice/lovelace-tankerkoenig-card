"""Constants for the e2e station fixture."""

DOMAIN = "e2e_stations"

# One device per station, as the real tankerkoenig integration creates them.
# The e2e suite needs six (see test/e2e/helpers/stations.ts).
STATION_COUNT = 6
