# Tankerkoenig Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=flat-square)](https://github.com/hacs/integration)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/timmaurice/lovelace-tankerkoenig-card?style=flat-square)
[![GH-downloads](https://img.shields.io/github/downloads/timmaurice/lovelace-tankerkoenig-card/total?style=flat-square)](https://github.com/timmaurice/lovelace-tankerkoenig-card/releases)
[![GH-last-commit](https://img.shields.io/github/last-commit/timmaurice/lovelace-tankerkoenig-card.svg?style=flat-square)](https://github.com/timmaurice/lovelace-tankerkoenig-card/commits/master)
[![GH-code-size](https://img.shields.io/github/languages/code-size/timmaurice/lovelace-tankerkoenig-card.svg?style=flat-square)](https://github.com/timmaurice/lovelace-tankerkoenig-card)
![GitHub](https://img.shields.io/github/license/timmaurice/lovelace-tankerkoenig-card?style=flat-square)

A custom Lovelace card for Home Assistant to display fuel prices from [Tankerkönig](https://www.tankerkoenig.de/) sensors.

## Features

- Displays prices for multiple fuel stations.
- Customizable card title.
- Option to show or hide the station address.
- Easy station selection using the visual editor.

## Localization

The editor is available in the following languages:

- English
- German

<details>
<summary>Contributing Translations</summary>

If you would like to contribute a new translation:

1.  Fork the repository on GitHub.
2.  In the `src/localize/languages` directory, copy `en.json` and rename it to your language code (e.g., `fr.json` for French).
3.  Translate all the values in the new file.
4.  Submit a pull request with your changes.

</details>

## Installation

<!--
### HACS (Recommended)

This card is available in the [Home Assistant Community Store (HACS)](https://hacs.xyz/).

<a href="https://my.home-assistant.io/redirect/hacs_repository/?owner=timmaurice&repository=lovelace-tankerkoenig-card&category=plugin" target="_blank" rel="noreferrer noopener"><img src="https://my.home-assistant.io/badges/hacs_repository.svg" alt="Open your Home Assistant instance and open a repository inside the Home Assistant Community Store." /></a>
-->

<details>
<summary>Manual Installation</summary>

1.  Download the `tankerkoenig-card.js` file from the latest release.
2.  Place it in your `config/www` directory.
3.  Add the resource reference to your Lovelace configuration under `Settings` -> `Dashboards` -> `...` -> `Resources`.
    - URL: `/local/tankerkoenig-card.js`
    - Resource Type: `JavaScript Module`

You can now add the card to your dashboard.

</details>

## Configuration

| Name           | Type          | Default | Description                                  |
| -------------- | ------------- | ------- | -------------------------------------------- |
| `type`         | string        | **Req** | `custom:tankerkoenig-card`                   |
| `title`        | string        | `''`    | The title of the card.                       |
| `stations`     | list (string) | **Req** | A list of sensor entities for your stations. |
| `show_address` | boolean       | `true`  | Show the address of the station.             |

### Examples

```yaml
type: custom:tankerkoenig-card
title: Fuel Prices
show_address: true
stations:
  - sensor.tankerkoenig_aral_super_e5
  - sensor.tankerkoenig_jet_super_e10
  - sensor.tankerkoenig_shell_diesel
```

## Development

<details>
<summary>To contribute to the development, you'll need to set up a build environment.</summary>

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-github-name/lovelace-tankerkoenig-card.git
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
