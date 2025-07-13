import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Voucher.css';

const Voucher = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState(null);
    const [newVoucher, setNewVoucher] = useState({
        code: '',
        description: '',
        discount_type: 'fixed', // 'fixed' hoặc 'shipping'
        discount_value: '',
        min_order_value: '',
        start_date: '',
        end_date: '',
        usage_limit: '',
        status: 'active'
    });
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [errorDetail, setErrorDetail] = useState(null);
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [vouchersPerPage] = useState(5);

    // Fetch vouchers on component mount
    useEffect(() => {
        fetchVouchers();
    }, []);

    // Fetch all vouchers
    const fetchVouchers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3001/api/vouchers');
            const vouchersData = response.data.data || [];
            setVouchers(vouchersData);
            setError(null);
        } catch (err) {
            setError('Không thể tải danh sách voucher');
            console.error('Error fetching vouchers:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewVoucher(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newVoucher.code.trim()) {
            alert('Vui lòng nhập mã voucher!');
            return;
        }
        try {
            const voucherData = {
                ...newVoucher,
                discount_value: Number(newVoucher.discount_value),
                min_order_value: Number(newVoucher.min_order_value),
                usage_limit: Number(newVoucher.usage_limit)
            };

            const response = await axios.post('http://localhost:3001/api/vouchers/add', voucherData);
            const newVoucherData = response.data.data;
            setVouchers(prevVouchers => [...prevVouchers, newVoucherData]);
            setShowAddForm(false);
            setNewVoucher({
                code: '',
                description: '',
                discount_type: 'fixed',
                discount_value: '',
                min_order_value: '',
                start_date: '',
                end_date: '',
                usage_limit: '',
                status: 'active'
            });
            alert('Thêm voucher thành công!');
        } catch (err) {
            alert('Không thể thêm voucher: ' + (err.response?.data?.message || 'Lỗi không xác định'));
            console.error('Error adding voucher:', err);
        }
    };

    // Delete voucher
    const handleDelete = async (code) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa voucher này?')) {
            try {
                await axios.delete(`http://localhost:3001/api/vouchers/${code}`);
                setVouchers(vouchers.filter(v => v.code !== code));
                alert('Xóa voucher thành công!');
            } catch (err) {
                alert('Không thể xóa voucher');
                console.error('Error deleting voucher:', err);
            }
        }
    };

    // View voucher details
    const handleShowDetail = async (code) => {
        setShowDetail(true);
        setLoadingDetail(true);
        setErrorDetail(null);
        try {
            const response = await axios.get(`http://localhost:3001/api/vouchers/${code}`);
            const voucherDetail = response.data.data;
            setSelectedVoucher(voucherDetail);
        } catch (err) {
            setErrorDetail('Không thể tải chi tiết voucher');
            setSelectedVoucher(null);
        } finally {
            setLoadingDetail(false);
        }
    };

    // Handle edit button click
    const handleEdit = (voucher) => {
        setEditingVoucher(voucher);
        setNewVoucher({
            code: voucher.code || '',
            description: voucher.description || '',
            discount_type: voucher.discount_type || 'fixed',
            discount_value: voucher.discount_value || '',
            min_order_value: voucher.min_order_value || '',
            start_date: voucher.start_date ? new Date(voucher.start_date).toISOString().split('T')[0] : '',
            end_date: voucher.end_date ? new Date(voucher.end_date).toISOString().split('T')[0] : '',
            usage_limit: voucher.usage_limit || '',
            status: voucher.status || 'active'
        });
        setShowEditForm(true);
    };

    // Handle update submit
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!newVoucher.code.trim()) {
            alert('Vui lòng nhập mã voucher!');
            return;
        }
        try {
            const voucherData = {
                ...newVoucher,
                discount_value: Number(newVoucher.discount_value),
                min_order_value: Number(newVoucher.min_order_value),
                usage_limit: Number(newVoucher.usage_limit)
            };

            const response = await axios.put(`http://localhost:3002/api/vouchers/${editingVoucher.code}`, voucherData);
            const updatedVoucherData = response.data.data;
            setVouchers(prevVouchers => 
                prevVouchers.map(v => v.code === editingVoucher.code ? updatedVoucherData : v)
            );
            setShowEditForm(false);
            setEditingVoucher(null);
            setNewVoucher({
                code: '',
                description: '',
                discount_type: 'fixed',
                discount_value: '',
                min_order_value: '',
                start_date: '',
                end_date: '',
                usage_limit: '',
                status: 'active'
            });
            alert('Cập nhật voucher thành công!');
        } catch (err) {
            alert('Không thể cập nhật voucher: ' + (err.response?.data?.message || 'Lỗi không xác định'));
            console.error('Error updating voucher:', err);
        }
    };

    // Pagination calculations
    const indexOfLastVoucher = currentPage * vouchersPerPage;
    const indexOfFirstVoucher = indexOfLastVoucher - vouchersPerPage;
    const currentVouchers = vouchers.slice(indexOfFirstVoucher, indexOfLastVoucher);
    const totalPages = Math.ceil(vouchers.length / vouchersPerPage);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) return <div className="loading">Đang tải...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="voucher-container">
            <div className="voucher-header">
                <h2>Quản lý voucher</h2>
                <button 
                    className="btn btn-add" 
                    onClick={() => setShowAddForm(true)}
                >
                    Thêm
                </button>
            </div>

            {showAddForm && (
                <div className="add-voucher-form">
                    <div className="form-overlay" onClick={() => setShowAddForm(false)}></div>
                    <form onSubmit={handleSubmit} className="form-content">
                        <h3>Thêm voucher mới</h3>
                        <div className="form-group">
                            <label>Mã voucher:</label>
                            <input
                                type="text"
                                name="code"
                                value={newVoucher.code}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Loại giảm giá:</label>
                            <select
                                name="discount_type"
                                value={newVoucher.discount_type}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="fixed">Giảm giá cố định</option>
                                <option value="shipping">Miễn phí vận chuyển</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Giá trị giảm giá:</label>
                            <input
                                type="number"
                                name="discount_value"
                                value={newVoucher.discount_value}
                                onChange={handleInputChange}
                                required
                                min="0"
                            />
                        </div>
                        <div className="form-group">
                            <label>Giá trị đơn hàng tối thiểu:</label>
                            <input
                                type="number"
                                name="min_order_value"
                                value={newVoucher.min_order_value}
                                onChange={handleInputChange}
                                required
                                min="0"
                            />
                        </div>
                        <div className="form-group">
                            <label>Giới hạn sử dụng:</label>
                            <input
                                type="number"
                                name="usage_limit"
                                value={newVoucher.usage_limit}
                                onChange={handleInputChange}
                                required
                                min="0"
                            />
                        </div>
                        <div className="form-group">
                            <label>Ngày bắt đầu:</label>
                            <input
                                type="date"
                                name="start_date"
                                value={newVoucher.start_date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Ngày kết thúc:</label>
                            <input
                                type="date"
                                name="end_date"
                                value={newVoucher.end_date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Mô tả:</label>
                            <textarea
                                name="description"
                                value={newVoucher.description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Trạng thái:</label>
                            <select
                                name="status"
                                value={newVoucher.status}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="active">Hoạt động</option>
                                <option value="inactive">Không hoạt động</option>
                            </select>
                        </div>
                        <div className="form-buttons">
                            <button type="submit" className="btn btn-submit">Lưu</button>
                            <button 
                                type="button" 
                                className="btn btn-cancel"
                                onClick={() => setShowAddForm(false)}
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {showEditForm && (
                <div className="add-voucher-form">
                    <div className="form-overlay" onClick={() => setShowEditForm(false)}></div>
                    <form onSubmit={handleUpdate} className="form-content">
                        <h3>Sửa voucher</h3>
                        <div className="form-group">
                            <label>Mã voucher:</label>
                            <input
                                type="text"
                                name="code"
                                value={newVoucher.code}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Loại giảm giá:</label>
                            <select
                                name="discount_type"
                                value={newVoucher.discount_type}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="fixed">Giảm giá cố định</option>
                                <option value="shipping">Miễn phí vận chuyển</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Giá trị giảm giá:</label>
                            <input
                                type="number"
                                name="discount_value"
                                value={newVoucher.discount_value}
                                onChange={handleInputChange}
                                required
                                min="0"
                            />
                        </div>
                        <div className="form-group">
                            <label>Giá trị đơn hàng tối thiểu:</label>
                            <input
                                type="number"
                                name="min_order_value"
                                value={newVoucher.min_order_value}
                                onChange={handleInputChange}
                                required
                                min="0"
                            />
                        </div>
                        <div className="form-group">
                            <label>Giới hạn sử dụng:</label>
                            <input
                                type="number"
                                name="usage_limit"
                                value={newVoucher.usage_limit}
                                onChange={handleInputChange}
                                required
                                min="0"
                            />
                        </div>
                        <div className="form-group">
                            <label>Ngày bắt đầu:</label>
                            <input
                                type="date"
                                name="start_date"
                                value={newVoucher.start_date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Ngày kết thúc:</label>
                            <input
                                type="date"
                                name="end_date"
                                value={newVoucher.end_date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Mô tả:</label>
                            <textarea
                                name="description"
                                value={newVoucher.description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Trạng thái:</label>
                            <select
                                name="status"
                                value={newVoucher.status}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="active">Hoạt động</option>
                                <option value="inactive">Không hoạt động</option>
                            </select>
                        </div>
                        <div className="form-buttons">
                            <button type="submit" className="btn btn-submit">Cập nhật</button>
                            <button 
                                type="button" 
                                className="btn btn-cancel"
                                onClick={() => setShowEditForm(false)}
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Modal chi tiết voucher */}
            {showDetail && (
                <div className="add-voucher-form">
                    <div className="form-overlay" onClick={() => setShowDetail(false)}></div>
                    <div className="form-content">
                        {loadingDetail ? (
                            <div className="loading">Đang tải chi tiết...</div>
                        ) : errorDetail ? (
                            <div className="error">{errorDetail}</div>
                        ) : selectedVoucher ? (
                            <>
                                <h3>Chi tiết voucher</h3>
                                <p><b>Mã voucher:</b> {selectedVoucher.code || 'N/A'}</p>
                                <p><b>Loại giảm giá:</b> {selectedVoucher.discount_type === 'fixed' ? 'Giảm giá cố định' : 'Miễn phí vận chuyển'}</p>
                                <p><b>Giá trị giảm giá:</b> {selectedVoucher.discount_value.toLocaleString('vi-VN')} VNĐ</p>
                                <p><b>Giá trị đơn hàng tối thiểu:</b> {selectedVoucher.min_order_value.toLocaleString('vi-VN')} VNĐ</p>
                                <p><b>Giới hạn sử dụng:</b> {selectedVoucher.usage_limit}</p>
                                <p><b>Đã sử dụng:</b> {selectedVoucher.used_count || 0}</p>
                                <p><b>Ngày bắt đầu:</b> {new Date(selectedVoucher.start_date).toLocaleDateString('vi-VN')}</p>
                                <p><b>Ngày kết thúc:</b> {new Date(selectedVoucher.end_date).toLocaleDateString('vi-VN')}</p>
                                <p><b>Mô tả:</b> {selectedVoucher.description || 'Không có mô tả'}</p>
                                <p><b>Trạng thái:</b> {selectedVoucher.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}</p>
                                <button className="btn btn-cancel" onClick={() => setShowDetail(false)}>Đóng</button>
                            </>
                        ) : null}
                    </div>
                </div>
            )}

            <div className="table-responsive">
                <table className="voucher-table">
                    <thead>
                        <tr>
                            <th>Mã voucher</th>
                            <th>Loại giảm giá</th>
                            <th>Giá trị giảm</th>
                            <th>Giá trị tối thiểu</th>
                            <th>Đã sử dụng</th>
                            <th>Ngày bắt đầu</th>
                            <th>Ngày kết thúc</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentVouchers.map(voucher => (
                            <tr key={voucher.code} onClick={() => handleShowDetail(voucher.code)} style={{cursor: 'pointer'}}>
                                <td>{voucher.code}</td>
                                <td>{voucher.discount_type === 'fixed' ? 'Giảm giá cố định' : 'Miễn phí vận chuyển'}</td>
                                <td>{voucher.discount_value.toLocaleString('vi-VN')} VNĐ</td>
                                <td>{voucher.min_order_value.toLocaleString('vi-VN')} VNĐ</td>
                                <td>{voucher.used_count || 0}/{voucher.usage_limit}</td>
                                <td>{new Date(voucher.start_date).toLocaleDateString('vi-VN')}</td>
                                <td>{new Date(voucher.end_date).toLocaleDateString('vi-VN')}</td>
                                <td>
                                    <span className={`status ${voucher.status === 'active' ? 'active' : 'inactive'}`}>
                                        {voucher.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons" onClick={e => e.stopPropagation()}>
                                        <button
                                            className="btn btn-edit"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(voucher);
                                            }}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(voucher.code)}
                                            className="btn btn-delete"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination controls */}
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
        </div>
    );
};

export default Voucher;
