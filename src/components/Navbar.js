import React, { useState } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import Signin from "./Signin";
import "./Navbar.css";
import QRCodeScanner from './QrScaner';
import axios from "axios";
axios.defaults.withCredentials = true;

export default function Navbar(props) {
  const [signinModalIsOpen, setSigninModalIsOpen] = useState(false);
  const navigate = useNavigate();

  const openSigninModal = () => {
    setSigninModalIsOpen(true);
  };

  const closeSigninModal = () => {
    setSigninModalIsOpen(false);
  };

  const handleSignOut = async() => {
    try {
      const response = await axios.get('http://localhost:4000/api/signout', { withCredentials: true });
      console.log(response.data);
      props.setSelectedHouse(null);
      alert('Logout successful');
      navigate("/"); // Redirect to the home page
      // Delay the reload to ensure navigate completes first
      setTimeout(() => {
        window.location.reload(); // Refresh the page after successful sign-in
      }, 100); // 100 milliseconds delay (adjust if necessary)
      // checkAuth(); // Refresh authentication status
    } catch (error) {
      console.error('Logout failed', error.response?.data);
      alert('Logout failed');
    }
  };

  const toggleTheme = () => {
    props.setIsDarkMode(!props.isDarkMode); // Toggle the theme state
  };

  return (
    <div>
      <nav
        className={`navbar navbar-expand-lg ${
          props.isDarkMode
            ? "navbar-dark bg-dark"
            : "navbar-light light-mode-component"
        }`}
      >
        <div className="container-fluid">
          <NavLink
            className="navbar-brand"
            to="/"
            style={{ color: props.isDarkMode ? "yellow" : "black" }}
          >
            SmartHome
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  className={`nav-link ${
                    !props.isAuthenticated ? "disabled" : ""
                  }`}
                  activeclassname="active"
                  aria-disabled="true"
                  aria-current="page"
                  to="/favourites"
                >
                  Favourites
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={`nav-link ${
                    !props.isAuthenticated ? "disabled" : ""
                  }`}
                  aria-disabled="true"
                  aria-current="page"
                  to="/devices"
                >
                  Devices
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/life">
                  Life
                </NavLink>
              </li>

              <li className="nav-item ">
                <NavLink
                  className={`nav-link ${
                    !props.isAuthenticated ? "disabled" : ""
                  }`}
                  aria-disabled="true"
                  to="/routines"
                >
                  Routines
                </NavLink>
              </li>

              <li className="nav-item dropdown">
                <NavLink
                  className="nav-link dropdown-toggle "
                  to="/menu"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Menu
                </NavLink>
                <ul
                  className={` dropdown-menu ${
                    props.isDarkMode
                      ? "dark-mode-component"
                      : "light-mode-component"
                  } `}
                >
                  <li>
                    <NavLink
                      className={`dropdown-item ${
                        !props.isAuthenticated ? "disabled" : ""
                      }`}
                      to="/history"
                      style={{ color: props.isDarkMode ? "white" : "black" }}
                    >
                      History
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/notification"
                      style={{ color: props.isDarkMode ? "white" : "black" }}
                    >
                      Notification
                    </NavLink>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/usermanual"
                      style={{ color: props.isDarkMode ? "white" : "black" }}
                    >
                      Hou to use
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/notice"
                      style={{ color: props.isDarkMode ? "white" : "black" }}
                    >
                      Notices
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className={`dropdown-item ${
                        !props.isAuthenticated ? "disabled" : ""
                      }`}
                      to="/contact"
                      style={{ color: props.isDarkMode ? "white" : "black" }}
                    >
                      Contact us
                    </NavLink>
                  </li>
                </ul>
              </li>
            </ul>

            <ul className="navbar-nav justify-content-end">
              <li className="nav-item ">
                {props.isAuthenticated ? (
                  <div className="dropdown me-2">
                    <button
                      className="btn-logo "
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i
                        className="bi bi-person-circle text-logo"
                        style={{ color: props.isDarkMode ? "yellow" : "black" }}
                      ></i>
                    </button>
                    <div
                      className={`dropdown-menu ${
                        props.isDarkMode
                          ? "dark-mode-component"
                          : "light-mode-component"
                      } `}
                      style={{ padding: "10px" }}
                    >
                      <div className="text-center">
                        <p>hello {props.authenticatedUser.username}</p>
                      </div>
                      <div>
                        <span className="" style={{ fontSize: "20px" }}>
                          Account
                        </span>
                        <p>{props.authenticatedUser.userid}</p>
                      </div>

                      <div className="text-center">
                        <button
                          onClick={handleSignOut}
                          className="dropdown-item me-2 fw-bold"
                          style={{ color: "red" }}
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={openSigninModal}
                    className="btn btn-primary me-2 fw-bold"
                  >
                    Sign In
                  </button>
                )}
                <Signin
                  isOpen={signinModalIsOpen}
                  onClose={closeSigninModal}
                  isDarkMode={props.isDarkMode}
                  setSelectedHouse={props.setSelectedHouse}
                  houses={props.houses}
                />
              </li>

              {/* QR scaner button  */}
              <li className="nav-item">
                {/* <button className="btn-logo me-2 fw-bold">
                  {props.isDarkMode ? (
                    <i
                      className="bi bi-qr-code-scan text-logo"
                      style={{ color: "white" }}
                    ></i>
                  ) : (
                    <i
                      className="bi bi-qr-code-scan text-logo "
                      style={{ color: "black" }}
                    ></i>
                  )}
                </button> */}
                <QRCodeScanner isDarkMode={props.isDarkMode} />
              </li>

              {/* them changing button  */}
              <li className="nav-item">
                <button onClick={toggleTheme} className="btn-logo me-2 fw-bold">
                  {props.isDarkMode ? (
                    <i
                      className="bi bi-brightness-high-fill text-logo"
                      style={{ color: "white" }}
                    ></i>
                  ) : (
                    <i
                      className="bi bi-moon-fill text-logo "
                      style={{ color: "black" }}
                    ></i>
                  )}
                </button>
              </li>
            </ul>

            <form className="d-flex" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>

      <Outlet />
    </div>
  );
}
