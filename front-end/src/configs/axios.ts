import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Replace with your API base URL
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true // This sends cookies with cross-site requests
});

export default instance;
