import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSignOutAlt } from 'react-icons/fa';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const navigate = useNavigate();

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/login', {
        email,
        password
      });

      if (response.data.token) {
        // Lưu token và role vào localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        setIsLoggedIn(true);
        
        // Chuyển hướng dựa vào role
        if (response.data.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/home');
        }
      }
    } catch (err) {
      setError('Email hoặc mật khẩu không đúng');
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/api/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Xóa token và role khỏi localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setIsLoggedIn(false);
      setShowLogoutDialog(false);
      
      // Chuyển hướng về trang login
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Vẫn xóa token và chuyển hướng ngay cả khi API call thất bại
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setIsLoggedIn(false);
      setShowLogoutDialog(false);
      navigate('/login');
    }
  };

  return (
    <div className="login-container">
      {isLoggedIn && (
        <div className="logout-icon" onClick={() => setShowLogoutDialog(true)}>
          <FaSignOutAlt size={24} />
        </div>
      )}

      {showLogoutDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <h3>Xác nhận đăng xuất</h3>
            <p>Bạn có chắc chắn muốn đăng xuất?</p>
            <div className="dialog-buttons">
              <button onClick={handleLogout} className="btn-confirm">
                Xác nhận
              </button>
              <button onClick={() => setShowLogoutDialog(false)} className="btn-cancel">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="login-box">
        <h2>Đăng nhập</h2>
        {error && <div className="error-message">{error}</div>}
        {isLoggedIn ? (
          <div className="logout-section">
            <p>Bạn đã đăng nhập</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Mật khẩu:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Đăng nhập</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login; 