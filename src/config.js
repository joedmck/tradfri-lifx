const path = require('path');

const required = (varName) => {
  if (process.env.hasOwnProperty(varName)) return process.env[varName];
  console.error(`Missing required environment variable: ${varName}`);
  process.exit(1);
};

module.exports = {
  DONGLE: required('TRADFRI_LIFX_DONGLE'),
  GROUPIDS: (process.env.TRADFRI_LIFX_GROUPIDS || '').split(','),
  JOIN_PERIOD: process.env.TRADFRI_LIFX_JOIN_PERIOD || 60,
  DB_PATH:
    process.env.TRADFRI_LIFX_DB_PATH ||
    path.resolve(process.cwd(), 'zigbee.db'),
};
