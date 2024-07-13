import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "./axiosConfig";
import { checkDeviceConnection } from '../utils/bluetoothUtils';

export default function Favourites(props) {
  const [favDevices, setFavDevices] = useState([]);
  const [editingDevice, setEditingDevice] = useState(null);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [deviceStatus, setDeviceStatus] = useState({}); 

  const updateDeviceStatus = async () => {
    const statusUpdates = {};
    for (const device of favDevices) {
      const isConnected = await checkDeviceConnection(device.details);
      statusUpdates[device.details] = isConnected;
    }
    setDeviceStatus(statusUpdates);
  };

  useEffect(() => {
    const interval = setInterval(updateDeviceStatus, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favDevices]);


  // Fetch favourite device details based on house
  const fetchFavouriteDeviceDetails = async (house) => {
    if (!house) return;
    const endpoint = `http://localhost:4000/api/house/${house}/favourite-devices?contact=${props.user.userid}`;

    try {
      const response = await axios.get(endpoint);
      setFavDevices(response.data.favouriteDevices);
      console.log(response.data.favouriteDevices);
    } catch (error) {
      console.error("Error fetching device details:", error);
    }
  };

  // Handle house selection
  const handleHouseSelection = async (house) => {
    props.setSelectedHouse(house);
    const fetchedRooms = await props.fetchRooms(house); // Fetch rooms synchronously after selecting the house
    props.setSelectedRoom(fetchedRooms[0]);
    await fetchFavouriteDeviceDetails(house);
  };

  // Fetch initial devices when component mounts
  useEffect(() => {
    fetchFavouriteDeviceDetails(props.selectedHouse);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedHouse, props.selectedRoom]);

  // Function to toggle on/off status of a device
  const toggleDeviceStatus = async (deviceName, roomName) => {
    try {
      // Find the device in the devices array
      const updatedDevices = favDevices.map((device) => {
        if (device.name === deviceName && device.room === roomName) {
          const newStatus = !device.status; // Toggle the status
          // Update the device in the backend
          const endpoint = `http://localhost:4000/api/house/${props.selectedHouse}/room/${roomName}/device/${deviceName}/status?contact=${props.user.userid}`;
          axios.put(endpoint, { deviceStatus: newStatus });
          return { ...device, status: newStatus };
        }
        return device;
      });
      setFavDevices(updatedDevices);
    } catch (error) {
      console.error("Error toggling device status:", error);
    }
  };

  // Function to delete a device
  const deleteDevice = async (deviceName, roomName) => {
    try {
      const endpoint = `http://localhost:4000/api/house/${props.selectedHouse}/room/${roomName}/device/${deviceName}/delete?contact=${props.user.userid}`;
      await axios.delete(endpoint);

      // Remove the device from the favDevices array
      setFavDevices(favDevices.filter((device) => !(device.name === deviceName && device.room === roomName)));
    } catch (error) {
      console.error("Error deleting device:", error);
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
      const endpoint = `http://localhost:4000/api/house/${props.selectedHouse}/room/${editingDevice.room}/device/${editingDevice.name}/edit?contact=${props.user.userid}`;
      await axios.put(endpoint, { newDeviceName });

      const updatedDevices = favDevices.map((device) => {
        if (device.name === editingDevice.name && device.room === editingDevice.room) {
          return { ...device, name: newDeviceName };
        }
        return device;
      });
      setFavDevices(updatedDevices);
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
    return favDevices.map((device, index) => (
      <div key={index} className="col-md-3 mb-4">
        <div className="card" style={{ width: "18rem" }}>
          <div className="card-body">
            <h5 className="card-title">{device.name}</h5>
            <p className="card-text">
              Room: {device.room}
            </p>
            <h6 className="card-subtitle mb-2 text-body-secondary">
              {deviceStatus[device.details] ? "Online" : "Offline"}
            </h6>
            <div className="d-flex justify-content-between align-items-center">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id={`device-${index}`}
                  checked={device.status}
                  onChange={() => toggleDeviceStatus(device.name, device.room)}
                  style={{"fontSize":"20px"}}
                />
                <label className="form-check-label" htmlFor={`device-${index}`}>
                  {device.status ? "On" : "Off"}
                </label>
              </div>
              <button className="card-link btn btn-outline-info" onClick={() => openEditModal(device)}>
                Edit
              </button>
              <button className="card-link btn btn-outline-danger" onClick={() => deleteDevice(device.name, device.room)}>Disconnect</button>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div>
      <div className={`navbar-expand-lg ${props.isDarkMode ? "navbar-dark bg-dark" : "navbar-light light-mode-component"} mb-3`}>
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
                onClick={() => {}}
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
                  <Link className="dropdown-item" to="/manage-location">
                    <i className="bi bi-gear"> Manage location </i>
                  </Link>
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
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <div className="container">
        <div className="row">
          {renderDeviceCards()}
        </div>
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