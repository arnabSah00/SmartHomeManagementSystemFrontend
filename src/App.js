import Navbar from "./components/Navbar";
import Smarthome from "./components/Smarthome";
import Favourites from "./components/Favourites";
import Devices from "./components/Devices";
import Life from "./components/Life";
import Routines from "./components/Routines";
import Signup from "./components/Signup";
import Menu from "./components/Menu";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import History from "./components/History";
import Usermanual from "./components/Usermanual";
import Notification from "./components/Notification";
import Notice from "./components/Notice";
import Contact from "./components/Contact";
import "./App.css";
import { useState, useEffect } from "react";
import axios from "./components/axiosConfig";
import ManageLocation from "./components/ManageLocation";
import ManageRooms from "./components/ManageRooms";
import AddDevice from "./components/AddDevice";
axios.defaults.withCredentials = true;

function App() {
  // State to track the theme, initialized from local storage
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("isDarkMode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("isDarkMode", isDarkMode);

    if (isDarkMode) {
      document.body.classList.add("dark-background");
      document.body.classList.remove("default-background");
    } else {
      document.body.classList.add("default-background");
      document.body.classList.remove("dark-background");
    }
  }, [isDarkMode]);

  //authentication control
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: { userid: "", username: "" },
  });
  // Update authentication
  useEffect(() => {
    //authentication set
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/checkAuth");
        setAuth(response.data);
      } catch (error) {
        // console.error("Error checking authentication status:", error);
      }
    };
    //authentication check
    checkAuth();
  }, []);

  //house control
  const [houses, setHouses] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState(
    localStorage.getItem("selectedHouse") || houses[0]
  );

  // Update local storage when selectedHouse or selectedRoom changes
  useEffect(() => {
    localStorage.setItem("selectedHouse", selectedHouse);
  }, [selectedHouse]);

  // Fetch houses when authentication changes
  useEffect(() => {
    if (auth.isAuthenticated) {
      const fetchHouses = async () => {
        try {
          const response = await axios.get(
            `http://localhost:4000/api/house?contact=${auth.user.userid}`
          );
          setHouses(response.data.houses);
          setSelectedHouse(response.data.houses[0]); // Set the selected house to the first house
        } catch (error) {
          // console.error("Error checking house status:", error);
        }
      };

      fetchHouses();
    }
  }, [auth]);

  //room controle
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(
    localStorage.getItem("selectedRoom") || "Living room"
  );

  useEffect(() => {
    localStorage.setItem("selectedRoom", selectedRoom);
  }, [selectedRoom]);

  // Function to fetch rooms for a given house
  const fetchRooms = async (house) => {
    try {
      const response = await axios.get(
        `house/${encodeURIComponent(house)}/room?contact=${encodeURIComponent(
          auth.user.userid
        )}`
      );
      setRooms(response.data.rooms);
      setSelectedRoom(response.data.rooms[0] || "All Device"); // Set the selected room to the first room or empty if no rooms
      return response.data.rooms; // Return the fetched rooms
    } catch (error) {
      setRooms([]);
      setSelectedRoom(""); // Set the selected room to empty if error occurs
      return []; // Return the fetched rooms
    }
  };

  useEffect(() => {
    if (selectedHouse) {
      fetchRooms(selectedHouse);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHouse, auth]);

  return (
    <BrowserRouter>
      <Navbar
        isAuthenticated={auth.isAuthenticated}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        authenticatedUser={auth.user}
        setSelectedHouse={setSelectedHouse}
        houses={houses}
      />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Smarthome isDarkMode={isDarkMode}/>} />
          {auth.isAuthenticated && (
            <>
              <Route
                path="favourites"
                element={
                  <Favourites
                    isDarkMode={isDarkMode}
                    houses={houses}
                    isAuthenticated={auth.isAuthenticated}
                    user={auth.user}
                    selectedHouse={selectedHouse}
                    setSelectedHouse={setSelectedHouse}
                    fetchRooms={fetchRooms}
                    rooms={rooms}
                    selectedRoom={selectedRoom}
                    setSelectedRoom={setSelectedRoom}
                  />
                }
              />
              <Route
                path="devices"
                element={
                  <Devices
                    isDarkMode={isDarkMode}
                    houses={houses}
                    isAuthenticated={auth.isAuthenticated}
                    user={auth.user}
                    selectedHouse={selectedHouse}
                    setSelectedHouse={setSelectedHouse}
                    fetchRooms={fetchRooms}
                    rooms={rooms}
                    selectedRoom={selectedRoom}
                    setSelectedRoom={setSelectedRoom}
                  />
                }
              />
              <Route path="routines" element={<Routines />} />
              <Route path="history" element={<History isDarkMode={isDarkMode}/>} />
              <Route path="contact" element={<Contact />} />
              <Route
                path="manage-location"
                element={
                  <ManageLocation
                    houses={houses}
                    setSelectedHouse={setSelectedHouse}
                    selectedHouse={selectedHouse}
                    isDarkMode={isDarkMode}
                    setHouses={setHouses}
                    contact={auth.user.userid}
                  />
                }
              />
              <Route
                path="manage-rooms"
                element={
                  <ManageRooms
                    contact={auth.user.userid}
                    rooms={rooms}
                    setRooms={setRooms}
                    fetchRooms={fetchRooms}
                    selectedRoom={selectedRoom}
                    setSelectedRoom={setSelectedRoom}
                    selectedHouse={selectedHouse}
                    isDarkMode={isDarkMode}
                  />
                }
              />
              <Route
                path="add-device"
                element={
                  <AddDevice
                    contact={auth.user.userid}
                    selectedRoom={selectedRoom}
                    selectedHouse={selectedHouse}
                    isDarkMode={isDarkMode}
                  />
                }
              />
            </>
          )}
          <Route path="life" element={<Life />} />
          <Route
            path="signup"
            element={
              <Signup
                isDarkMode={isDarkMode}
                setSelectedHouse={setSelectedHouse}
                houses={houses}
              />
            }
          />
          <Route path="usermanual" element={<Usermanual />} />
          <Route path="notification" element={<Notification />} />
          <Route path="notice" element={<Notice />} />

          {/* /menu route with nested routes */}
          <Route path="/menu" element={<Menu />}>
            <Route index element={<Usermanual />} />
            <Route path="history" element={<History isDarkMode={isDarkMode}/>} />
            <Route path="notification" element={<Notification />} />
            <Route path="notice" element={<Notice />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
