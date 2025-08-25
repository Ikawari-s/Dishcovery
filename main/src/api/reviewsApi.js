import axios from "axios";

const API_URL = "http://localhost:5000/api/reviews";
{
  /* process.env.REACT_APP_REVIEWS_API_URL || */
}
export const getReviews = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (err) {
    console.error("Error fetching reviews:", err);
    return [];
  }
};

export const getReviewById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (err) {
    console.error("Error fetching review:", err);
    return null;
  }
};

export const getReviewsByRestaurantId = async (restaurantId) => {
  try {
    const response = await axios.get(`${API_URL}/restaurant/${restaurantId}`);
    return response.data;
  } catch (err) {
    console.error("Error fetching restaurant reviews:", err);
    return [];
  }
};

export const getReviewsByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (err) {
    console.error("Error fetching user reviews:", err);
    return [];
  }
};
