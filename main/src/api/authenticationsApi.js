import axios from "axios";

const API_URL = process.env.REACT_APP_AUTH_API_URL;
const ADMIN_API_URL = process.env.REACT_APP_ADMIN_LOGIN_URL;
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
    // Try admin login first
    let response = await axios.post(ADMIN_API_URL, { email, password });
    return { ...response.data, role: "admin" };
  } catch (adminError) {
    // If admin login fails, try user login
    try {
      let response = await axios.post(`${API_URL}/login`, { email, password });
      return { ...response.data, role: "user" };
    } catch (userError) {
      throw new Error(
        userError.response?.data?.message ||
          adminError.response?.data?.message ||
          "Login failed"
      );
    }
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

export const forgotPasswordRequestApi = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password/request`, {
      email,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to send reset OTP");
  }
};

// Verify OTP
export const forgotPasswordVerifyApi = async (email, otp) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password/verify`, {
      email,
      otp,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Invalid OTP");
  }
};

export const forgotPasswordResendOtpApi = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password/resend`, {
      email,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to resend OTP");
  }
};

// Reset Password
export const resetPasswordApi = async (email, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password/reset`, {
      email,
      newPassword,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Reset password failed");
  }
};
