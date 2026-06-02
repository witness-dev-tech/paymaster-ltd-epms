import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Maps to your Express backend port
  withCredentials: true, // Crucial for express-session cookie handling
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;