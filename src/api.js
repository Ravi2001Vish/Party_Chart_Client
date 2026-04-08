import axios from "axios";

const API = axios.create({
  baseURL: "https://party-chart-server.onrender.com/api",
});

export default API;