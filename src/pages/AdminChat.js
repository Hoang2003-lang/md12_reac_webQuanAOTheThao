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
    socketRef.current = io('http://192.168.10.105:3001');

    socketRef.current.on('connect', () => {
      console.log('🔌 Kết nối socket thành công');

    });


    socketRef.current.on('new message', (msg) => {
      // if (msg.senderId === adminId) return;
      // if (msg.chatId === currentChatIdRef.current) {
      //   setMessages(prev => [...prev, msg]);
      // }

    //   setMessages(prev => {
    //     // const exists = prev.some(m => m._id === msg._id);
    //     // return exists ? prev : [...prev, msg];
    //     const exists = prev.some(m =>
    //   m.content === msg.content &&
    //   m.senderId === msg.senderId &&
    //   m.chatId === msg.chatId &&
    //   new Date(m.timestamp).getTime() === new Date(msg.timestamp).getTime()
    // );

    // // Nếu đã có 1 tin tương tự mà là local (tức vừa gửi xong), thì bỏ qua socket để tránh lặp
    // const isDuplicateLocal = prev.some(m =>
    //   m._local &&
    //   m.content === msg.content &&
    //   m.senderId === msg.senderId &&
    //   m.chatId === msg.chatId
    // );

    // if (exists || isDuplicateLocal) return prev;

    // return [...prev, msg];
    //   });

      setMessages(prev => {
    // Nếu đã tồn tại bản giống hệt (có _id), bỏ qua
    const exists = prev.some(m => m._id === msg._id);

    // Nếu đã có bản local giống nội dung và sender → thay bằng bản có _id
    const localIndex = prev.findIndex(m =>
      m._local &&
      m.content === msg.content &&
      m.senderId === msg.senderId &&
      m.chatId === msg.chatId
    );

    if (exists) return prev;

    if (localIndex !== -1) {
      const newMessages = [...prev];
      newMessages[localIndex] = { ...msg, _local: false };
      return newMessages;
    }

    return [...prev, msg];
  });

      
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Lấy danh sách chat
  useEffect(() => {
    axios.get('http://192.168.10.105:3001/api/chats')
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

    currentChatIdRef.current = selectedChat.chatId;


    currentChatIdRef.current = selectedChat.chatId;
    socketRef.current.emit('join chat', selectedChat.chatId);
    console.log('✅ Admin joined room:', selectedChat.chatId);

    axios.get(`http://192.168.10.105:3001/api/chats/${selectedChat.chatId}`)
      .then(res => {
        // setMessages(res.data.data.messages || []);
        const rawMessages = res.data.data.messages || [];

    const normalized = rawMessages.map(msg => ({
      ...msg,
      senderId: msg.senderId || msg.sender?._id || msg.sender || '', // THÊM DÒNG NÀY
    }));

    setMessages(normalized);
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
    // const sentMsg = {
    //     senderId: adminId,
    //     content: message,
    //     // type: 'text',
    //     timestamp: new Date(),
    //     isRead: false,
    //     chatId: selectedChat.chatId,
    //     _local: true,
    //   };

    try {
      // await axios.post('http://192.168.10.102:3001/api/chats/message', msgData);

      
      // setMessages(prev => [...prev, sentMsg]);
      socketRef.current.emit('send message', msgData);


      
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

          {selectedChat && (
            <div className="chat-content">
              <div className="messages">
                {messages.map((msg, index) => (
                  <div
                    key={msg._id || `${msg.senderId}-${index}`}
                    className={`message ${msg.senderId === adminId ? 'admin' : 'user'}`}
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
          )}
        </div>
      )}
    </>
  );
};

export default AdminChat;