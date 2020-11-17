require('dotenv').config(); // Load environment variables from .env file

const { Controller } = require('zigbee-herdsman');

const { DONGLE, JOIN_PERIOD, DB_PATH } = require('./config');
const LifxLan = require('./lifx-lan');

const zigbeeCoordinator = new Controller({
  serialPort: {
    path: DONGLE,
  },
  databasePath: DB_PATH,
});
const lifx = new LifxLan();

zigbeeCoordinator.on('message', async (msg) => {
  if (msg.hasOwnProperty('type') && msg.type === 'commandOn')
    await lifx.turnOnAll();
  else if (msg.hasOwnProperty('type') && msg.type === 'commandOff')
    await lifx.turnOffAll();
});

zigbeeCoordinator
  .start((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  })
  .then(async () => {
    await lifx.refreshDeviceList();
    console.log('Zigbee Coordinator and LIFX Handler Started!');
    zigbeeCoordinator.permitJoin(JOIN_PERIOD, (err) => {
      if (err) console.error(err);
    });
  });
