import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001", // backend URL
  withCredentials: true, // so cookies (refresh token) are sent
});

export default API;