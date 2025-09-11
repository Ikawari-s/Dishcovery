import axios from "axios";

const API_URL = process.env.REACT_APP_API_ADMIN_URL;

export const addRestaurantApi = async (restaurantData) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = userInfo?.token;

    const response = await axios.post(
      `${API_URL}/add-restaurant`,
      restaurantData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const adminDeleteReviewApi = async (reviewId) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = userInfo?.token;
    const response = await axios.delete(
      `${API_URL}/delete/review/${reviewId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};
