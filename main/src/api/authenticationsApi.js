import axios from "axios";

const API_URL = "http://localhost:5000/api/authentication";

// Register a new user
export const registerUser = async ({ name, email, password }) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
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

export const changePasswordApi = async ({
  currentPassword,
  newPassword,
  token,
}) => {
  try {
    const response = await axios.put(
      `${API_URL}/change-password`,
      { currentPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error(
      "Error changing password:",
      err.response?.data?.message || err.message
    );
    throw new Error(err.response?.data?.message || "Change password failed");
  }
};

export const requestOtpApi = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/2fa/request`, { email });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Request OTP failed");
  }
};

// Verify OTP
export const verifyOtpApi = async (email, otp) => {
  try {
    const response = await axios.post(`${API_URL}/2fa/verify`, { email, otp });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "OTP verification failed");
  }
};
