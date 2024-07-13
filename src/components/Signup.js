import React, { Component } from "react";
import { Navigate } from "react-router-dom"; // import useNavigate hook
import axios from "axios";
import "./Signup.css";
axios.defaults.withCredentials = true;

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      contact: "",
      password: "",
      rememberUser: false,
      contactError: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }
  validateInput(input) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const phonePattern = /^\+?[1-9]\d{1,14}$/;
    if (!(emailPattern.test(input) || phonePattern.test(input))) {
      return "Please enter a valid email or phone number.";
    }
    return "";
  }

  //change the state
  handleChange = async (event) => {
    let contactError = "";
    const { name, value } = event.target;
    await this.setState({
      [name]: value,
    });

    if (this.state.contact.length > 0) {
      contactError = this.validateInput(this.state.contact);
    }
    this.setState({
      contactError: contactError,
    });
  };

  valueReset = () => {
    this.setState({
      username: "",
      contact: "",
      password: "",
      rememberUser: false,
      contactError: "",
      redirectToHome: false, // Add state for redirect
    });
  };

  //submiting sign up form
  handleSubmit = async (event) => {
    event.preventDefault();

    const { username, contact, password, rememberUser } = this.state;

    // Here you can also handle the form submission, e.g., send data to an API

    try {
      const response = await axios.post("http://localhost:4000/api/register", {
        username,
        contact,
        password,
        rememberUser,
      });
      console.log(response.data);

      alert(
        `User registered successfully! \nUsername: ${username}\nContact: ${contact}\nPassword: ${password}`
      );

      this.valueReset();
      this.props.setSelectedHouse(this.props.houses[0]);

      //direct log in
      // if(this.state.rememberUser){
      //   this.props.setIsAuthenticated(true);
      //   await this.props.setAuthenticatedContact(contact);
      //   await this.props.setAuthenticatedUsername(username);
      // }

      // Redirect to home page
      this.setState({ redirectToHome: true });
      if (rememberUser) {
        // Delay the reload to ensure navigate completes first
        setTimeout(() => {
          window.location.reload(); // Refresh the page after successful sign-in
        }, 100); // 100 milliseconds delay (adjust if necessary)
      } // Refresh the page after successful sign-in
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        console.error("Error response data:", error.response.data);
        alert(error.response.data.error); // Show alert with error message
      } else if (error.request) {
        // Request was made but no response was received
        console.error("Error request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
      }
      console.error("Error config:", error.config);
    }
  };

  //focus on input
  handleFocus(event) {
    const label = event.target.previousElementSibling;
    const input = event.target;
    label.classList.add("focused");
    input.classList.add("focused");
    input.placeholder = "";
  }

  // blur input
  handleBlur(event) {
    const label = event.target.previousElementSibling;
    const input = event.target;
    if (!event.target.value) {
      label.classList.remove("focused");
      input.classList.remove("focused");
      input.placeholder = label.innerText;
    }
  }

  render() {
    if (this.state.redirectToHome) {
      return <Navigate to="/" />; // Redirect to home page
    }

    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div
                className={`card-body ${
                  this.props.isDarkMode
                    ? "dark-mode-component"
                    : "light-mode-component"
                } `}
                style={{
                  border: "none",
                  boxShadow: "2px 2px 5px 5px rgb(199, 193, 193)",
                  borderRadius: "10px",
                }}
              >
                <h2 className="card-title text-center">Create SmartHome ID</h2>
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group component-spacing mb-2 signup-input-container">
                    <label htmlFor="username" className="form-label">
                      Username:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      placeholder="Username"
                      value={this.state.username}
                      onChange={this.handleChange}
                      onFocus={this.handleFocus}
                      onBlur={this.handleBlur}
                      required
                    />
                  </div>

                  <div className="form-group component-spacing mb-2 signup-input-container">
                    <label htmlFor="contact" className="form-label">
                      Email / Phone:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="contact"
                      name="contact"
                      placeholder="Email / Phone"
                      value={this.state.contact}
                      onChange={this.handleChange}
                      onFocus={this.handleFocus}
                      onBlur={this.handleBlur}
                      required
                    />
                    {this.state.contactError && (
                      <div className="error">{this.state.contactError}</div>
                    )}
                  </div>

                  <div className="form-group component-spacing mb-3 signup-input-container">
                    <label htmlFor="password" className="form-label">
                      Password:
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      placeholder="Password"
                      value={this.state.password}
                      onChange={this.handleChange}
                      onFocus={this.handleFocus}
                      onBlur={this.handleBlur}
                      required
                    />
                  </div>

                  <div className="">
                    <input
                      className="me-2"
                      style={{ cursor: "pointer" }}
                      type="checkbox"
                      id="rememberUser"
                      value={this.state.rememberUser}
                      onChange={(e) =>
                        this.setState({ rememberUser: e.target.checked })
                      }
                    />
                    <label htmlFor="remember-me">Remember me</label>
                  </div>

                  <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">
                      Sign Up
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
