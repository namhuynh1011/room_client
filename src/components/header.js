import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Thêm dòng này

export default function Header({ onLogout }) {
  const [user, setUser] = useState(null);
const navigate = useNavigate();
  useEffect(() => {
    // Lấy user từ localStorage mỗi lần load/trang thay đổi
    const userData = localStorage.getItem('user');
    setUser(userData ? JSON.parse(userData) : null);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    if (onLogout) onLogout();
    navigate('/'); // Chuyển về trang chủ
      setTimeout(() => {
        window.location.reload(); // Load lại trang sau khi chuyển trang
      }, 100); // delay nhỏ để đảm bảo đã chuyển trang
  };

  return (
    <header style={{ padding: 16, borderBottom: '1px solid #ccc', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <b>Room Management</b>
      </div>
      <div>
        {!user ? (
          <>
            <a href="/login" style={{ marginRight: 12 }}>Đăng nhập</a>
            <a href="/register">Đăng ký</a>
          </>
        ) : (
          <>
            <span style={{ marginRight: 12 }}>Xin chào, {user.full_name || user.username || user.email}!</span>
            <button onClick={handleLogout}>Đăng xuất</button>
          </>
        )}
      </div>
    </header>
  );
}