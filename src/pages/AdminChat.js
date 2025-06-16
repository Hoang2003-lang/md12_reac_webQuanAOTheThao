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
  const currentChatIdRef = useRef(null);
  const socketRef = useRef(null);

  const adminId = '683e9c91e2aa5ca0fbfb1030'; // ID của admin

  // Kết nối socket khi component mount
  useEffect(() => {
    socketRef.current = io('http://localhost:3001');

    socketRef.current.on('connect', () => {
      console.log('Kết nối socket thành công');
    });

    socketRef.current.on('receiveMessage', (msg) => {
      if (msg.chatId === currentChatIdRef.current) {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Load danh sách chat
  useEffect(() => {
    axios.get('http://localhost:3001/api/chats')
      .then(res => {
        const chats = res.data.data;

        const filteredChats = chats
          .filter(chat => chat.participants.includes(adminId))
          .map(chat => {
            const otherUserId = chat.participants.find(p => p !== adminId);
            return {
              chatId: chat._id,
              userId: otherUserId,
              lastMessage: chat.lastMessage?.content || 'Chưa có tin nhắn',
            };
          });

        setChatList(filteredChats);
      })
      .catch(err => console.error('Lỗi load chat:', err));
  }, []);

  // Load lịch sử tin nhắn khi chọn chat
  useEffect(() => {
    if (!selectedChat) return;

    currentChatIdRef.current = selectedChat.chatId;

    axios.get(`http://localhost:3001/api/chats/${selectedChat.chatId}`)
      .then(res => {
        setMessages(res.data.data.messages || []);
      })
      .catch(err => console.error('Lỗi lấy tin nhắn:', err));
  }, [selectedChat]);

  // Cuộn xuống tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Gửi tin nhắn
  const sendMessage = async () => {
    if (!message.trim() || !selectedChat?.chatId) {
      alert('Thiếu nội dung hoặc không có chatId');
      return;
    }

    const msgData = {
      chatId: selectedChat.chatId,
      senderId: adminId,
      content: message
    };

    try {
      const res = await axios.post('http://localhost:3001/api/chats/message', msgData);
      const sentMsg = res.data.data;

      socketRef.current.emit('sendMessage', sentMsg); // Gửi qua socket
      setMessages(prev => [...prev, sentMsg]);
      setMessage('');
    } catch (err) {
      console.error('Gửi tin nhắn lỗi:', err);
      alert('Không gửi được tin nhắn!');
    }
  };

  return (
    <>
      <div className="chat-icon" onClick={() => setShowChat(!showChat)}>
        💬
      </div>

      {showChat && (
        <div className="chat-box">
          <div className="user-list">
            <h4>Người dùng:</h4>
            {chatList.map((chat) => (
              <div
                key={chat.chatId || chat.userId}
                className={`user-item ${selectedChat?.chatId === chat.chatId ? 'selected' : ''}`}
                onClick={() => setSelectedChat(chat)}
              >
                🧑 ID: {chat.userId.slice(-5)} <br />
                <small>{chat.lastMessage}</small>
              </div>
            ))}
          </div>

          {selectedChat && (
            <div className="chat-content">
              <div className="messages">
                {messages.map((msg) => (
                  <div
                    key={msg._id || `${msg.sender}-${Math.random()}`}
                    className={`message ${msg.sender === adminId ? 'admin' : 'user'}`}
                  >
                    {msg.content}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="input">
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Gửi</button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AdminChat;
