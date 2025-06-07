import React from 'react';

const Dashboard = () => {
  const stats = {
    totalProducts: 156,
    totalCategories: 8,
    totalOrders: 45,
    totalRevenue: 12500000
  };
  return (
    <div>
      <h2>Thống kê tổng quan</h2>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon">📦</div><div className="stat-info"><h3>Tổng sản phẩm</h3><p>{stats.totalProducts}</p></div></div>
        <div className="stat-card"><div className="stat-icon">🏷️</div><div className="stat-info"><h3>Danh mục</h3><p>{stats.totalCategories}</p></div></div>
        <div className="stat-card"><div className="stat-icon">🛒</div><div className="stat-info"><h3>Đơn hàng</h3><p>{stats.totalOrders}</p></div></div>
        <div className="stat-card"><div className="stat-icon">💰</div><div className="stat-info"><h3>Doanh thu</h3><p>{stats.totalRevenue.toLocaleString('vi-VN')} VNĐ</p></div></div>
      </div>
    </div>
  );
};

export default Dashboard; 