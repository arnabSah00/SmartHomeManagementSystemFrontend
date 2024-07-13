import React, { useState, useEffect, useRef } from "react";
import axios from "./axiosConfig";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function AddDevice(props) {
  const [deviceName, setDeviceName] = useState("");
  const [deviceDetails, setDeviceDetails] = useState("");

  const [isScanQrModalOpen, setIsScanQrModalOpen] = useState(false);
  const [isScanNearbyModalOpen, setIsScanNearbyModalOpen] = useState(false);
  const [isAddManualModalOpen, setIsAddManualModalOpen] = useState(false);

  const [scannedDevices, setScannedDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false); // Loading state for scanning

  const qrScannerRef = useRef(null);

  const openScanQrModal = () => {
    setIsScanQrModalOpen(true);
  };

  const closeScanQrModal = () => setIsScanQrModalOpen(false);

  const openScanNearbyModal = () => setIsScanNearbyModalOpen(true);
  const closeScanNearbyModal = () => setIsScanNearbyModalOpen(false);

  const openAddManualModal = () => setIsAddManualModalOpen(true);
  const closeAddManualModal = () => setIsAddManualModalOpen(false);

  //manual
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:4000/api/house/${props.selectedHouse}/room/${props.selectedRoom}/device/add?contact=${props.contact}`,
        {
          deviceName: deviceName,
          deviceDetails: deviceDetails,
        }
      );
      console.log("Device added successfully:", response.data);
      setDeviceName("");
      setDeviceDetails("");
      closeAddManualModal();
    } catch (error) {
      console.error("Error adding device:", error);
    }
  };

  //for bluetooth
  const scanForNearbyDevices = async () => {
    setIsScanning(true); // Set loading state to true when scan starts
    try {
      const options = {
        acceptAllDevices: true,
        optionalServices: ["battery_service"],
      };
      const device = await navigator.bluetooth.requestDevice(options);
      setScannedDevices([device]);
    } catch (error) {
      console.error("Error scanning for nearby devices:", error);
    }
    setIsScanning(false); // Set loading state to false when scan completes
  };

  const connectToDevice = async (device) => {
    try {
      const server = await device.gatt.connect();
      console.log("Connected to device:", device.name, server);

      const deviceMacAddress = device.id; 

      // Create device details including the MAC address
      const deviceName = device.name;
      const deviceDetails = `${deviceMacAddress}`;

      // Send the device details to the backend
      const response = await axios.post(
        `http://localhost:4000/api/house/${props.selectedHouse}/room/${props.selectedRoom}/device/add?contact=${props.contact}`,
        {
          deviceName: deviceName,
          deviceDetails: deviceDetails,
        }
      );

      console.log("Device added successfully:", response.data);
      closeScanNearbyModal();
    } catch (error) {
      console.error("Error connecting to device:", error);
    }
  };

  //for wifi

  const handleQrCodeSuccess = async (decodedText, decodedResult) => {
    try {
      const scannedData = JSON.parse(decodedText);
      const { ssid, password, security } = scannedData;

      // Example of how you might handle the WiFi configuration data
      console.log("SSID:", ssid);
      console.log("Password:", password);
      console.log("Security:", security);

      // Optionally, you can send this data to your backend
      const response = await axios.post(
        `http://localhost:4000/api/house/${props.selectedHouse}/room/${props.selectedRoom}/device/add?contact=${props.contact}`,
        {
          deviceName: "Smart Device",
          deviceDetails: `SSID: ${ssid},Password:${password} Security: ${security}`, // Example of sending some device details
        }
      );

      console.log("Device added successfully:", response.data);

      // Close the modal after successful processing
      closeScanQrModal();
    } catch (error) {
      console.error("Error parsing or handling QR code data:", error);
    }
  };

  useEffect(() => {
    if (isScanQrModalOpen) {
      qrScannerRef.current = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      qrScannerRef.current.render(handleQrCodeSuccess);
    } else if (qrScannerRef.current) {
      qrScannerRef.current.clear();
      qrScannerRef.current = null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScanQrModalOpen]);

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h4>Add Device</h4>
        </div>
        <div className="card-body">
          <div className="btn-group w-100" role="group">
            <button
              type="button"
              className="btn btn-primary"
              onClick={openScanQrModal}
            >
              Scan QR code
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={openScanNearbyModal}
            >
              Scan for nearby devices
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={openAddManualModal}
            >
              Add Manual
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Scanning QR Code */}
      {isScanQrModalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="scanQrModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="scanQrModalLabel">
                  Scan QR Code
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeScanQrModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>Use your device camera to scan the QR code.</p>
                <div id="reader" style={{ width: "100%" }}></div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeScanQrModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Scanning Nearby Devices */}
      {isScanNearbyModalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="scanNearbyModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="scanNearbyModalLabel">
                  Scan for Nearby Devices
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeScanNearbyModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {isScanning ? (
                  <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Scanning...</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={scanForNearbyDevices}
                    >
                      Scan
                    </button>
                    <ul className="list-group mt-3">
                      {scannedDevices.map((device, index) => (
                        <li
                          className="list-group-item d-flex justify-content-between align-items-center"
                          key={index}
                        >
                          {device.name}
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => connectToDevice(device)}
                          >
                            Connect
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeScanNearbyModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Adding Device Manually */}
      {isAddManualModalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="addManualModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addManualModalLabel">
                  Add Device Manually
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeAddManualModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="deviceName" className="form-label">
                      Device Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="deviceName"
                      value={deviceName}
                      onChange={(e) => setDeviceName(e.target.value)}
                      placeholder="Enter device name"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="deviceDetails" className="form-label">
                      Device Details
                    </label>
                    <textarea
                      className="form-control"
                      id="deviceDetails"
                      value={deviceDetails}
                      onChange={(e) => setDeviceDetails(e.target.value)}
                      placeholder="Enter device details"
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeAddManualModal}
                    >
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Add Device
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
