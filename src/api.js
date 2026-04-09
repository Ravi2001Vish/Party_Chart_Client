import axios from "axios";

const API = axios.create({
baseURL: "https://party-chart-server.onrender.com/api",
   //baseURL: "http://localhost:5000/api"
});

export default API;