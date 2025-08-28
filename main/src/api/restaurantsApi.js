import axios from "axios";

const API_URL = "http://localhost:5000/api/restaurants";

export const getRestaurants = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (err) {
    console.error("Error fetching restaurants:", err);
    return [];
  }
};

export const getRestaurantsById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (err) {
    console.error("Error fetching restaurant:", err);
    return null;
  }
};

export const searchRestaurants = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: { query },
    });
    return response.data;
  } catch (err) {
    console.error(
      "Error searching restaurants:",
      err.response?.data?.message || err.message
    );
    throw new Error(
      err.response?.data?.message || "Failed to search restaurants"
    );
  }
};

export const ListRestaurantSearch = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: { query },
    });
    return response.data;
  } catch (err) {
    console.error(
      "Error searching restaurants:",
      err.response?.data?.message || err.message
    );
    throw new Error(
      err.response?.data?.message || "Failed to search restaurants"
    );
  }
};
