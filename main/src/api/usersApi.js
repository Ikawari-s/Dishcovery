import axios from "axios";

const API_URL =
  process.env.REACT_APP_USERS_API_URL || "http://localhost:5000/api/users";

export const followUserApi = async (targetId, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/follow/${targetId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to follow user");
  }
};

// Unfollow a user
export const unfollowUserApi = async (targetId, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/unfollow/${targetId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to unfollow user");
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

export const searchUsers = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: { query }, // sends ?query=searchTerm
    });
    return response.data; // array of matched users (max 5)
  } catch (err) {
    console.error(
      "Error searching users:",
      err.response?.data?.message || err.message
    );
    throw new Error(err.response?.data?.message || "Failed to search users");
  }
};
