import React, { useState, useEffect } from 'react';
import { orderAPI } from '../config/api';
import '../styles/Order.css'; // Đảm bảo import file CSS

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeOrderId, setActiveOrderId] = useState(null); // State to track which dropdown is open
  const [detailOrderId, setDetailOrderId] = useState(null); // State to track which order's detail is open

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

  const handleShipped = async (id) => {
    if (!id) return alert('Lỗi: ID đơn hàng không hợp lệ.');
    try {
      await orderAPI.updateOrderStatus(id, 'shipped');
      setOrders(orders.map(o => o._id === id ? { ...o, status: 'shipped' } : o));
      setActiveOrderId(null);
      alert('Đã chuyển sang trạng thái Đã giao hàng!');
    } catch (err) {
      alert('Không thể chuyển trạng thái: ' + (err.message || 'Lỗi không xác định'));
    }
  };

  const handleDelivered = async (id) => {
    if (!id) return alert('Lỗi: ID đơn hàng không hợp lệ.');
    try {
      await orderAPI.updateOrderStatus(id, 'delivered');
      setOrders(orders.map(o => o._id === id ? { ...o, status: 'delivered' } : o));
      setActiveOrderId(null);
      alert('Đã chuyển sang trạng thái Đã nhận hàng!');
    } catch (err) {
      alert('Không thể chuyển trạng thái: ' + (err.message || 'Lỗi không xác định'));
    }
  };

  const handleReturned = async (id) => {
    if (!id) return alert('Lỗi: ID đơn hàng không hợp lệ.');
    try {
      await orderAPI.updateOrderStatus(id, 'returned');
      setOrders(orders.map(o => o._id === id ? { ...o, status: 'returned' } : o));
      setActiveOrderId(null);
      alert('Đã chuyển sang trạng thái Đã trả hàng!');
    } catch (err) {
      alert('Không thể chuyển trạng thái: ' + (err.message || 'Lỗi không xác định'));
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
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      case 'shipped':
        return 'Đã giao hàng';
      case 'delivered':
        return 'Đã nhận hàng';
      case 'returned':
        return 'Đã trả hàng';
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
      case 'returned':
        return 'order-status-returned';
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
            <th></th>
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
              <td colSpan={9} style={{ textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
                Không có đơn hàng nào
              </td>
            </tr>
          ) : (
            orders.map(order => {
              const showDetail = detailOrderId === order._id;
              return (
                <React.Fragment key={order._id}>
                  <tr>
                    <td>
                      <button className="btn btn-detail" onClick={() => setDetailOrderId(showDetail ? null : order._id)}>
                        {showDetail ? 'Ẩn' : 'Xem chi tiết'}
                      </button>
                    </td>
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
                      ) : order.status === 'confirmed' ? (
                        <div className="order-status-action-wrap">
                          <button
                            className={`order-status-badge ${getStatusClass(order.status)}`}
                            onClick={() => toggleActions(order._id)}
                          >
                            {getStatusDisplay(order.status)}
                          </button>
                          {activeOrderId === order._id && (
                            <div className="order-action-dropdown">
                              <button className="btn btn-confirm" onClick={() => handleShipped(order._id)}>Chuyển sang Đã giao hàng</button>
                            </div>
                          )}
                        </div>
                      ) : order.status === 'shipped' ? (
                        <div className="order-status-action-wrap">
                          <button
                            className={`order-status-badge ${getStatusClass(order.status)}`}
                            onClick={() => toggleActions(order._id)}
                          >
                            {getStatusDisplay(order.status)}
                          </button>
                          {activeOrderId === order._id && (
                            <div className="order-action-dropdown">
                              <button className="btn btn-confirm" onClick={() => handleDelivered(order._id)}>Chuyển sang Đã nhận hàng</button>
                              <button className="btn btn-cancel" onClick={() => handleReturned(order._id)}>Chuyển sang Đã trả hàng</button>
                            </div>
                          )}
                        </div>
                      ) : order.status === 'delivered' ? (
                        <div className="order-status-action-wrap">
                          <button
                            className={`order-status-badge ${getStatusClass(order.status)}`}
                            onClick={() => toggleActions(order._id)}
                          >
                            {getStatusDisplay(order.status)}
                          </button>
                          {activeOrderId === order._id && (
                            <div className="order-action-dropdown">
                              <button className="btn btn-cancel" onClick={() => handleReturned(order._id)}>Chuyển sang Đã trả hàng</button>
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
                  {showDetail && (
                    <tr className="order-detail-row">
                      <td colSpan={9}>
                        <div className="order-detail-box">
                          <div><b>Mã đơn hàng:</b> {order._id || 'N/A'}</div>
                          <div><b>Tên người đặt:</b> {order.id_user?.name || 'Không có tên'}</div>
                          <div><b>Email:</b> {order.id_user?.email || 'Không có email'}</div>
                          <div><b>Địa chỉ:</b> {order.shippingAddress || 'Không có địa chỉ'}</div>
                          <div><b>Thông tin sản phẩm:</b> {formatProducts(order.items)}</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          )}
          <tr>
            <td colSpan={9} style={{ height: '40px', background: 'transparent' }}></td>
          </tr>
          <tr>
            <td colSpan={10} style={{ height: '40px', background: 'transparent' }}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Order;
