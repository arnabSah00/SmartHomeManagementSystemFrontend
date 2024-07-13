import React from 'react'
import { Link } from 'react-router-dom';

export default function Smarthome({isDarkMode}) {
  return (
    <div className={`smarthome-container ${isDarkMode ? 'dark' : ''}`}>
      <h1>Welcome to Your Smart Home Management System</h1>
      <p>Control and monitor all your smart devices from one place.</p>
      
      <div className="features">
        <div className={`feature-card ${isDarkMode ? 'dark-card' : ''}`}>
          <h2>Manage Devices</h2>
          <p>Add, remove, and control your smart devices.</p>
          <Link to="/devices">
            <button className="feature-button">Go to Devices</button>
          </Link>
        </div>
        
        <div className={`feature-card ${isDarkMode ? 'dark-card' : ''}`}>
          <h2>Routines</h2>
          <p>Create and manage automated routines.</p>
          <Link to="/routines">
            <button className="feature-button">Manage Routines</button>
          </Link>
        </div>
        
        <div className={`feature-card ${isDarkMode ? 'dark-card' : ''}`}>
          <h2>Favourites</h2>
          <p>Quick access to your favourite devices and routines.</p>
          <Link to="/favourites">
            <button className="feature-button">View Favourites</button>
          </Link>
        </div>
        
        <div className={`feature-card ${isDarkMode ? 'dark-card' : ''}`}>
          <h2>History</h2>
          <p>View the history of your device activities.</p>
          <Link to="/history">
            <button className="feature-button">View History</button>
          </Link>
        </div>
        
        <div className={`feature-card ${isDarkMode ? 'dark-card' : ''}`}>
          <h2>Settings</h2>
          <p>Customize your smart home settings.</p>
          <Link to="/settings">
            <button className="feature-button">Go to Settings</button>
          </Link>
        </div>
      </div>
    </div>
  )
}
