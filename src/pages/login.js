import React, { useState } from 'react';
import { login, forgotPassword } from '../api/auth';
import { useNavigate } from 'react-router-dom'; // Thêm dòng này

export default function LoginPage() {
  const [form, setForm] = useState({ phoneOrEmail: '', password: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Thêm dòng này

   const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
  e.preventDefault();
  setLoading(true);
  setMsg('');
  try {
    const res = await login(form);
    setMsg(res.data.message || 'Đăng nhập thành công!');
    localStorage.setItem('user', JSON.stringify(res.data.user));
    localStorage.setItem('token', res.data.token); // THÊM DÒNG NÀY
    navigate('/');
    setTimeout(() => {
      window.location.reload();
    }, 100);
  } catch (err) {
    setMsg(err.response?.data?.error || 'Đăng nhập thất bại!');
  }
  setLoading(false);
};

  const handleForgotPassword = async () => {
    setMsg('');
    // Kiểm tra định dạng email rất cơ bản
    const email = form.phoneOrEmail.trim();
    if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)) {
      setMsg('Vui lòng nhập email hợp lệ để lấy lại mật khẩu!');
      return;
    }
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setMsg(res.data.message || 'Mật khẩu mới đã được gửi tới email của bạn!');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Không thể gửi mật khẩu mới!');
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="phoneOrEmail"
          placeholder="Số điện thoại hoặc Email"
          value={form.phoneOrEmail}
          onChange={handleChange}
          required
        /><br />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        /><br />
        <button type="submit" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>
      </form>
      <button
        type="button"
        onClick={handleForgotPassword}
        disabled={loading}
        style={{ marginTop: 8 }}
      >
        Quên mật khẩu?
      </button>
      {msg && <p>{msg}</p>}
    </div>
  );
}