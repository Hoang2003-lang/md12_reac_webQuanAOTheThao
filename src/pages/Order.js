import React, { useState, useEffect } from 'react';
import { orderAPI } from '../config/api';
import '../styles/Order.css'; // Đảm bảo import file CSS

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeOrderId, setActiveOrderId] = useState(null); // State to track which dropdown is open
  const [modalOrder, setModalOrder] = useState(null); // order to show in modal
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(6);

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

  // const handleReturned = async (id) => {
  //   if (!id) return alert('Lỗi: ID đơn hàng không hợp lệ.');
  //   try {
  //     await orderAPI.updateOrderStatus(id, 'returned');
  //     setOrders(orders.map(o => o._id === id ? { ...o, status: 'returned' } : o));
  //     setActiveOrderId(null);
  //     alert('Đã chuyển sang trạng thái Đã trả hàng!');
  //   } catch (err) {
  //     alert('Không thể chuyển trạng thái: ' + (err.message || 'Lỗi không xác định'));
  //   }
  // };

  const toggleActions = (id) => {
    setActiveOrderId(prevId => (prevId === id ? null : id));
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
    switch (status) {
      case 'waiting':
        return 'Chờ xử lý';
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
    switch (status) {
      case 'waiting':
        return 'order-status-waiting';
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
        return 'order-status-waiting';
    }
  };

  // Helper function to get voucher discount amount
  const getVoucherDiscount = (order) => {
    if (order.voucher && order.voucher.discountAmount) {
      return order.voucher.discountAmount;
    }
    return 0;
  };

  // Add pagination calculations
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // Add pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
            <th>ID NGƯỜI DÙNG</th>
            <th>SẢN PHẨM</th>
            <th>SỐ LƯỢNG</th>
            <th>GIÁ</th>
            <th>PHÍ VẬN CHUYỂN</th>
            <th>GIẢM GIÁ</th>
            <th>THÀNH TIỀN</th>
            <th>ĐỊA CHỈ</th>
            <th>PHƯƠNG THỨC</th>
            <th>TRẠNG THÁI & THAO TÁC</th>
            <th>NGÀY ĐẶT</th>
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
            currentOrders.map(order => {
              const voucherDiscount = getVoucherDiscount(order);
              const firstItem = order.items && order.items[0] ? order.items[0] : {};
              return (
                <tr key={order._id}>
                  <td>
                    <button className="btn btn-detail" onClick={() => setModalOrder(order)}>
                      Xem chi tiết
                    </button>
                  </td>
                  <td>
                    {order.userId?._id
                      ? `${order.userId._id.substring(0, 3)}...${order.userId._id.slice(-4)}`
                      : order.userId
                        ? `${order.userId.substring(0, 3)}...${order.userId.slice(-4)}`
                        : ''
                    }
                  </td>
                  <td>{firstItem.name || ''}</td>
                  <td>{firstItem.purchaseQuantity || ''}</td>
                  <td>{firstItem.price ? firstItem.price.toLocaleString('vi-VN') + ' VNĐ' : ''}</td>
                  <td>{order.shippingFee ? order.shippingFee.toLocaleString('vi-VN') + ' VNĐ' : '0 VNĐ'}</td>
                  <td>{voucherDiscount ? voucherDiscount.toLocaleString('vi-VN') + ' VNĐ' : '0 VNĐ'}</td>
                  <td>{order.finalTotal ? order.finalTotal.toLocaleString('vi-VN') + ' VNĐ' : '0 VNĐ'}</td>
                  <td>{order.shippingAddress || ''}</td>
                  <td>{order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : order.paymentMethod || 'COD'}</td>
                  <td style={{ position: 'relative' }}>
                    {order.status === 'waiting' ? (
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
                    ) : order.status === 'pending' ? (
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
                        {/* {activeOrderId === order._id && (
                          <div className="order-action-dropdown">
                            <button className="btn btn-cancel" onClick={() => handleReturned(order._id)}>Chuyển sang Đã trả hàng</button>
                          </div>
                        )} */}
                      </div>
                    ) : (
                      <span className={`order-status-badge ${getStatusClass(order.status)}`}>
                        {getStatusDisplay(order.status)}
                      </span>
                    )}
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                </tr>
              );
            })
          )}
          <tr>
            <td colSpan={13} style={{ height: '40px', background: 'transparent' }}></td>
          </tr>
          <tr>
            <td colSpan={13} style={{ height: '40px', background: 'transparent' }}></td>
          </tr>
        </tbody>
      </table>

      {/* Add pagination controls */}
      <div className="pagination">
        <button
          className="btn btn-pagination"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Trước
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            className={`btn btn-pagination ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="btn btn-pagination"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Sau
        </button>
      </div>

      {/* Modal dialog for order detail */}
      {modalOrder && (
        <div className="order-modal-overlay" onClick={() => setModalOrder(null)}>
          <div className="order-modal" onClick={e => e.stopPropagation()}>
            <button className="order-modal-close" onClick={() => setModalOrder(null)}>&times;</button>
            <div className="order-detail-box left-align">
              <div><b>Mã đơn hàng:</b> {modalOrder._id || 'N/A'}</div>
              <div><b>Mã code:</b> {modalOrder.order_code || 'N/A'}</div>
              {modalOrder.userId && typeof modalOrder.userId === 'object' && (
                <>
                  <div><b>Tên người dùng:</b> {modalOrder.userId.name || ''}</div>
                  <div><b>Email:</b> {modalOrder.userId.email || ''}</div>
                </>
              )}
              <div><b>Địa chỉ:</b> {modalOrder.shippingAddress || 'Không có địa chỉ'}</div>
              <div><b>Thông tin sản phẩm:</b> {modalOrder.items && modalOrder.items.map((item, idx) => (
                <span key={item.productId || idx}>
                  {item.name} (SL: {item.purchaseQuantity}, Size: {item.size || 'N/A'}, Giá: {item.price ? item.price.toLocaleString('vi-VN') + ' VNĐ' : 'N/A'}){idx < modalOrder.items.length - 1 ? ', ' : ''}
                </span>
              ))}</div>
              {modalOrder.voucher && (
                <div><b>Mã giảm giá:</b> {modalOrder.voucher.code || 'N/A'} (Giảm: {modalOrder.voucher.discountAmount?.toLocaleString('vi-VN') || '0'} VNĐ)</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
