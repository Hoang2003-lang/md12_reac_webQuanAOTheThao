import React, { useState, useEffect } from 'react';
import { productAPI } from '../config/api';
import '../styles/Product.css';

const Product = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <div className="loading">Đang tải...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="product-container">
            <h2>Quản lý sản phẩm</h2>
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
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>{product.price.toLocaleString('vi-VN')} VNĐ</td>
                                <td>
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        className="product-image"
                                    />
                                </td>
                                <td>{product.stock}</td>
                                <td className="description-cell">{product.description}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button 
                                            className="btn btn-edit"
                                            onClick={() => {/* TODO: Implement edit */}}
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