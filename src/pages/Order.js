import React, { useState } from 'react';
import '../styles/Order.css'; // Đảm bảo import file CSS

const ordersData = [
  {
    id: 'ORD001',
    customer: 'Nguyễn Văn A',
    address: '123 Lê Lợi, Q.1, TP.HCM',
    products: 'Áo thể thao Nike, Quần short Adidas',
    total: 1250000,
    status: 'Chờ xác nhận'
  },
  {
    id: 'ORD002',
    customer: 'Trần Thị B',
    address: '45 Nguyễn Huệ, Q.1, TP.HCM',
    products: 'Giày thể thao Puma',
    total: 2500000,
    status: 'Đã xác nhận'
  },
  {
    id: 'ORD003',
    customer: 'Lê Văn C',
    address: '12 Trần Hưng Đạo, Q.5, TP.HCM',
    products: 'Bóng đá, Vớ thể thao',
    total: 850000,
    status: 'Chờ xác nhận'
  },
  {
    id: 'ORD004',
    customer: 'Phạm Thị D',
    address: '88 Lý Thường Kiệt, Q.10, TP.HCM',
    products: 'Áo khoác thể thao',
    total: 1800000,
    status: 'Đã hủy'
  },
  {
    id: 'ORD005',
    customer: 'Lê Văn C',
    address: '12 Trần Hưng Đạo, Q.6, TP.HCM',
    products: 'Bóng đá, Vớ thể thao',
    total: 850000,
    status: 'Chờ xác nhận'
  }
];

const Order = () => {
  const [orders, setOrders] = useState(ordersData);
  const [showActions, setShowActions] = useState({});

  const handleConfirm = (id) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'Đã xác nhận' } : o));
    setShowActions(prev => ({ ...prev, [id]: false }));
  };

  const handleCancel = (id) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'Đã hủy' } : o));
    setShowActions(prev => ({ ...prev, [id]: false }));
  };

  const toggleActions = (id) => {
    setShowActions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="order-container">
      <h2>Quản lý đơn hàng</h2>
      <table className="order-table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Tên người đặt</th>
            <th>Địa chỉ</th>
            <th>Thông tin sản phẩm</th>
            <th>Tổng tiền</th>
            <th>Trạng thái & Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.address}</td>
                <td>{order.products}</td>
                <td>{order.total.toLocaleString('vi-VN')} VNĐ</td>
                <td style={{ position: 'relative' }}>
                  {order.status === 'Chờ xác nhận' ? (
                    <div className="order-status-action-wrap">
                      <button
                        className="order-status-badge order-status-pending"
                        onClick={() => toggleActions(order.id)}
                      >
                        Đang chờ xác nhận
                      </button>
                      {showActions[order.id] && (
                        <div className="order-action-dropdown">
                          <button className="btn btn-confirm" onClick={() => handleConfirm(order.id)}>Xác nhận đơn hàng</button>
                          <button className="btn btn-cancel" onClick={() => handleCancel(order.id)}>Hủy đơn</button>
                        </div>
                      )}
                    </div>
                  ) : order.status === 'Đã xác nhận' ? (
                    <span className="order-status-badge order-status-confirmed">Đã xác nhận</span>
                  ) : (
                    <span className="order-status-badge order-status-cancelled">Đã hủy</span>
                  )}
                </td>
              </tr>
            ))
          )}
          {/* Dòng trống cuối bảng */}
          <tr>
            <td colSpan={6} style={{ height: '40px', background: 'transparent' }}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Order;
