import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080", // Replace with your API base URL
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // This sends cookies with cross-site requests
});

export default instance;
