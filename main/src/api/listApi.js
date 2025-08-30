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
