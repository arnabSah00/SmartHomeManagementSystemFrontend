import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "./axiosConfig";
import { checkDeviceConnection } from '../utils/bluetoothUtils';

export default function Devices(props) {
  const [devices, setDevices] = useState([]);
  const [editingDevice, setEditingDevice] = useState(null);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [deviceStatus, setDeviceStatus] = useState({});

  //check online or offline device
  const updateDeviceStatus = async () => {
    const statusUpdates = {};
    for (const device of devices) {
      const isConnected = await checkDeviceConnection(device.details);
      statusUpdates[device.details] = isConnected;
    }
    setDeviceStatus(statusUpdates);
  };

  useEffect(() => {
    const interval = setInterval(updateDeviceStatus, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devices]);


  // Fetch device details based on house and room
  const fetchDeviceDetails = async (house, room) => {
    let endpoint = `http://localhost:4000/api/house/${house}/devices?contact=${props.user.userid}`;
    if (room && room !== "All Device") {
      endpoint = `http://localhost:4000/api/house/${house}/room/${room}/devices?contact=${props.user.userid}`;
    }
    try {
      const response = await axios.get(endpoint);
      setDevices(response.data.devices);
    } catch (error) {
      console.error("Error fetching device details:", error);
    }
  };

  // Handle house selection
  const handleHouseSelection = async (house) => {
    props.setSelectedHouse(house);
    const fetchedRooms = await props.fetchRooms(house); // Fetch rooms synchronously after selecting the house
    props.setSelectedRoom(fetchedRooms[0]);
    await fetchDeviceDetails(house, fetchedRooms[0]);
  };

  // Handle room selection
  const handleRoomSelection = async (room) => {
    props.setSelectedRoom(room);
    await fetchDeviceDetails(props.selectedHouse, room);
  };

  // Fetch initial devices when component mounts
  useEffect(() => {
    fetchDeviceDetails(props.selectedHouse, props.selectedRoom);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedHouse, props.selectedRoom]);

  // Function to toggle favorite status of a device
  const toggleFavoriteStatus = async (deviceName) => {
    try {
      // Find the device in the devices array
      const updatedDevices = devices.map((device) => {
        if (device.name === deviceName) {
          return { ...device, favourite: !device.favourite }; // Toggle the favourite status
        }
        return device;
      });
      setDevices(updatedDevices);

      // Update the backend with the new favourite status
      const endpoint = `http://localhost:4000/api/house/${props.selectedHouse}/room/${props.selectedRoom}/device/${deviceName}/favourite?contact=${props.user.userid}`;
      await axios.put(endpoint);
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    }
  };

  // Function to toggle on/off status of a device
  const toggleDeviceStatus = async (deviceName) => {
    try {
      // Find the device in the devices array
      const updatedDevices = devices.map((device) => {
        if (device.name === deviceName) {
          const newStatus = !device.status; // Toggle the status
          // Update the device in the backend
          const endpoint = `http://localhost:4000/api/house/${props.selectedHouse}/room/${props.selectedRoom}/device/${deviceName}/status?contact=${props.user.userid}`;
          axios.put(endpoint, { deviceStatus: newStatus });
          return { ...device, status: newStatus };
        }
        return device;
      });
      setDevices(updatedDevices);
    } catch (error) {
      console.error("Error toggling device status:", error);
    }
  };

  // Function to disconnect a device
  const disconnectDevice = async (deviceName) => {
    try {
      // Remove the device from the backend
      const endpoint = `http://localhost:4000/api/house/${props.selectedHouse}/room/${props.selectedRoom}/device/${deviceName}/delete?contact=${props.user.userid}`;
      await axios.delete(endpoint);

      // Remove the device from the frontend state
      const updatedDevices = devices.filter(
        (device) => device.name !== deviceName
      );
      setDevices(updatedDevices);
    } catch (error) {
      console.error("Error disconnecting device:", error);
    }
  };

  // Function to open the edit modal
  const openEditModal = (device) => {
    setEditingDevice(device);
    setNewDeviceName(device.name);
  };

  // Function to handle device name change
  const handleDeviceNameChange = (e) => {
    setNewDeviceName(e.target.value);
  };

  // Function to save the edited device name
  const saveEditedDeviceName = async () => {
    try {
      const endpoint = `http://localhost:4000/api/house/${props.selectedHouse}/room/${props.selectedRoom}/device/${editingDevice.name}/edit?contact=${props.user.userid}`;
      await axios.put(endpoint, { newDeviceName });

      const updatedDevices = devices.map((device) => {
        if (device.name === editingDevice.name) {
          return { ...device, name: newDeviceName };
        }
        return device;
      });
      setDevices(updatedDevices);
      setEditingDevice(null);
      setNewDeviceName("");
    } catch (error) {
      console.error("Error editing device name:", error);
    }
  };

  // Function to close the edit modal
  const closeEditModal = () => {
    setEditingDevice(null);
    setNewDeviceName("");
  };

  // Render device cards
  const renderDeviceCards = () => {
    return devices.map((device, index) => (
      <div key={index} className="col-md-3 mb-4">
        <div className="card" style={{ width: "18rem" }}>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="card-title">{device.name}</h5>
                <h6 className="card-subtitle mb-2 text-body-secondary">
                  {deviceStatus[device.details] ? "Online" : "Offline"}
                </h6>
              </div>
              <button className="card-link btn btn-outline-info" onClick={() => openEditModal(device)}>
                Edit
              </button>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <button
                className="card-link btn-logo text-logo"
                onClick={() => toggleFavoriteStatus(device.name)}
                style={{"color":"red"}}
              >
                <i
                  className={`bi ${
                    device.favourite ? "bi-star-fill" : "bi-star"
                  }`}
                ></i>{" "}
                {/* Toggle star icon based on favourite status */}
              </button>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id={`device-${index}`}
                  checked={device.status}
                  onChange={() => toggleDeviceStatus(device.name)}
                  style={{"fontSize":"20px"}}
                />
                <label className="form-check-label" htmlFor={`device-${index}`}>
                  {device.status ? "On" : "Off"}
                </label>
              </div>

              <button
                className="card-link btn btn-outline-danger"
                onClick={() => disconnectDevice(device.name)}
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div>
      <div
        className={`navbar-expand-lg ${
          props.isDarkMode
            ? "navbar-dark bg-dark"
            : "navbar-light light-mode-component"
        } mb-2`}
      >
        <ul className="nav justify-content-center">
          <li className="nav-item dropdown">
            <div className="dropdown">
              <button
                className="nav-link"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ color: props.isDarkMode ? "yellow" : "black" }}
              >
                <i className="bi bi-qr-code icon-bold"></i>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <button className="dropdown-item" type="button"></button>
                </li>
              </ul>
            </div>
          </li>

          <li className="nav-item dropdown">
            <div className="dropdown">
              <button
                className="nav-link fw-bold"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ color: props.isDarkMode ? "white" : "black" }}
              >
                <h3>{props.selectedHouse}</h3>
              </button>
              <ul className="dropdown-menu">
                {props.houses.map((house, index) => (
                  <li key={index}>
                    <button
                      className="dropdown-item"
                      type="button"
                      onClick={() => handleHouseSelection(house)}
                    >
                      {props.selectedHouse === house && (
                        <i
                          className="bi bi-check-circle-fill"
                          style={{ marginRight: "5px" }}
                        ></i>
                      )}
                      {house}
                    </button>
                  </li>
                ))}
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    type="button"
                    onClick={() => handleRoomSelection("All Device")}
                  >
                    {props.selectedRoom === "All Device" && (
                      <i
                        className="bi bi-check-circle-fill"
                        style={{ marginRight: "5px" }}
                      ></i>
                    )}
                    All Device
                  </button>
                </li>
                {props.rooms.length > 0 ? (
                  props.rooms.map((room, index) => (
                    <li key={index}>
                      <button
                        className="dropdown-item"
                        type="button"
                        onClick={() => handleRoomSelection(room)}
                      >
                        {props.selectedRoom === room && (
                          <i
                            className="bi bi-check-circle-fill"
                            style={{ marginRight: "5px" }}
                          ></i>
                        )}
                        {room}
                      </button>
                    </li>
                  ))
                ) : (
                  <li>
                    <span className="dropdown-item">No rooms found</span>
                  </li>
                )}
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link className="dropdown-item" to="/manage-location">
                    <i className="bi bi-gear"> Manage location </i>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/manage-rooms">
                    <i className="bi bi-gear"> Manage rooms </i>
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          <li className="nav-item">
            <i
              className="nav-link active"
              aria-current="page"
              style={{ color: props.isDarkMode ? "#c6ff00" : "#598dfa" }}
            >
              <h3>{props.selectedRoom}</h3>
            </i>
          </li>

          <li className="nav-item dropdown">
            <div className="dropdown">
              <button
                className="nav-link"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ color: props.isDarkMode ? "yellow" : "black" }}
              >
                <i className="bi bi-plus-lg icon-bold "></i>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/add-device">
                    Add device
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item" type="button">
                    Add service
                  </button>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item" type="button">
                    Create routine
                  </button>
                </li>
              </ul>
            </div>
          </li>

          <li className="nav-item dropdown">
            <div className="dropdown">
              <button
                className="nav-link"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ color: props.isDarkMode ? "yellow" : "black" }}
              >
                <i className="bi bi-three-dots-vertical icon-bold"></i>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/manage-location">
                    <i className="bi bi-gear"> Manage location/members </i>
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item" type="button">
                    Show {props.selectedHouse} status
                  </button>
                </li>
                <hr className="dropdown-divider" />
                <li>
                  <Link className="dropdown-item" to="/manage-rooms">
                    <i className="bi bi-gear"> Manage rooms </i>
                  </Link>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <div className="container">
        <div className="row">{renderDeviceCards()}</div>
      </div>

      {/* Modal for editing device name */}
  {editingDevice && (
    <div className="modal show" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Device Name</h5>
            <button type="button" className="btn-close" onClick={closeEditModal}></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              className="form-control"
              value={newDeviceName}
              onChange={handleDeviceNameChange}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeEditModal}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={saveEditedDeviceName}>
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
    </div>
  );
}
