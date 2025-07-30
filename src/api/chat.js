import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_API_URL}/chat`;

const getAuthHeader = (token) =>
  token ? { Authorization: `Bearer ${token}` } : {};

export const createOrGetConversation = async (user1_id, user2_id, token) => {
  return axios.post(
    `${BASE_URL}/conversation`,
    { user1_id, user2_id },
    {
      headers: {
        ...getAuthHeader(token),
      }
    }
  );
};

export const getConversations = async (userId, token) => {
  return axios.get(`${BASE_URL}/conversation/${userId}`, {
    headers: {
      ...getAuthHeader(token),
    }
  });
};

export const getMessages = async (conversationId, token) => {
  return axios.get(`${BASE_URL}/message/${conversationId}`, {
    headers: {
      ...getAuthHeader(token),
    }
  });
};

export const sendMessage = async (data, token) => {
  return axios.post(`${BASE_URL}/message`, data, {
    headers: {
      ...getAuthHeader(token),
    }
  });
};