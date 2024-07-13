export const checkDeviceConnection = async (deviceId) => {
    try {
      const device = await navigator.bluetooth.getDevices();
      const targetDevice = device.find(d => d.id === deviceId);
      if (targetDevice && targetDevice.gatt.connected) {
        return true;
      }
    } catch (error) {
      console.error("Error checking device connection:", error);
    }
    return false;
  };