import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_API_URL}/user`;

// API để upload avatar
export const uploadAvatar = async (formData, token) => {
  return axios.post(`${BASE_URL}/upload-avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: token ? `Bearer ${token}` : undefined
    }
  });
};

export const findUserByEmail = async (email, token) => {
  return axios.get(`${BASE_URL}/find-by-email`, {
    params: { email },
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined
    }
  });
};