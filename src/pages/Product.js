import React, { useState } from 'react';

const productsData = [
    { id: 1, name: 'Áo thể thao Nike', price: 1200000, size: 'M', image: 'https://example.com/nike.jpg', stock: 10, category: 'Áo' },
    { id: 2, name: 'Quần short Adidas', price: 800000, size: 'L', image: 'https://example.com/adidas.jpg', stock: 15, category: 'Quần' },
    { id: 3, name: 'Giày thể thao Puma', price: 2500000, size: '42', image: 'https://example.com/puma.jpg', stock: 8, category: 'Giày' },
    { id: 4, name: 'Bóng đá', price: 500000, size: '5', image: 'https://example.com/ball.jpg', stock: 20, category: 'Phụ kiện' },
];

const EditIcon = () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#fff" strokeWidth="2" d="M16.475 5.408l2.117-2.116a2 2 0 112.829 2.828l-2.116 2.117m-2.83-2.83l-9.193 9.192a2 2 0 00-.497.828l-1.06 3.182a1 1 0 001.265 1.265l3.182-1.06a2 2 0 00.828-.497l9.192-9.193m-2.83-2.83l2.83 2.83"/></svg>
);
const DeleteIcon = () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#fff" strokeWidth="2" d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z"/></svg>
);

const Product = () => {
    const [products, setProducts] = useState(productsData);
    const handleDelete = (id) => setProducts(products.filter(p => p.id !== id));
    return (
        <div>
            <h2>Quản lý sản phẩm</h2>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>ID</th><th>Tên sản phẩm</th><th>Giá</th><th>Size</th><th>Hình ảnh</th><th>Tồn kho</th><th>Danh mục</th><th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.price.toLocaleString('vi-VN')} VNĐ</td>
                            <td>{product.size}</td>
                            <td><img src={product.image} alt={product.name} style={{ width: '50px', height: '50px' }} /></td>
                            <td>{product.stock}</td>
                            <td>{product.category}</td>
                            <td>
                                <div className="action-buttons">
                                    <button className="btn btn-edit">Sửa</button>
                                    <button onClick={() => handleDelete(product.id)} className="btn btn-delete">Xóa</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Product; 