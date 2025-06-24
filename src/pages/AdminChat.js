import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import '../styles/chat.css';

const AdminChat = () => {
  const [showChat, setShowChat] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const adminId = '683e9c91e2aa5ca0fbfb1030'; // ID admin

  // Kết nối socket
  useEffect(() => {
    socketRef.current = io('http://localhost:3001');

    socketRef.current.on('newMessage', (data) => {
      if (data.chatId === selectedChat?.chatId) {
        setMessages(prev => [...prev, data]);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [selectedChat]);

  // Lấy danh sách chat
  useEffect(() => {
    axios.get('http://localhost:3001/api/chats')
      .then(res => {
        const chats = res.data.data;

        const filteredChats = chats
          .filter(chat => chat.participants.some(p => p._id === adminId))
          .map(chat => {
            const otherUser = chat.participants.find(p => p._id !== adminId);
            return {
              chatId: chat._id,
              userId: otherUser?._id,
              userName: otherUser?.name || 'Người dùng',
              userAvatar: otherUser?.avatar || '/default-avatar.png',
              lastMessage: chat.lastMessage?.content || 'Chưa có tin nhắn',
            };
          });

        setChatList(filteredChats);
      })
      .catch(err => console.error('❌ Lỗi load danh sách chat:', err));
  }, []);

  // Lấy tin nhắn khi chọn chat
  useEffect(() => {
    if (!selectedChat) return;

    axios.get(`http://localhost:3001/api/chats/${selectedChat.chatId}`)
      .then(res => {
        setMessages(Array.isArray(res.data.data) ? res.data.data : []);
      })
      .catch(err => console.error('❌ Lỗi lấy tin nhắn:', err));
  }, [selectedChat]);

  // Cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Gửi tin nhắn
  const sendMessage = async () => {
    if (!message.trim() || !selectedChat?.chatId) {
      alert('Thiếu nội dung hoặc không có chatId');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3001/api/chats/message', {
        chatId: selectedChat.chatId,
        senderId: adminId,
        content: message,
      });

      socketRef.current.emit('sendMessage', res.data.data);
      setMessages(prev => [...prev, res.data.data]);
      setMessage('');
    } catch (error) {
      console.error('❌ Lỗi gửi tin nhắn:', error);
    }
  };

  return (
    <>
      {/* Nút chat icon tròn góc phải */}
      {!showChat && (
        <div className="chat-icon" onClick={() => setShowChat(true)}>
          💬
        </div>
      )}

      {/* Khung chat */}
      {showChat && (
        <div className="chat-box">
          <div className="chat-wrapper">
            {/* Danh sách người dùng */}
            <div className="user-list">
              {chatList.map(chat => (
                <div
                  key={chat.chatId}
                  className={`user-item ${selectedChat?.chatId === chat.chatId ? 'selected' : ''}`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <img src={chat.userAvatar} alt={chat.userName} className="avatar" />
                  <div>
                    <strong>{chat.userName}</strong>
                    <br />
                    <small>{chat.lastMessage}</small>
                  </div>
                </div>
              ))}
            </div>

            {/* Tin nhắn + input */}
            <div className="chat-content">
              <div className="messages">
                {Array.isArray(messages) && messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${msg.senderId === adminId ? 'admin' : 'user'}`}
                  >
                    {msg.content}
                    <div className="message-time">
                      {msg.createdAt?.slice(11, 16)}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Nhập tin nhắn */}
              <div className="input">
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage}>Gửi</button>
                <button onClick={() => setShowChat(false)} style={{ marginLeft: 5 }}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminChat;
