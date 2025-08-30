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

export const uploadProfilePictureApi = async (file, token) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.post(
      `${API_URL}/upload-profile-picture`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // ✅ send JWT here
        },
      }
    );

    return response.data; // { message, imageUrl }
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to upload image");
  }
};

export const getFeedReviewsApi = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/feed`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // array of reviews
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch feed");
  }
};

export const getUserProfileApi = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data; // returns user profile object
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to fetch user profile"
    );
  }
};

export const updateProfileApi = async (profileData, token) => {
  try {
    const response = await axios.put(`${API_URL}/update-profile`, profileData, {
      headers: {
        Authorization: `Bearer ${token}`, // <-- send token
      },
    });
    return response.data; // returns updated user profile
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to update profile");
  }
};

export const getStatsApi = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/stats/${userId}`);
    return response.data; // { reviews, followers, following }
  } catch (err) {
    console.error(
      "Error fetching user stats:",
      err.response?.data?.message || err.message
    );
    throw new Error(
      err.response?.data?.message || "Failed to fetch user stats"
    );
  }
};
