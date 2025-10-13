# Tankerkoenig Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=flat-square)](https://github.com/hacs/integration)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/timmaurice/lovelace-tankerkoenig-card?style=flat-square)
[![GH-downloads](https://img.shields.io/github/downloads/timmaurice/lovelace-tankerkoenig-card/total?style=flat-square)](https://github.com/timmaurice/lovelace-tankerkoenig-card/releases)
[![GH-last-commit](https://img.shields.io/github/last-commit/timmaurice/lovelace-tankerkoenig-card.svg?style=flat-square)](https://github.com/timmaurice/lovelace-tankerkoenig-card/commits/master)
[![GH-code-size](https://img.shields.io/github/languages/code-size/timmaurice/lovelace-tankerkoenig-card.svg?style=flat-square)](https://github.com/timmaurice/lovelace-tankerkoenig-card)
![GitHub](https://img.shields.io/github/license/timmaurice/lovelace-tankerkoenig-card?style=flat-square)

A custom Lovelace card for Home Assistant to display fuel prices from [Tankerkönig](https://www.tankerkoenig.de/) sensors.

<img src="https://raw.githubusercontent.com/timmaurice/lovelace-tankerkoenig-card/main/image.png" alt="Card Screenshot" />

## Features

- Displays prices for multiple fuel stations from the [Tankerkönig integration](https://www.home-assistant.io/integrations/tankerkoenig/).
- Sort stations by price for a specific fuel type.
- Show only the cheapest station based on a selected fuel type.
- Show/hide station address and last updated timestamp.
- Customize the order of displayed fuel types.
- Show indicators for price increases or decreases.
- Hide stations that are currently closed.
- Fully customizable through the visual editor.
- Easy station selection using the visual editor.
- Overwrite default logos with custom image URLs.

## Localization

The editor is available in the following languages:

- English
- German

<details>
<summary>Contributing Translations</summary>

If you would like to contribute a new translation:

1.  Fork the repository on GitHub.
2.  In the `src/translation` directory, copy `en.json` and rename it to your language code (e.g., `fr.json` for French).
3.  Translate all the values in the new file.
4.  Submit a pull request with your changes.

</details>

## Installation

### HACS (Recommended)

This card is available in the [Home Assistant Community Store (HACS)](https://hacs.xyz/).

<a href="https://my.home-assistant.io/redirect/hacs_repository/?owner=timmaurice&repository=lovelace-tankerkoenig-card&category=plugin" target="_blank" rel="noreferrer noopener"><img src="https://my.home-assistant.io/badges/hacs_repository.svg" alt="Open your Home Assistant instance and open a repository inside the Home Assistant Community Store." /></a>

<details>
<summary>Manual Installation</summary>

1.  Download the `tankerkoenig-card.js` file from the latest release.
2.  Place it in your `config/www` directory.
3.  Add the resource reference to your Lovelace configuration under `Settings` -> `Dashboards` -> `...` -> `Resources`.
    - URL: `/local/tankerkoenig-card.js`
    - Resource Type: `JavaScript Module`

You can now add the card to your dashboard.

</details>

## Available Gas Station Logos

The card automatically displays logos for many gas station brands. The logo is determined by the `brand` attribute of your sensor.

Some of the supported brands include:

- Agip eni
- Aral _(incl. Jantzon)_
- Avia
- Bell Oil
- BFT
- citi oil
- Classic
- E Center
- Esso
- Globus
- HEM
- Hornbach
- Jet
- Joiss
- Minera / Minera Automatenstation
- MOL
- Mr.Wash
- MTB
- OIL!
- OMV
- Raiffeisen
- RAN
- Shell
- Star
- Total
- Total Energies

If a logo for a specific brand is missing, the card will show a generic fallback logo. You can check the `src/gasstation_logos` directory for a full list of available logos.

If you are missing a logo, please open an [issue](https://github.com/timmaurice/lovelace-tankerkoenig-card/issues) and provide the brand name _(entity attribute)_.

## Custom Font _(Manual Step Required)_

To achieve the digital clock-style font for the prices as seen in the screenshots, you need to add the stylesheet to your Lovelace resources.

1.  Copy the [`stylesheet.css`](https://raw.githubusercontent.com/timmaurice/lovelace-tankerkoenig-card/refs/heads/main/dist/stylesheet.css) file from the `dist` folder of this repository into your `config/www/community/lovelace-tankerkoenig-card/` directory.
2.  Add the stylesheet as a resource in Home Assistant under `Settings` -> `Dashboards` -> `⋮` (top right) -> `Resources`.
    - URL: `/hacsfiles/lovelace-tankerkoenig-card/stylesheet.css`
    - Resource Type: `Stylesheet (CSS)`

## Configuration

| Name                        | Type                                | Default                   | Description                                                                                                       |
| --------------------------- | ----------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `type`                      | string                              | **Required**              | `custom:tankerkoenig-card`                                                                                        |
| `title`                     | string                              | `(none)`                  | The title of the card.                                                                                            |
| `stations`                  | list (string or object)             | **Required**              | A list of device IDs. To set a custom name or logo, use an object: `{ device: '...', name: '...', logo: '...' }`. |
| `show_address`              | boolean                             | `false`                   | Show the address of the station.                                                                                  |
| `show_last_updated`         | boolean                             | `false`                   | Show the last updated timestamp for the station.                                                                  |
| `show_price_changes`        | boolean                             | `false`                   | Show an indicator for price increases or decreases.                                                               |
| `fuel_types`                | list ('e5' \| 'e10' \| 'diesel')    | `['diesel', 'e10', 'e5']` | The order in which to display the fuel types.                                                                     |
| `hide_unavailable_stations` | boolean                             | `false`                   | Hide stations that are currently closed.                                                                          |
| `sort_by`                   | 'e5' \| 'e10' \| 'diesel' \| 'none' | `'none'`                  | Sort stations by the price of the selected fuel type.                                                             |
| `show_only_cheapest`        | boolean                             | `false`                   | Show only the cheapest station. Requires `sort_by` to be set to a fuel type.                                      |

### Station Object Parameters

| Name     | Type   | Required     | Description                                          |
| -------- | ------ | ------------ | ---------------------------------------------------- |
| `device` | string | **Required** | The device ID of the Tankerkönig station.            |
| `name`   | string | `(none)`     | A custom name to overwrite the default station name. |
| `logo`   | string | `(none)`     | A URL to a custom logo for the station.              |

### Examples

```yaml
type: custom:tankerkoenig-card
title: Fuel Prices
show_address: false
show_last_updated: true
show_price_changes: true
sort_by: e10
fuel_types:
  - e10
  - e5
  - diesel
stations:
  # Station with default logo
  - 2bf48bbf7b0c6a5d40ac7c0dfa2c4178
  # Station with custom logo
  - device: 99a4943a53c159a2995573795447463d
    logo: /local/my-custom-logo.png
  # Station with custom name
  - device: 99a4943a53c159a2995573795447463d
    name: My Favorite Station
```

## Development

<details>
<summary>To contribute to the development, you'll need to set up a build environment.</summary>

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/timmaurice/lovelace-tankerkoenig-card.git
    cd lovelace-tankerkoenig-card
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Start the development server:**
    This command will build for changes in the `src` directory and rebuild the card.

    ```bash
    npm run build
    ```

4.  In your Home Assistant instance, you will need to configure Lovelace to use the local development version of the card from `dist/tankerkoenig-card.js`.
</details>

---

For further assistance or to [report issues](https://github.com/timmaurice/lovelace-tankerkoenig-card/issues), please visit the [GitHub repository](https://github.com/timmaurice/lovelace-tankerkoenig-card).

![Star History Chart](https://api.star-history.com/svg?repos=timmaurice/lovelace-tankerkoenig-card&type=Date)

## ☕ Support My Work

[<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="30" />](https://www.buymeacoffee.com/timmaurice)
