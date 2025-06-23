import React, { useState, useEffect } from 'react';
import { orderAPI } from '../config/api';
import '../styles/Order.css'; // Đảm bảo import file CSS

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeOrderId, setActiveOrderId] = useState(null); // State to track which dropdown is open

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderAPI.getAllOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách đơn hàng');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id) => {
    if (!id) {
        alert('Lỗi: ID đơn hàng không hợp lệ.');
        return;
    }
    try {
      await orderAPI.updateOrderStatus(id, 'confirmed');
      setOrders(orders.map(o => o._id === id ? { ...o, status: 'confirmed' } : o));
      setActiveOrderId(null); // Close dropdown
      alert('Đã xác nhận đơn hàng thành công!');
    } catch (err) {
      alert('Không thể xác nhận đơn hàng: ' + (err.message || 'Lỗi không xác định'));
      console.error('Error confirming order:', err);
    }
  };

  const handleCancel = async (id) => {
    if (!id) {
        alert('Lỗi: ID đơn hàng không hợp lệ.');
        return;
    }
    try {
      await orderAPI.updateOrderStatus(id, 'cancelled');
      setOrders(orders.map(o => o._id === id ? { ...o, status: 'cancelled' } : o));
      setActiveOrderId(null); // Close dropdown
      alert('Đã hủy đơn hàng thành công!');
    } catch (err) {
      alert('Không thể hủy đơn hàng: ' + (err.message || 'Lỗi không xác định'));
      console.error('Error cancelling order:', err);
    }
  };

  const toggleActions = (id) => {
    setActiveOrderId(prevId => (prevId === id ? null : id));
  };

  // Helper function to format products list
  const formatProducts = (items) => {
    if (!items || !Array.isArray(items)) return 'Không có sản phẩm';
    return items.map(item => 
      `${item.name || 'Sản phẩm không tên'} (SL: ${item.purchaseQuantity || 1})`
    ).join(', ');
  };

  // Helper function to calculate total
  const calculateTotal = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.purchaseQuantity || 1;
      return total + (price * quantity);
    }, 0);
  };

  // Helper function to format date
  const formatDate = (dateField) => {
    if (!dateField) return 'N/A';
    
    let date;
    if (dateField.$date) {
      // MongoDB date format
      date = new Date(dateField.$date);
    } else if (typeof dateField === 'string') {
      // ISO string format
      date = new Date(dateField);
    } else {
      // Direct Date object
      date = new Date(dateField);
    }
    
    return date.toLocaleDateString('vi-VN');
  };

  // Helper function to get status display text
  const getStatusDisplay = (status) => {
    switch(status) {
      case 'pending':
        return 'Đang chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      case 'shipped':
        return 'Đã giao hàng';
      case 'delivered':
        return 'Đã nhận hàng';
      default:
        return status || 'Không xác định';
    }
  };

  // Helper function to get status class
  const getStatusClass = (status) => {
    switch(status) {
      case 'pending':
        return 'order-status-pending';
      case 'confirmed':
        return 'order-status-confirmed';
      case 'cancelled':
        return 'order-status-cancelled';
      case 'shipped':
        return 'order-status-shipped';
      case 'delivered':
        return 'order-status-delivered';
      default:
        return 'order-status-pending';
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="order-container">
      <h2>Quản lý đơn hàng</h2>
      <table className="order-table">
        <thead>
          <tr>
            <th>Mã đơn hàng</th>
            <th>Tên người đặt</th>
            <th>Email</th>
            <th>Địa chỉ</th>
            <th>Thông tin sản phẩm</th>
            <th>Tổng tiền</th>
            <th>Phí vận chuyển</th>
            <th>Giảm giá</th>
            <th>Thành tiền</th>
            <th>Phương thức thanh toán</th>
            <th>Ngày đặt</th>
            <th>Trạng thái & Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={12} style={{ textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
                Không có đơn hàng nào
              </td>
            </tr>
          ) : (
            orders.map(order => {
              return (
                <tr key={order._id}>
                  <td>{order._id || 'N/A'}</td>
                  <td>{order.id_user?.name || 'Không có tên'}</td>
                  <td>{order.id_user?.email || 'Không có email'}</td>
                  <td>{order.shippingAddress || 'Không có địa chỉ'}</td>
                  <td>{formatProducts(order.items)}</td>
                  <td>{order.totalPrice ? order.totalPrice.toLocaleString('vi-VN') : calculateTotal(order.items).toLocaleString('vi-VN')} VNĐ</td>
                  <td>{order.shippingFee ? order.shippingFee.toLocaleString('vi-VN') : '0'} VNĐ</td>
                  <td>{order.discount ? order.discount.toLocaleString('vi-VN') : '0'} VNĐ</td>
                  <td>{order.finalTotal ? order.finalTotal.toLocaleString('vi-VN') : '0'} VNĐ</td>
                  <td>{order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : order.paymentMethod || 'COD'}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td style={{ position: 'relative' }}>
                    {order.status === 'pending' ? (
                      <div className="order-status-action-wrap">
                        <button
                          className={`order-status-badge ${getStatusClass(order.status)}`}
                          onClick={() => toggleActions(order._id)}
                        >
                          {getStatusDisplay(order.status)}
                        </button>
                        {activeOrderId === order._id && (
                          <div className="order-action-dropdown">
                            <button className="btn btn-confirm" onClick={() => handleConfirm(order._id)}>Xác nhận đơn hàng</button>
                            <button className="btn btn-cancel" onClick={() => handleCancel(order._id)}>Hủy đơn</button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className={`order-status-badge ${getStatusClass(order.status)}`}>
                        {getStatusDisplay(order.status)}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
          {/* Dòng trống cuối bảng */}
          <tr>
            <td colSpan={12} style={{ height: '40px', background: 'transparent' }}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Order;
