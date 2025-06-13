import React, { useState, useEffect } from 'react';
import { productAPI } from '../config/api';
import '../styles/Product.css';

const Product = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        stock: '',
        description: '',
        image: ''
    });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [errorDetail, setErrorDetail] = useState(null);

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    // Fetch all products
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productAPI.getAllProducts();
            setProducts(data);
            setError(null);
        } catch (err) {
            setError('Không thể tải danh sách sản phẩm');
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate
        if (!newProduct.name.trim() || !newProduct.image.trim()) {
            alert('Vui lòng nhập đầy đủ tên và link hình ảnh!');
            return;
        }
        try {
            // Chuyển đổi price và stock thành số
            const productData = {
                ...newProduct,
                price: Number(newProduct.price),
                stock: Number(newProduct.stock)
            };

            const response = await productAPI.createProduct(productData);
            setProducts([...products, response]);
            setShowAddForm(false);
            setNewProduct({
                name: '',
                price: '',
                stock: '',
                description: '',
                image: ''
            });
            alert('Thêm sản phẩm thành công!');
        } catch (err) {
            alert('Không thể thêm sản phẩm: ' + (err.message || 'Lỗi không xác định'));
            console.error('Error adding product:', err);
        }
    };

    // Delete product
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                await productAPI.deleteProduct(id);
                setProducts(products.filter(p => p._id !== id));
                alert('Xóa sản phẩm thành công!');
            } catch (err) {
                alert('Không thể xóa sản phẩm');
                console.error('Error deleting product:', err);
            }
        }
    };

    // Xem chi tiết sản phẩm
    const handleShowDetail = async (id) => {
        setShowDetail(true);
        setLoadingDetail(true);
        setErrorDetail(null);
        try {
            const detail = await productAPI.getProductById(id);
            setSelectedProduct(detail);
        } catch (err) {
            setErrorDetail('Không thể tải chi tiết sản phẩm');
            setSelectedProduct(null);
        } finally {
            setLoadingDetail(false);
        }
    };

    // Handle edit button click
    const handleEdit = (product) => {
        setEditingProduct(product);
        setNewProduct({
            name: product.name || '',
            price: product.price || '',
            stock: product.stock || '',
            description: product.description || '',
            image: product.image || ''
        });
        setShowEditForm(true);
    };

    // Handle update submit
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!newProduct.name.trim() || !newProduct.image.trim()) {
            alert('Vui lòng nhập đầy đủ tên và link hình ảnh!');
            return;
        }
        try {
            const productData = {
                ...newProduct,
                price: Number(newProduct.price),
                stock: Number(newProduct.stock)
            };

            const updatedProduct = await productAPI.updateProduct(editingProduct._id, productData);
            setProducts(products.map(p => p._id === editingProduct._id ? updatedProduct : p));
            setShowEditForm(false);
            setEditingProduct(null);
            setNewProduct({
                name: '',
                price: '',
                stock: '',
                description: '',
                image: ''
            });
            alert('Cập nhật sản phẩm thành công!');
        } catch (err) {
            alert('Không thể cập nhật sản phẩm: ' + (err.message || 'Lỗi không xác định'));
            console.error('Error updating product:', err);
        }
    };

    if (loading) return <div className="loading">Đang tải...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="product-container">
            <div className="product-header">
                <h2>Quản lý sản phẩm</h2>
                <button 
                    className="btn btn-add" 
                    onClick={() => setShowAddForm(true)}
                >
                    Thêm
                </button>
            </div>

            {showAddForm && (
                <div className="add-product-form">
                    <div className="form-overlay" onClick={() => setShowAddForm(false)}></div>
                    <form onSubmit={handleSubmit} className="form-content">
                        <h3>Thêm sản phẩm mới</h3>
                        <div className="form-group">
                            <label>Tên sản phẩm:</label>
                            <input
                                type="text"
                                name="name"
                                value={newProduct.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Giá:</label>
                            <input
                                type="number"
                                name="price"
                                value={newProduct.price}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Số lượng:</label>
                            <input
                                type="number"
                                name="stock"
                                value={newProduct.stock}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Mô tả:</label>
                            <textarea
                                name="description"
                                value={newProduct.description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Link hình ảnh:</label>
                            <input
                                type="url"
                                name="image"
                                value={newProduct.image}
                                onChange={handleInputChange}
                                required
                            />
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
                <div className="add-product-form">
                    <div className="form-overlay" onClick={() => setShowEditForm(false)}></div>
                    <form onSubmit={handleUpdate} className="form-content">
                        <h3>Sửa sản phẩm</h3>
                        <div className="form-group">
                            <label>Tên sản phẩm:</label>
                            <input
                                type="text"
                                name="name"
                                value={newProduct.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Giá:</label>
                            <input
                                type="number"
                                name="price"
                                value={newProduct.price}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Số lượng:</label>
                            <input
                                type="number"
                                name="stock"
                                value={newProduct.stock}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Mô tả:</label>
                            <textarea
                                name="description"
                                value={newProduct.description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Link hình ảnh:</label>
                            <input
                                type="url"
                                name="image"
                                value={newProduct.image}
                                onChange={handleInputChange}
                                required
                            />
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

            {/* Modal chi tiết sản phẩm */}
            {showDetail && (
                <div className="add-product-form">
                    <div className="form-overlay" onClick={() => setShowDetail(false)}></div>
                    <div className="form-content">
                        {loadingDetail ? (
                            <div className="loading">Đang tải chi tiết...</div>
                        ) : errorDetail ? (
                            <div className="error">{errorDetail}</div>
                        ) : selectedProduct ? (
                            <>
                                <h3>Chi tiết sản phẩm</h3>
                                <img
                                    src={selectedProduct.image || 'https://via.placeholder.com/120x120?text=No+Image'}
                                    alt={selectedProduct.name || 'No name'}
                                    style={{width: 120, height: 120, objectFit: 'cover', borderRadius: 8, margin: '0 auto 1rem'}}
                                />
                                <p><b>Tên:</b> {selectedProduct.name || 'Không có tên'}</p>
                                <p><b>Giá:</b> {typeof selectedProduct.price === 'number' ? selectedProduct.price.toLocaleString('vi-VN') + ' VNĐ' : 'N/A'}</p>
                                <p><b>Tồn kho:</b> {selectedProduct.stock ?? 'N/A'}</p>
                                <p><b>Mô tả:</b> {selectedProduct.description || 'Không có mô tả'}</p>
                                <button className="btn btn-cancel" onClick={() => setShowDetail(false)}>Đóng</button>
                            </>
                        ) : null}
                    </div>
                </div>
            )}

            <div className="table-responsive">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên sản phẩm</th>
                            <th>Giá</th>
                            <th>Hình ảnh</th>
                            <th>Tồn kho</th>
                            <th>Mô tả</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id} onClick={() => handleShowDetail(product._id)} style={{cursor: 'pointer'}}>
                                <td>{product._id}</td>
                                <td>{product.name ? product.name : 'Không có tên'}</td>
                                <td>
                                    {typeof product.price === 'number' && !isNaN(product.price)
                                        ? product.price.toLocaleString('vi-VN') + ' VNĐ'
                                        : 'N/A'}
                                </td>
                                <td>
                                    <img
                                        src={product.image ? product.image : 'https://via.placeholder.com/60x60?text=No+Image'}
                                        alt={product.name ? product.name : 'No name'}
                                        className="product-image"
                                        style={{ objectFit: 'cover' }}
                                    />
                                </td>
                                <td>{product.stock ?? 'N/A'}</td>
                                <td className="description-cell">{product.description || 'Không có mô tả'}</td>
                                <td>
                                    <div className="action-buttons" onClick={e => e.stopPropagation()}>
                                        <button
                                            className="btn btn-edit"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(product);
                                            }}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
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
        </div>
    );
};

export default Product; 