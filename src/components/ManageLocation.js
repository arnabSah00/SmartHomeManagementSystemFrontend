import React, { useState } from "react";
import axios from "./axiosConfig";

export default function ManageLocation(props) {
  const [showModal, setShowModal] = useState(false);
  const [operation, setOperation] = useState("");
  const [newHouseName, setNewHouseName] = useState("");
  const [editHouseName, setEditHouseName] = useState("");
  const [currentHouseIndex, setCurrentHouseIndex] = useState(null);
  const [warningMessage, setWarningMessage] = useState("");

  const handleOperation = (op, index = null) => {
    setShowModal(true);
    setOperation(op);
    setCurrentHouseIndex(index);
    setWarningMessage("");

    if (op === "edit" && index !== null) {
      setEditHouseName(props.houses[index]);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setOperation("");
    setNewHouseName("");
    setEditHouseName("");
    setCurrentHouseIndex(null);
  };

  const refreshHouseList = async () => {
    try {
      // Perform your API call to fetch the latest houses
      const response = await axios.get(`http://localhost:4000/api/house?contact=${props.contact}`);
      props.setHouses(response.data.houses);
      props.setSelectedHouse(response.data.houses[0]); 
    } catch (error) {
      console.error("Error refreshing house list:", error);
    }
  };

  const handleSubmit = async(op) => {
    switch (op) {
      case "add":
        // Handle add operation with newHouseName
        console.log("Adding:", newHouseName,props.contact);
        // Here you would typically update state or perform API calls
        if (!newHouseName) {
          setWarningMessage("House name is required!");
          return;
        }
        const addResponse = await axios.post("http://localhost:4000/api/house/add", {
          contact: props.contact,
          houseName: newHouseName
        });

        if (addResponse.status === 200) {
          alert(`${newHouseName} added successfully`);
          // Optionally refresh the list or update state to reflect the new house
          props.setHouses([...props.houses, newHouseName]);
        } else {
          console.error("Failed to add house");
        }
        break;
      case "edit":
        // Handle edit operation with editHouseName
        if (currentHouseIndex !== null) {
          console.log("Editing house at index", currentHouseIndex, "to:", editHouseName);
          // Here you would typically update state or perform API calls
          if (currentHouseIndex !== null && editHouseName) {
            const oldHouseName = props.houses[currentHouseIndex];
            const editResponse = await axios.put("http://localhost:4000/api/house/edit", {
              contact: props.contact,
              oldHouseName: oldHouseName,
              newHouseName: editHouseName
            });

            if (editResponse.status === 200) {
              alert("House name edited successfully");
              // Optionally refresh the list or update state to reflect the edited house
              const updatedHouses = [...props.houses];
              updatedHouses[currentHouseIndex] = editHouseName;
              props.setHouses(updatedHouses);

              if (props.selectedHouse === oldHouseName) {
                props.setSelectedHouse(editHouseName);
              }

            } else {
              alert("Failed to edit house name");
            }
          } else {
            setWarningMessage("New house name is required!");
          }
        }
        break;
      case "delete":
        // Handle delete operation
        if (currentHouseIndex !== null) {
          console.log("Deleting house at index", currentHouseIndex);
          // Here you would typically update state or perform API calls
          if (currentHouseIndex !== null) {
            const deleteHouse = props.houses[currentHouseIndex];
            const deleteResponse = await axios.delete("http://localhost:4000/api/house/delete", {
              data: {
                contact: props.contact,
                houseName: deleteHouse
              }
            });

            if (deleteResponse.status === 200) {
              alert(`${deleteHouse} deleted successfully`);
              // Optionally refresh the list or update state to reflect the deleted house
              const updatedHouses = props.houses.filter((_, index) => index !== currentHouseIndex);
              props.setHouses(updatedHouses);

              if (props.selectedHouse === deleteHouse) {
                props.setSelectedHouse(updatedHouses[0]);
              }

              // Check if the list of houses is empty
              if (updatedHouses.length === 0) {
                refreshHouseList(); // Refresh the house list
              }
            } else {
              alert("Failed to delete house");
            }
          }
        }
        break;
      default:
        console.log("Unknown operation");
    }
    setShowModal(false);
    setOperation("");
    setNewHouseName("");
    setEditHouseName("");
    setCurrentHouseIndex(null);
  };

  let operationText = "";
  let modalBody = null;

  switch (operation) {
    case "add":
      operationText = "Add House";
      modalBody = (
        <div className="mb-3">
          <label htmlFor="newHouseName" className="form-label">House Name</label>
          <input
            type="text"
            className="form-control"
            id="newHouseName"
            value={newHouseName}
            onChange={(e) => setNewHouseName(e.target.value)}
          />
          {warningMessage && <div className="alert alert-warning">{warningMessage}</div>}
        </div>
      );
      break;
    case "edit":
      operationText = "Edit House";
      modalBody = (
        <div className="mb-3">
          <label htmlFor="editHouseName" className="form-label">New House Name</label>
          <input
            type="text"
            className="form-control"
            id="editHouseName"
            value={editHouseName}
            onChange={(e) => setEditHouseName(e.target.value)}
          />
        </div>
      );
      break;
    case "delete":
      operationText = "Delete House";
      modalBody = (
        <p>Are you sure you want to delete this house?</p>
      );
      break;
    default:
      operationText = "Operation";
  }

  return (
    <>
      <ul className="nav justify-content-center mb-3 mt-2">
        <li className="nav-item">
          <h2 className="mt-1" aria-current="page" href="#">
            Manage Location
          </h2>
        </li>
        <li className="nav-item">
          <button
            className="nav-link"
            type="button"
            onClick={() => handleOperation("add")}
            style={{ color: props.isDarkMode ? "yellow" : "black" }}
          >
            <i className="bi bi-plus-lg icon-bold">Add Homes</i>
          </button>
        </li>
      </ul>

      {/* List of houses */}
      {props.houses.map((house, index) => (
        <div className="card mb-2" key={index}>
          {/* <div className="card-header">Header</div> */}
          <div className="card-body">
            <h5 className="card-title">{house}</h5>
            <p className="card-text">
              Home Sweet Home
            </p>
            <button className="btn btn-outline-info" style={{ marginRight: "10px" }} onClick={() => handleOperation("add-member")}>
              Add member
            </button>
            <button className="btn btn-outline-info" style={{ marginRight: "10px" }} onClick={() => handleOperation("edit", index)}>
              Edit
            </button>
            <button className="btn btn-outline-danger" onClick={() => handleOperation("delete", index)}>
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Modal for operations */}
      <div className={`modal ${showModal ? 'd-block' : ''}`} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{operationText}</h5>
              <button type="button" className="btn-close" onClick={handleCloseModal}></button>
            </div>
            <div className="modal-body">
              {modalBody}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
              {operation === "delete" ? (
                <button type="button" className="btn btn-danger" onClick={() => handleSubmit(operation)}>Confirm Delete</button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={() => handleSubmit(operation)}>Submit</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}