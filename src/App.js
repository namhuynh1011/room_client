import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import RegisterPage from './pages/register';
import LoginPage from './pages/login';
import AccountUpdatePage from './pages/accountDetail'; // Import trang cập nhật tài khoản
import Header from './components/header';
import ChatBubble from './components/chatbubble'; // Import ChatBubble component

function App() {
  // Lấy token và user từ localStorage, kiểm tra kỹ
  const rawToken = localStorage.getItem('token');
  const token = rawToken && rawToken !== 'null' ? rawToken : undefined;
  const rawUser = localStorage.getItem('user');
  let userId = undefined;
  try {
    if (rawUser && rawUser !== 'null') {
      userId = JSON.parse(rawUser).id;
    }
  } catch (e) {
    userId = undefined;
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/account/update" element={<AccountUpdatePage />} />
      </Routes>
      <ChatBubble userId={userId} token={token} />
    </Router>
  );
}

export default App;