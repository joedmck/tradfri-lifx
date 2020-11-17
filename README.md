# TRÅDFRI - LIFX

A tool to control LIFX lights with IKEA TRÅDFRI switches **without** needing something like Home Assistant.

### TRÅDFRI Device Support

- [x] Wireless dimmer
- [ ] Remote control
- [ ] SYMFONISK Sound remote (_would work well as a dimmer switch_)

## Hardware

This uses the same ZigBee gateway solution as [zigbee2mqtt](https://github.com/koenkk/zigbee2mqtt) so _should_ work with all [adapters supported](https://www.zigbee2mqtt.io/information/supported_adapters.html) by zigbee2mqtt.

Currently this tool has only been tested with a Texas Instruments CC2531 with [this firmware](https://github.com/Koenkk/Z-Stack-firmware/blob/master/coordinator/Z-Stack_Home_1.2/bin/default/CC2531_DEFAULT_20190608.zip) flashed with [this utility](https://github.com/jmichault/flash_cc2531) using a Raspberry Pi Zero W.

To use other adapters, see the [zigbee2mqtt supported adapters documentation](https://www.zigbee2mqtt.io/information/supported_adapters.html) and cross your fingers that it works with this tool.

## Environment Variables

| Variable    | Required/Optional | Description                                                                              | Default     |
| ----------- | ----------------- | ---------------------------------------------------------------------------------------- | ----------- |
| DONGLE      | REQUIRED          | Path to CC2531 dongle (e.g. `/dev/ttyACM0`)                                              | -           |
| GROUPIDS    | OPTIONAL          | List of LIFX LAN Group IDs to whitelist (separate with commas - no comma if just one ID) | ""          |
| JOIN_PERIOD | OPTIONAL          | Number of seconds following start when zigbee devices are permitted to join              | 60          |
| DB_PATH     | OPTIONAL          | Path to zigbee database                                                                  | ./zigbee.db |

> All variable names must be prefixed with `TRADFRI_LIFX_`, e.g: `DONGLE` = `TRADFRI_LIFX_DONGLE`. \
> See [templates/.env.example](./templates/.env.example) for examples of each environment variable.

## Example Docker Commands

> This will eventually be simplified with docker-compose.

```
# Generate the Dockerfile
# Optional argument of "pi" if building for Raspberry Pi
./scripts/generate_dockerfile.sh [pi]

# Build the image
docker build --tag tradfri-lifx:latest --rm .

# Create volume to keep persistent db
docker volume create zigbee-db

# Run a container
docker run \
  --name tradfri-lifx \
  --device /dev/ttyACM0:/dev/ttyACM0 \
  --network host \
  -v zigbee-db:/app/db/ \
  -e TRADFRI_LIFX_GROUPIDS=619bdd98c90662152aa5fe2fabaec61c \
  tradfri-lifx:latest
```
