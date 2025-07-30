import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_API_URL}/auth`;

// Đăng ký
export const register = async (data) => {
  return axios.post(`${BASE_URL}/register`, data);
};

// Đăng nhập
export const login = async (data) => {
  const response = await axios.post(`${BASE_URL}/login`, data);
  alert('Login response:', response.data);
  console.log('Login response:', response.data); // log kết quả
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response;
};

// Quên mật khẩu
export const forgotPassword = async (email) => {
  return axios.post(`${BASE_URL}/forgot-password`, { email });
};

// Cập nhật thông tin người dùng
export const updateUser = async (data, token) => {
  return axios.put(`${BASE_URL}/update`, data, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined
    }
  });
};