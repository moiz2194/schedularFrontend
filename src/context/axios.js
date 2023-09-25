import axios from 'axios';
// https://backend-production-9785.up.railway.app
const axiosInstance = axios.create({
  baseURL: 'https://backend-production-9785.up.railway.app', // Replace with your API host
  headers: {
    'Content-Type': 'application/json',
    "Authentication": `${localStorage.getItem('login-token')}`,
  },
});

export default axiosInstance;
