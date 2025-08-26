import axios from "axios";

const API_URL =
  process.env.REACT_APP_USERS_API_URL || "http://localhost:5000/api/users";

// Register a new user
export const registerUser = async ({ name, email, password }) => {
  try {
    const response = await axios.post(API_URL, {
      name,
      email,
      password,
    });

    return response.data;
  } catch (err) {
    console.error(
      "Error registering user:",
      err.response?.data?.message || err.message
    );
    throw new Error(err.response?.data?.message || "Registration failed");
  }
};

// Log in an existing user
export const loginUser = async ({ email, password }) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });

    return response.data;
  } catch (err) {
    console.error(
      "Error logging in:",
      err.response?.data?.message || err.message
    );
    throw new Error(err.response?.data?.message || "Login failed");
  }
};

export const fetchFollowers = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/followers/${userId}`);
    return response.data; // array of users
  } catch (err) {
    console.error(
      "Error fetching followers:",
      err.response?.data?.message || err.message
    );
    throw new Error(err.response?.data?.message || "Failed to fetch followers");
  }
};

export const fetchFollowing = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/following/${userId}`);
    return response.data;
  } catch (err) {
    console.error(
      "Error fetching following:",
      err.response?.data?.message || err.message
    );
    throw new Error(err.response?.data?.message || "Failed to fetch following");
  }
};
