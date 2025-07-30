import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import {
  getMessages,
  sendMessage,
  createOrGetConversation
} from '../api/chat';
import { findUserByEmail } from '../api/user';
import './chatbubble.css';

const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');

const ChatBubble = ({ userId, token }) => {
  const [open, setOpen] = useState(false);
  const [targetEmail, setTargetEmail] = useState('');
  const [targetUserId, setTargetUserId] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Log khi mount để kiểm tra props
  useEffect(() => {
    console.log("ChatBubble mounted. userId:", userId, "token:", token);
  }, [userId, token]);

  // Tìm user qua email
  const handleFindUser = async () => {
    const usedToken = token || localStorage.getItem('token');
    if (!targetEmail.trim()) {
      alert('Chưa nhập email người nhận!');
      return;
    }
    try {
      const res = await findUserByEmail(targetEmail, usedToken);
      if (res.data && res.data.id) {
        setTargetUserId(res.data.id);
      } else {
        alert('Không tìm thấy người dùng với email này');
      }
    } catch (err) {
      alert('Lỗi khi tìm user: ' + (err.response?.data?.error || err.message));
    }
  };

  // Tạo hoặc lấy conversation khi đã có targetUserId
  useEffect(() => {
    if (userId && targetUserId && token) {
      createOrGetConversation(userId, targetUserId, token)
        .then(res => {
          setConversationId(res.data.id);
        })
        .catch(err => {
          console.error('Conversation error:', err);
        });
    }
  }, [userId, targetUserId, token]);

  
  useEffect(() => {
  if (conversationId && token) {
    console.log('Frontend joinConversation:', conversationId);
    socket.emit('joinConversation', conversationId);
  }
}, [conversationId, token]);
  // Join phòng conversation và lấy tin nhắn khi có conversationId
  useEffect(() => {
    if (conversationId && token) {
      // Join phòng socket
      socket.emit('joinConversation', conversationId);

      // Lấy lịch sử tin nhắn
      getMessages(conversationId, token)
        .then(res => {
          setMessages(res.data);
        })
        .catch(err => console.error('Get messages error:', err));
    }
  }, [conversationId, token]);

  // Lắng nghe tin nhắn realtime qua socket
  useEffect(() => {
    const handleReceiveMessage = (msg) => {
      if (msg.conversation_id === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on('receiveMessage', handleReceiveMessage);
    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [conversationId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Gửi tin nhắn
  const handleSend = async () => {
    if (!input.trim() || !conversationId || !targetUserId) {
      alert('Thiếu nội dung tin nhắn hoặc chưa chọn người nhận!');
      return;
    }
    const messageObj = {
      conversation_id: conversationId,
      sender_id: userId,
      receiver_id: targetUserId,
      content: input,
      type: 'text'
    };
    try {
      const res = await sendMessage(messageObj, token);
      // Đợi tin nhắn về qua socket để tránh double
      socket.emit('sendMessage', res.data); // emit với tin nhắn đã có id, created_at
      setInput('');
    } catch (err) {
      alert('Lỗi khi gửi tin nhắn: ' + (err.response?.data?.error || err.message));
    }
  };

  // Reset khi đổi người nhận
  useEffect(() => {
    setMessages([]);
    setConversationId(null);
  }, [targetUserId]);

  return (
    <div className={`chat-bubble-wrapper ${open ? 'open' : ''}`}>
      {!open && (
        <button className="chat-bubble-btn" onClick={() => setOpen(true)}>
          💬
        </button>
      )}
      {open && (
        <div className="chat-bubble-box">
          <div className="chat-bubble-header">
            <span>Chat hỗ trợ</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>
          {!targetUserId ? (
            <div className="chat-bubble-email">
              <input
                type="email"
                value={targetEmail}
                onChange={e => setTargetEmail(e.target.value)}
                placeholder="Nhập email người nhận..."
              />
              <button onClick={handleFindUser}>Bắt đầu chat</button>
            </div>
          ) : (
            <>
              <div className="chat-bubble-messages">
                {messages.map((msg, idx) => (
                  <div
                    key={msg.id || idx}
                    className={`chat-bubble-message ${msg.sender_id === userId ? 'me' : 'other'}`}
                  >
                    {msg.content}
                  </div>
                ))}
                <div ref={messagesEndRef}></div>
              </div>
              <div className="chat-bubble-input">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Nhập tin nhắn..."
                />
                <button onClick={handleSend}>Gửi</button>
              </div>
              <div style={{marginTop: 8}}>
                <button onClick={() => {
                  setTargetUserId(null);
                  setTargetEmail('');
                  setMessages([]);
                  setConversationId(null);
                }}>Chọn người nhận khác</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBubble;