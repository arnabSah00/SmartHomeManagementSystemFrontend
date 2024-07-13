import React, { useState, useEffect } from 'react';
import axios from './axiosConfig';
import './History.css';

const History = ({ isDarkMode }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Fetch history data from the server
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/history');
        setHistory(response.data.history);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className={`history-container ${isDarkMode ? 'dark' : ''}`}>
      <h1>Device Activity History</h1>
      {history.length > 0 ? (
        <ul className="history-list">
          {history.map((entry, index) => (
            <li key={index} className={`history-item ${isDarkMode ? 'dark' : ''}`}>
              <p><strong>Device:</strong> {entry.device}</p>
              <p><strong>Action:</strong> {entry.action}</p>
              <p><strong>Timestamp:</strong> {new Date(entry.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No history available.</p>
      )}
    </div>
  );
};

export default History;