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
  const [chatError, setChatError] = useState(null);
  const messagesEndRef = useRef(null);
  const currentChatIdRef = useRef(null);
  const socketRef = useRef(null);

  const adminId = '683e9c91e2aa5ca0fbfb1030'; // ID của admin

  // Kết nối socket
  useEffect(() => {
    socketRef.current = io('http://localhost:3002');

    socketRef.current.on('connect', () => {
      console.log('Kết nối socket thành công');
    });

    socketRef.current.on('new message', (msg) => {
      if (msg.chatId === currentChatIdRef.current) {
        // Chỉ thêm tin nhắn mới nếu không phải tin nhắn của chính mình
        const isOwnMessage = msg.message.sender === adminId || msg.message.senderId === adminId;
        if (!isOwnMessage) {
          setMessages(prev => [...prev, msg.message]);
        }
      }
    });

    // thả icon
    socketRef.current.on('reaction updated', ({ messageId, userId, emoji }) => {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === messageId
            ? {
              ...msg,
              reactions: [
                ...(msg.reactions || []).filter(r => r.user !== userId),
                { user: userId, emoji }
              ]
            }
            : msg
        )
      );
    });

    // thu hồi tin nhắn
    socketRef.current.on('message deleted', ({ messageId }) => {
      setMessages(prev => prev.filter(msg => msg._id !== messageId));
    });

    // xoá đoạn chat
    socketRef.current.on('chat messages cleared', ({ chatId }) => {
      if (chatId === currentChatIdRef.current) {
        setMessages([]);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Lấy danh sách chat
  const fetchChatList = async () => {
    try {
      setChatError(null); // Reset error
      const response = await axios.get('http://localhost:3002/api/chats');
      const chats = response.data.data;

      const filteredChats = chats
        .filter(chat => chat.participants.some(p => p._id === adminId))
        .map(chat => {
          const otherUser = chat.participants.find(p => p._id !== adminId);
          return {
            chatId: chat._id,
            userId: otherUser?._id,
            userName: otherUser?.name || 'Unknown User',
            userAvatar: otherUser?.avatar || 'https://via.placeholder.com/40',
            lastMessage: chat.lastMessage?.content || 'Chưa có tin nhắn',
          };
        });

      setChatList(filteredChats);
    } catch (err) {
      console.error('Lỗi load danh sách chat:', err);
      // Hiển thị thông báo lỗi cho user
      if (err.response?.status === 500) {
        console.error('Backend error - User model not registered');
        setChatError('Lỗi kết nối backend. Vui lòng thử lại sau.');
        setChatList([]); // Set empty array để tránh crash
      } else {
        setChatError('Không thể tải danh sách chat');
      }
    }
  };

  useEffect(() => {
    fetchChatList();
  }, []);

  // Refresh chat list khi có tin nhắn mới
  useEffect(() => {
    socketRef.current?.on('new message', () => {
      fetchChatList();
    });
  }, []);

  // Lấy tin nhắn khi chọn chat
  useEffect(() => {
    if (!selectedChat) return;

    const chatId = selectedChat.chatId;
    currentChatIdRef.current = chatId;
    socketRef.current.emit('join chat', chatId);

    axios.get(`http://localhost:3002/api/chats/${chatId}`)
      .then(res => {
        setMessages(res.data.data.messages || []);
      })
      .catch(err => console.error('Lỗi load tin nhắn:', err));
  }, [selectedChat]);

  // Auto scroll xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Kiểm tra đăng nhập - đặt ở cuối để không vi phạm React Hooks rules
  const isLoggedIn = localStorage.getItem('token');
  if (!isLoggedIn) return null;

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
      // Gửi tin nhắn qua API
      // const response = await axios.post('http://localhost:3002/api/chats/message', msgData);

      // Tạo tin nhắn mới để hiển thị ngay lập tức
      // const sentMsg = {
      //   _id: response.data.data._id,
      //   sender: adminId,
      //   senderId: adminId,
      //   content: message,
      //   type: 'text',
      //   timestamp: new Date(),
      //   isRead: false,
      //   chatId: selectedChat.chatId
      // };

      // Cập nhật UI ngay lập tức
      // setMessages(prev => [...prev, sentMsg]);

      // Gửi qua socket để thông báo cho user khác
      socketRef.current.emit('send message', msgData);

      setMessage('');
    } catch (err) {
      console.error('Gửi tin nhắn lỗi:', err);
      alert('Không gửi được tin nhắn!');
    }
  };

  const handleRightClick = (e, msg) => {
    e.preventDefault();
    // const isAdmin = msg.sender === adminId;
    const isAdmin = (typeof msg.sender === 'string' ? msg.sender : msg.sender?._id) === adminId;

    // const choice = window.prompt('Phản ứng: 1 👍, 2 ❤️, 3 😂, 4 Thu hồi');
    let promptText = 'Chọn cảm xúc: 1 👍, 2 ❤️, 3 😂';
    if (isAdmin) {
      promptText += ', 4 Thu hồi';
    }
    const choice = window.prompt(promptText);

    if (choice === '1') reactToMessage(msg._id, '👍');
    if (choice === '2') reactToMessage(msg._id, '❤️');
    if (choice === '3') reactToMessage(msg._id, '😂');
    if (choice === '4' && isAdmin) deleteMessage(msg._id);
  };

  const reactToMessage = async (messageId, emoji) => {
    try {
      // Gọi API để cập nhật reaction
      await axios.post(`http://localhost:3002/api/chats/message/${messageId}/reaction`, {
        userId: adminId,
        emoji: emoji
      });

      // Gửi qua socket để thông báo real-time
      socketRef.current.emit('reaction message', {
        chatId: selectedChat.chatId,
        messageId,
        userId: adminId,
        emoji
      });
    } catch (err) {
      console.error('Lỗi reaction:', err);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      // Gọi API để xóa tin nhắn
      await axios.delete(`http://localhost:3002/api/chats/message/${messageId}`);

      // Gửi qua socket để thông báo real-time
      socketRef.current.emit('delete message', {
        chatId: selectedChat.chatId,
        messageId
      });
    } catch (err) {
      console.error('Lỗi xóa tin nhắn:', err);
    }
  };

  const handleDeleteChat = async () => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn xoá toàn bộ đoạn chat?');
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:3002/api/chats/${selectedChat.chatId}`);

      // Xoá khỏi danh sách hiển thị
      setChatList(prev => prev.filter(c => c.chatId !== selectedChat.chatId));

      // Xoá UI hiện tại
      setSelectedChat(null);
      setMessages([]);
    } catch (err) {
      console.error('Lỗi xoá đoạn chat:', err);
      alert('Không thể xoá đoạn chat');
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
                {chatError ? (
                  <div className="chat-error">
                    <p>{chatError}</p>
                    <button onClick={fetchChatList} className="retry-btn">
                      Thử lại
                    </button>
                  </div>
                ) : (
                  chatList.map((chat) => (
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
                  ))
                )}
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
                  <button onClick={handleDeleteChat} className="btn-danger">🗑️ Xoá</button>
                </div>

                <div className="messages">
                  {messages.map((msg, index) => (
                    <div
                      key={msg._id || `${msg.sender}-${index}`}
                      className={`message ${(typeof msg.sender === 'string' ? msg.sender : msg.sender?._id) === adminId
                        ? 'admin'
                        : 'user'
                        }`}
                      onContextMenu={(e) => handleRightClick(e, msg)} // sự kiện
                    >
                      <div className="message-content">
                        {msg.content}

                        {msg.reactions?.length > 0 && (
                          <div className="reactions">
                            {msg.reactions.map((r, i) => (
                              <span key={i}>{r.emoji}</span>
                            ))}
                          </div>
                        )}
                      </div>
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