import React, { useState } from "react";
import axios from "./axiosConfig";

export default function ManageRoom(props) {
  const [showModal, setShowModal] = useState(false);
  const [operation, setOperation] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [editRoomName, setEditRoomName] = useState("");
  const [currentRoomIndex, setCurrentRoomIndex] = useState(null);
  const [warningMessage, setWarningMessage] = useState("");

  const handleOperation = (op, index = null) => {
    setShowModal(true);
    setOperation(op);
    setCurrentRoomIndex(index);
    setWarningMessage("");

    if (op === "edit" && index !== null) {
      setEditRoomName(props.rooms[index]);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setOperation("");
    setNewRoomName("");
    setEditRoomName("");
    setCurrentRoomIndex(null);
  };

  const handleSubmit = async (op) => {
    switch (op) {
      case "add":
        if (!newRoomName) {
          setWarningMessage("Room name is required!");
          return;
        }
        try {
          const addResponse = await axios.post(
            `http://localhost:4000/api/house/${props.selectedHouse}/room/add`,
            {
              contact: props.contact,
              roomName: newRoomName,
            }
          );

          if (addResponse.status === 200) {
            alert(addResponse.data.message);
            props.setRooms([...props.rooms, newRoomName]);
          } else {
            console.error("Failed to add room");
          }
        } catch (error) {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            alert(error.response.data.message);
          }
        }
        break;
      case "edit":
        if (currentRoomIndex !== null && editRoomName) {
          try {
            const oldRoomName = props.rooms[currentRoomIndex];
            const editResponse = await axios.put(
              `http://localhost:4000/api/house/${props.selectedHouse}/room/edit`,
              {
                contact: props.contact, // Assuming contact is needed for room edit
                oldRoomName: oldRoomName,
                newRoomName: editRoomName,
              }
            );

            if (editResponse.status === 200) {
              alert("Room name edited successfully");
              const updatedRooms = [...props.rooms];
              updatedRooms[currentRoomIndex] = editRoomName;
              props.setRooms(updatedRooms);

              // Update selected room if it was edited
              if (props.selectedRoom === oldRoomName) {
                props.setSelectedRoom(editRoomName);
              }
            } else {
              alert("Failed to edit room name");
            }
          } catch (error) {
            if (
              error.response &&
              error.response.data &&
              error.response.data.message
            ) {
              alert(error.response.data.message);
            }
          }
        } else {
          setWarningMessage("New room name is required!");
        }
        break;
      case "delete":
        if (currentRoomIndex !== null) {
          try {
            const deleteRoom = props.rooms[currentRoomIndex];
            const deleteResponse = await axios.delete(
              `http://localhost:4000/api/house/${props.selectedHouse}/room/delete`,
              {
                data: {
                  contact: props.contact, // Assuming contact is needed for room deletion
                  roomName: deleteRoom,
                },
              }
            );

            if (deleteResponse.status === 200) {
              alert(`${deleteRoom} deleted successfully`);
              const updatedRooms = props.rooms.filter(
                (_, index) => index !== currentRoomIndex
              );
              props.setRooms(updatedRooms);

              // Set selected room to the first room in the list
              if (props.selectedRoom === deleteRoom) {
                props.setSelectedRoom(
                  updatedRooms.length > 0 ? updatedRooms[0] : "All Device"
                );
              }
            } else {
              alert("Failed to delete room");
            }
          } catch (error) {
            if (
              error.response &&
              error.response.data &&
              error.response.data.message
            ) {
              alert(error.response.data.message);
            }
          }
        }
        break;
      default:
        console.log("Unknown operation");
    }
    setShowModal(false);
    setOperation("");
    setNewRoomName("");
    setEditRoomName("");
    setCurrentRoomIndex(null);
  };

  let operationText = "";
  let modalBody = null;

  switch (operation) {
    case "add":
      operationText = "Add Room";
      modalBody = (
        <div className="mb-3">
          <label htmlFor="newRoomName" className="form-label">
            Room Name
          </label>
          <input
            type="text"
            className="form-control"
            id="newRoomName"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
          {warningMessage && (
            <div className="alert alert-warning">{warningMessage}</div>
          )}
        </div>
      );
      break;
    case "edit":
      operationText = "Edit Room";
      modalBody = (
        <div className="mb-3">
          <label htmlFor="editRoomName" className="form-label">
            New Room Name
          </label>
          <input
            type="text"
            className="form-control"
            id="editRoomName"
            value={editRoomName}
            onChange={(e) => setEditRoomName(e.target.value)}
          />
        </div>
      );
      break;
    case "delete":
      operationText = "Delete Room";
      modalBody = <p>Are you sure you want to delete this room?</p>;
      break;
    default:
      operationText = "Operation";
  }

  return (
    <>
      <ul className="nav justify-content-center mb-3 mt-2">
        <li className="nav-item">
          <h2
            className="mt-1 mr-5"
            aria-current="page"
            style={{
              color: props.isDarkMode ? "#c6ff00" : "#598dfa",
              marginRight: "50px",
            }}
          >
            {props.selectedHouse}
          </h2>
        </li>
        <li className="nav-item">
          <h2 className="mt-1" aria-current="page">
            Manage Rooms
          </h2>
        </li>
        <li className="nav-item">
          <button
            className="nav-link"
            type="button"
            onClick={() => handleOperation("add")}
            style={{ color: props.isDarkMode ? "yellow" : "black" }}
          >
            <i className="bi bi-plus-lg icon-bold">Add Rooms</i>
          </button>
        </li>
      </ul>

      {/* List of rooms */}
      {props.rooms.map((room, index) => (
        <div className="card mb-2" key={index}>
          {/* <div className="card-header">Featured</div> */}
          <div className="card-body">
            <h5 className="card-title">{room}</h5>
            <p className="card-text">
              Are you ready for changes?
            </p>
            <button
              className="btn btn-outline-info"
              style={{ marginRight: "10px" }}
              onClick={() => handleOperation("edit", index)}
            >
              Edit
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => handleOperation("delete", index)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Modal for operations */}
      <div
        className={`modal ${showModal ? "d-block" : ""}`}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{operationText}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body">{modalBody}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              {operation === "delete" ? (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleSubmit(operation)}
                >
                  Confirm Delete
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleSubmit(operation)}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
