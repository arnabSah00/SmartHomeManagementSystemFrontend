import React, { Component } from "react";
import { Link, Outlet } from "react-router-dom";

export default class Menu extends Component {
  render() {
    return (
      <div>
        
        <ul class="nav nav-tabs bg-dark navbar-dark justify-content-center">

          <li class="nav-item">
            <Link
              class="nav-link"
              aria-current="page"
              to="/menu/history"
            >
              History
            </Link>
          </li>
          <li class="nav-item">
            <Link class="nav-link" to="/menu/notification">
              Notification
            </Link>
          </li>

          <li class="nav-item">
            <Link class="nav-link active" to="/menu">
              How to use
            </Link>
          </li>

          <li class="nav-item">
            <Link class="nav-link" to="/menu/notice">
              Notices
            </Link>
          </li>
          <li class="nav-item">
            <Link class="nav-link" to="/menu/contact">
              Contact us
            </Link>
          </li>
        </ul>

        <Outlet />
      </div>
    );
  }
}
