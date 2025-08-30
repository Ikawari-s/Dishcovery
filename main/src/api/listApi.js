import axios from "axios";

const API_URL = "http://localhost:5000/api/lists";

export const getAllListsApi = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching lists:", error);
    throw error;
  }
};

export const getListById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching list:", err);
    return null;
  }
};
