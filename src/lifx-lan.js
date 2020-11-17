const lifx = require('node-lifx-lan');
const { GROUPIDS } = require('./config');

module.exports = class LifxLan {
  constructor() {}

  /**
   * @param {String[]} groupIds - Group IDs to to whitelist
   * @returns {Promise<>} - returns a promise pending the completion of light turn off
   */
  turnOffAll(groupIds) {
    const filtersArray = this.constructFilterArray(groupIds);
    return filtersArray.length > 0
      ? lifx.turnOffFilter({
          filters: filtersArray,
        })
      : lifx.turnOffAll();
  }

  /**
   * @param {String[]} groupIds - Group IDs to to whitelist
   * @returns {Promise<>} - returns a promise pending the completion of light turn on
   */
  async turnOnAll(groupIds) {
    const filtersArray = this.constructFilterArray(groupIds);
    return filtersArray.length > 0
      ? lifx.turnOnFilter({
          filters: filtersArray,
        })
      : lifx.turnOnAll();
  }

  /**
   * @param {String[]} additionalGroupIds
   * @returns {String[]} - returns an array of GUIDs (strings)
   */
  constructFilterArray(additionalGroupIds) {
    let filtersArray = [];
    if (Array.isArray(GROUPIDS) && GROUPIDS.length > 0)
      filtersArray = [
        ...filtersArray,
        ...GROUPIDS.map((id) => ({ group: { guid: id } })),
      ];
    if (Array.isArray(additionalGroupIds) && additionalGroupIds.length > 0)
      filtersArray = [...filtersArray, ...additionalGroupIds];
    return filtersArray;
  }

  /**
   * @returns {Promise<>} - Returns a promise pending the completion of the list refresh
   */
  refreshDeviceList() {
    return new Promise(async (resolve, reject) => {
      try {
        const detectedDevices = await lifx.discover();
        this.deviceList = detectedDevices.filter(
          (device) => GROUPIDS.indexOf(device.deviceInfo.group.guid) >= 0
        );
        resolve();
      } catch (err) {
        console.error(err);
        reject(
          new Error('An error occurred while refreshing the device list.')
        );
      }
    });
  }
};
