import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { authAPI } from '../config/api';
import logoF7 from '../assets/logoF7.png';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const navigate = useNavigate();

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.login({
        email,
        password
      });

      if (response.token) {
        // Lưu token và role vào localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        setIsLoggedIn(true);
        
        // Chuyển hướng dựa vào role
        if (response.role === 'admin') {
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
      await authAPI.logout();
      
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
        <div className="left-panel">
          <div className="logo-container">
            <img src={logoF7} alt="F7 SHOP" className="logo" />
          </div>
          <div className="welcome-text">
            <h2>Hello, Welcome Admin!</h2>
            {/* <p>Don't have an account?</p>
            <button className="register-btn">Register</button> */}
          </div>
        </div>
        
        <div className="right-panel">
          <div className="login-form">
            <h2>Login</h2>
            {error && <div className="error-message">{error}</div>}
            {isLoggedIn ? (
              <div className="logout-section">
                <p>Bạn đã đăng nhập</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <div className="input-container">
                    <input
                      type="text"
                      placeholder="Username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <div className="input-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <div className="forgot-password">
                  <button type="button" className="forgot-link">Forgot Password?</button>
                </div>
                <button type="submit" className="login-btn">Login</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 