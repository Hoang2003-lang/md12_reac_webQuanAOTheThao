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

  // Kết nối socket
  useEffect(() => {
    socketRef.current = io('http://localhost:3001');

    socketRef.current.on('connect', () => {
      console.log('🔌 Kết nối socket thành công');
    });

    socketRef.current.on('new message', (msg) => {
      if (msg.chatId === currentChatIdRef.current) {
        setMessages(prev => [...prev, msg.message]);
      } 
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

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
              userName: otherUser?.name,
              userAvatar: otherUser?.avatar,
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

    // currentChatIdRef.current = selectedChat.chatId;

    const chatId = selectedChat.chatId;
    currentChatIdRef.current = chatId;
    socketRef.current.emit('join chat', chatId);

    axios.get(`http://localhost:3001/api/chats/${selectedChat.chatId}`)
      .then(res => {
        setMessages(res.data.data.messages || []);
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

    const msgData = {
      chatId: selectedChat.chatId,
      senderId: adminId,
      content: message
    };

    try {
      // await axios.post('http://localhost:3001/api/chats/message', msgData);

      const sentMsg = {
        sender: adminId,
        senderId: adminId,
        content: message,
        type: 'text',
        timestamp: new Date(),
        isRead: false,
        chatId: selectedChat.chatId
      };

      socketRef.current.emit('send message', msgData);

      // setMessages(prev => [...prev, sentMsg]);
      setMessage('');
    } catch (err) {
      console.error('❌ Gửi tin nhắn lỗi:', err);
      alert('Không gửi được tin nhắn!');
    }
  };

  return (
    <>
      <div className="chat-icon" onClick={() => setShowChat(!showChat)}>
        💬
      </div>

      {showChat && (
        <>
          {!selectedChat ? (
            <div className="chat-box">
              <div className="user-list">
                <h4>Người dùng:</h4>
                {chatList.map((chat) => (
                  <div
                    key={chat.chatId}
                    className="user-item"
                    onClick={() => setSelectedChat(chat)}
                  >
                    <img src={chat.userAvatar} alt={chat.userName} className="avatar" />
                    <div>
                      <strong>{chat.userName}</strong> <br />
                      <small>{chat.lastMessage}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="chat-box">
              <div className="user-list">
                <h4>Người dùng:</h4>
                {chatList.map((chat) => (
                  <div
                    key={chat.chatId}
                    className={`user-item ${selectedChat?.chatId === chat.chatId ? 'selected' : ''}`}
                    onClick={() => setSelectedChat(chat)}
                  >
                    <img src={chat.userAvatar} alt={chat.userName} className="avatar" />
                    <div>
                      <strong>{chat.userName}</strong> <br />
                      <small>{chat.lastMessage}</small>
                    </div>
                  </div>
                ))}
              </div>

              <div className="chat-content">
                <div className="chat-header">
                  <button onClick={() => setSelectedChat(null)}>⬅ Quay lại</button>
                  <h4>{selectedChat.userName}</h4>
                </div>

                <div className="messages">
                  {messages.map((msg, index) => (
                    <div
                      key={msg._id || `${msg.sender}-${index}`}
                      className={`message ${(typeof msg.sender === 'string' ? msg.sender : msg.sender?._id) === adminId
                        ? 'admin'
                        : 'user'
                        }`}
                    >
                      <div className="message-content">{msg.content}</div>
                      <div className="message-time">
                        {new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
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
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AdminChat;