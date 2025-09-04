import axios from "axios";

const API_URL = process.env.REACT_APP_LISTS_API_URL;

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

export const createListApi = async (listData, token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // protect middleware
    },
  };

  const { data } = await axios.post(`${API_URL}/create`, listData, config);
  return data;
};

// (optional) Update list
export const updateListApi = async (listId, listData, token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.put(`${API_URL}/${listId}`, listData, config);
  return data;
};

export const deleteListApi = async (listId, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // token from userInfo
      },
    };

    const { data } = await axios.delete(`${API_URL}/${listId}`, config);
    return data;
  } catch (error) {
    console.error("Error deleting list:", error);
    throw error;
  }
};
