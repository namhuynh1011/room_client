import React, { useState } from 'react';
import { register } from '../api/auth';

export default function RegisterPage() {
  const [form, setForm] = useState({
    password: '',
    email: '',
    phone: '',
    full_name: '',
    role: 'tenant'
  });
  const [msg, setMsg] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await register(form);
      setMsg(res.data.message || 'Đăng ký thành công!');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Đăng ký thất bại!');
    }
  };

  return (
    <div>
      <h2>Đăng ký tài khoản</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required /><br />
        <input name="phone" placeholder="Số điện thoại" value={form.phone} onChange={handleChange} /><br />
        <input name="full_name" placeholder="Họ tên" value={form.full_name} onChange={handleChange} /><br />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required /><br />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="tenant">Người thuê</option>
          <option value="landlord">Chủ trọ</option>
        </select><br />
        <button type="submit">Đăng ký</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}