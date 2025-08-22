import axios from "axios";

// adjust the baseURL if your backend runs on another port
const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const fetchUsers = () => API.get("/users");
export const createUser = (userData) => API.post("/users", userData);
