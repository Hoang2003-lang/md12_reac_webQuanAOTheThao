import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { authAPI } from '../config/api';
import '../styles/LogoutButton.css';

const LogoutButton = () => {
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      // ignore error, still remove token
    }
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setShowDialog(false);
    navigate('/login');
  };

  // Chỉ hiển thị nếu đã đăng nhập
  if (!localStorage.getItem('token')) return null;

  return (
    <>
      <div className="logout-btn-fixed" onClick={() => setShowDialog(true)}>
        <FaSignOutAlt size={24} />
      </div>
      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <h3>Xác nhận đăng xuất</h3>
            <p>Bạn có chắc chắn muốn đăng xuất?</p>
            <div className="dialog-buttons">
              <button onClick={handleLogout} className="btn-confirm">Xác nhận</button>
              <button onClick={() => setShowDialog(false)} className="btn-cancel">Hủy</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutButton; 