import React from 'react';
import '../styles/Home.css';

const Home = () => {
  // Dữ liệu cứng cho thống kê
  const stats = {
    totalProducts: 156,
    totalCategories: 8,
    totalOrders: 45,
    totalRevenue: 12500000
  };

  // Dữ liệu cứng cho đơn hàng gần đây
  const recentOrders = [
    {
      id: "ORD001",
      customer: "Nguyễn Văn A",
      products: "Áo thể thao Nike, Quần short Adidas",
      total: "1,250,000",
      status: "Đã giao"
    },
    {
      id: "ORD002",
      customer: "Trần Thị B",
      products: "Giày thể thao Puma",
      total: "2,500,000",
      status: "Đang giao"
    },
    {
      id: "ORD003",
      customer: "Lê Văn C",
      products: "Bóng đá, Vớ thể thao",
      total: "850,000",
      status: "Chờ xác nhận"
    },
    {
      id: "ORD004",
      customer: "Phạm Thị D",
      products: "Áo khoác thể thao",
      total: "1,800,000",
      status: "Đã giao"
    }
  ];

  return (
    <div className="home-container">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>Tổng sản phẩm</h3>
            <p>{stats.totalProducts}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏷️</div>
          <div className="stat-info">
            <h3>Danh mục</h3>
            <p>{stats.totalCategories}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-info">
            <h3>Đơn hàng</h3>
            <p>{stats.totalOrders}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Doanh thu</h3>
            <p>{stats.totalRevenue.toLocaleString('vi-VN')} VNĐ</p>
          </div>
        </div>
      </div>

      <div className="recent-orders">
        <h2>Đơn hàng gần đây</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Khách hàng</th>
                <th>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.products}</td>
                  <td>{order.total} VNĐ</td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home; 