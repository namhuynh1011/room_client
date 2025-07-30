import React, { useState, useEffect } from 'react';
import { updateUser } from '../api/auth';
import {uploadAvatar } from '../api/user';
export default function AccountUpdatePage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    zalo: '',
    facebook: '',
    profile_picture: '', // Thêm trường này
  });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const userObj = JSON.parse(userData);
      setUser(userObj);
      setForm({
        full_name: userObj.full_name || '',
        email: userObj.email || '',
        phone: userObj.phone || '',
        password: '',
        profile_picture: userObj.profile_picture || '',
      });
    }
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Xử lý upload avatar
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await uploadAvatar(formData, user.token);
      setForm(f => ({ ...f, profile_picture: res.data.url }));
      setMsg('Upload ảnh thành công!');
    } catch (err) {
      setMsg('Upload ảnh thất bại!');
    }
    setAvatarLoading(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const res = await updateUser(
        { ...form, id: user.id }, // truyền kèm profile_picture
        user.token
      );
      setMsg(res.data.message || 'Cập nhật thành công!');
      const updatedUser = { ...user, ...form };
      delete updatedUser.password;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      setMsg(err.response?.data?.error || 'Cập nhật thất bại!');
    }
    setLoading(false);
  };

  if (!user) return <p>Vui lòng đăng nhập!</p>;

  return (
    <div style={{ maxWidth: 400, margin: '32px auto' }}>
      <h2>Cập nhật tài khoản</h2>
      <form onSubmit={handleSubmit}>
        <label>Họ tên:</label><br />
        <input
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          required
        /><br />

        <label>Email:</label><br />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        /><br />

        <label>Số điện thoại:</label><br />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
        /><br />
        <label>Zalo:</label><br />
        <input
          name="zalo"
          value={form.zalo}
          onChange={handleChange}
        /><br />
        <label>Facebook:</label><br />
        <input
          name="facebook"
          value={form.facebook}
          onChange={handleChange}
        /><br />

        <label>Mật khẩu mới (nếu đổi):</label><br />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Để trống nếu không đổi"
        /><br />

        <label>Ảnh đại diện:</label><br />
        {form.profile_picture && (
          <img src={form.profile_picture} alt="avatar" width={80} style={{ borderRadius: 8, marginBottom: 8 }} />
        )}<br/>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={avatarLoading}
        /><br />

        <button type="submit" disabled={loading}>
          {loading ? 'Đang cập nhật...' : 'Cập nhật'}
        </button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}