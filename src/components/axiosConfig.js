// axiosConfig.js

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:4000/api/',
  timeout: 5000, // Timeout of 5 seconds
  withCredentials: true, // Include cookies
});

export default instance;