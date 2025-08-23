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
        sold: '',
        description: '',
        images: [''],
        size: ['S', 'M', 'L', 'XL'],
        colors: ['Đen', 'Trắng'],
        categoryCode: ''
    });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [errorDetail, setErrorDetail] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(5);

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

    // Handle images change
    const handleImagesChange = (index, value) => {
        setNewProduct(prev => {
            const newImages = [...prev.images];
            newImages[index] = value;
            return {
                ...prev,
                images: newImages
            };
        });
    };

    // Add new image field
    const addImageField = () => {
        setNewProduct(prev => ({
            ...prev,
            images: [...prev.images, '']
        }));
    };

    // Remove image field
    const removeImageField = (index) => {
        setNewProduct(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    // Handle size change
    const handleSizeChange = (e) => {
        const { value, checked } = e.target;
        setNewProduct(prev => {
            let newSizes = [...prev.size];
            if (checked) {
                if (!newSizes.includes(value)) {
                    newSizes.push(value);
                }
            } else {
                newSizes = newSizes.filter(size => size !== value);
            }
            return {
                ...prev,
                size: newSizes
            };
        });
    };

    // Handle color change
    const handleColorChange = (e) => {
        const { value, checked } = e.target;
        setNewProduct(prev => {
            let newColors = [...prev.colors];
            if (checked) {
                if (!newColors.includes(value)) {
                    newColors.push(value);
                }
            } else {
                newColors = newColors.filter(color => color !== value);
            }
            return {
                ...prev,
                colors: newColors
            };
        });
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate
        if (!newProduct.name.trim()) {
            alert('Vui lòng nhập tên sản phẩm!');
            return;
        }
        if (newProduct.images.length === 0 || newProduct.images.every(img => !img.trim())) {
            alert('Vui lòng nhập ít nhất một link hình ảnh!');
            return;
        }
        if (newProduct.size.length === 0) {
            alert('Vui lòng chọn ít nhất một size!');
            return;
        }
        if (newProduct.colors.length === 0) {
            alert('Vui lòng chọn ít nhất một màu!');
            return;
        }
        try {
            // Filter out empty image URLs
            const filteredImages = newProduct.images.filter(img => img.trim() !== '');
            
            // Chuyển đổi price, stock và sold thành số
            const productData = {
                ...newProduct,
                price: Number(newProduct.price),
                stock: Number(newProduct.stock),
                sold: Number(newProduct.sold || 0),
                images: filteredImages
            };

            await productAPI.createProduct(productData);
            fetchProducts();
            setShowAddForm(false);
            setNewProduct({
                name: '',
                price: '',
                stock: '',
                sold: '',
                description: '',
                images: [''],
                size: ['S', 'M', 'L', 'XL'],
                colors: ['Đen', 'Trắng'],
                categoryCode: ''
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
            const res = await productAPI.getProductById(id);
            setSelectedProduct(res.data || res);
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
            sold: product.sold || '',
            description: product.description || '',
            images: product.images && product.images.length > 0 ? product.images : [''],
            size: product.size || ['S', 'M', 'L', 'XL'],
            colors: product.colors || ['Đen', 'Trắng'],
            categoryCode: product.categoryCode || ''
        });
        setShowEditForm(true);
    };

    // Handle update submit
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!newProduct.name.trim()) {
            alert('Vui lòng nhập tên sản phẩm!');
            return;
        }
        if (newProduct.images.length === 0 || newProduct.images.every(img => !img.trim())) {
            alert('Vui lòng nhập ít nhất một link hình ảnh!');
            return;
        }
        if (newProduct.size.length === 0) {
            alert('Vui lòng chọn ít nhất một size!');
            return;
        }
        if (newProduct.colors.length === 0) {
            alert('Vui lòng chọn ít nhất một màu!');
            return;
        }
        try {
            // Filter out empty image URLs
            const filteredImages = newProduct.images.filter(img => img.trim() !== '');
            
            const productData = {
                ...newProduct,
                price: Number(newProduct.price),
                stock: Number(newProduct.stock),
                sold: Number(newProduct.sold || 0),
                images: filteredImages
            };

            await productAPI.updateProduct(editingProduct._id, productData);

            // ✅ Gọi lại API để load lại danh sách sản phẩm
            await fetchProducts();

            setShowEditForm(false);
            setEditingProduct(null);
            setNewProduct({
                name: '',
                price: '',
                stock: '',
                sold: '',
                description: '',
                images: [''],
                size: ['S', 'M', 'L', 'XL'],
                colors: ['Đen', 'Trắng'],
                categoryCode: ''
            });
            alert('Cập nhật sản phẩm thành công!');
        } catch (err) {
            alert('Không thể cập nhật sản phẩm: ' + (err.message || 'Lỗi không xác định'));
            console.error('Error updating product:', err);
        }
    };

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'N/A';
        }
    };

    // Add pagination calculations
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

    // Add pagination handlers
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
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
                            <label>Đã bán:</label>
                            <input
                                type="number"
                                name="sold"
                                value={newProduct.sold}
                                onChange={handleInputChange}
                                placeholder="0"
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
                            {newProduct.images.map((image, index) => (
                                <div key={index} className="image-input-group">
                                    <input
                                        type="url"
                                        value={image}
                                        onChange={(e) => handleImagesChange(index, e.target.value)}
                                        placeholder={`Link hình ảnh ${index + 1}`}
                                        required={index === 0}
                                    />
                                    {newProduct.images.length > 1 && (
                                        <button
                                            type="button"
                                            className="btn btn-remove"
                                            onClick={() => removeImageField(index)}
                                        >
                                            Xóa
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                className="btn btn-add-image"
                                onClick={addImageField}
                            >
                                + Thêm hình ảnh
                            </button>
                        </div>
                        <div className="form-group">
                            <label>Mã danh mục:</label>
                            <input
                                type="text"
                                name="categoryCode"
                                value={newProduct.categoryCode}
                                onChange={handleInputChange}
                                placeholder="VD: chelsea, japan, vietnam, etc."
                            />
                        </div>
                        <div className="form-group">
                            <label>Size có sẵn:</label>
                            <div className="size-checkboxes">
                                {['S', 'M', 'L', 'XL'].map(size => (
                                    <label key={size} className="size-checkbox">
                                        <input
                                            type="checkbox"
                                            value={size}
                                            checked={newProduct.size.includes(size)}
                                            onChange={handleSizeChange}
                                        />
                                        <span>{size}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Màu sắc có sẵn:</label>
                            <div className="color-checkboxes">
                                {['Đen', 'Trắng', 'Đỏ', 'Xanh', 'Vàng'].map(color => (
                                    <label key={color} className="color-checkbox">
                                        <input
                                            type="checkbox"
                                            value={color}
                                            checked={newProduct.colors.includes(color)}
                                            onChange={handleColorChange}
                                        />
                                        <span>{color}</span>
                                    </label>
                                ))}
                            </div>
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
                            <label>Đã bán:</label>
                            <input
                                type="number"
                                name="sold"
                                value={newProduct.sold}
                                onChange={handleInputChange}
                                placeholder="0"
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
                            {newProduct.images.map((image, index) => (
                                <div key={index} className="image-input-group">
                                    <input
                                        type="url"
                                        value={image}
                                        onChange={(e) => handleImagesChange(index, e.target.value)}
                                        placeholder={`Link hình ảnh ${index + 1}`}
                                        required={index === 0}
                                    />
                                    {newProduct.images.length > 1 && (
                                        <button
                                            type="button"
                                            className="btn btn-remove"
                                            onClick={() => removeImageField(index)}
                                        >
                                            Xóa
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                className="btn btn-add-image"
                                onClick={addImageField}
                            >
                                + Thêm hình ảnh
                            </button>
                        </div>
                        <div className="form-group">
                            <label>Mã danh mục:</label>
                            <input
                                type="text"
                                name="categoryCode"
                                value={newProduct.categoryCode}
                                onChange={handleInputChange}
                                placeholder="VD: chelsea, japan, vietnam, etc."
                            />
                        </div>
                        <div className="form-group">
                            <label>Size có sẵn:</label>
                            <div className="size-checkboxes">
                                {['S', 'M', 'L', 'XL'].map(size => (
                                    <label key={size} className="size-checkbox">
                                        <input
                                            type="checkbox"
                                            value={size}
                                            checked={newProduct.size.includes(size)}
                                            onChange={handleSizeChange}
                                        />
                                        <span>{size}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Màu sắc có sẵn:</label>
                            <div className="color-checkboxes">
                                {['Đen', 'Trắng', 'Đỏ', 'Xanh', 'Vàng'].map(color => (
                                    <label key={color} className="color-checkbox">
                                        <input
                                            type="checkbox"
                                            value={color}
                                            checked={newProduct.colors.includes(color)}
                                            onChange={handleColorChange}
                                        />
                                        <span>{color}</span>
                                    </label>
                                ))}
                            </div>
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
                                <div className="product-images">
                                    {selectedProduct.images && selectedProduct.images.length > 0 ? (
                                        selectedProduct.images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image || 'https://via.placeholder.com/120x120?text=No+Image'}
                                                alt={`${selectedProduct.name || 'Product'} ${index + 1}`}
                                                style={{ 
                                                    width: 120, 
                                                    height: 120, 
                                                    objectFit: 'contain', 
                                                    borderRadius: 8, 
                                                    margin: '0.5rem', 
                                                    background: '#fff',
                                                    border: '1px solid #ddd'
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <img
                                            src="https://via.placeholder.com/120x120?text=No+Image"
                                            alt="No product image available"
                                            style={{ 
                                                width: 120, 
                                                height: 120, 
                                                objectFit: 'contain', 
                                                borderRadius: 8, 
                                                margin: '0 auto 1rem', 
                                                background: '#fff',
                                                display: 'block',
                                                border: '1px solid #ddd'
                                            }}
                                        />
                                    )}
                                </div>
                                <p><b>Tên:</b> {selectedProduct.name || 'Không có tên'}</p>
                                <p><b>Giá:</b> {typeof selectedProduct.price === 'number' ? selectedProduct.price.toLocaleString('vi-VN') + ' VNĐ' : 'N/A'}</p>
                                <p><b>Tồn kho:</b> {selectedProduct.stock ?? 'N/A'}</p>
                                <p><b>Đã bán:</b> {selectedProduct.sold ?? '0'}</p>
                                <p><b>Mã danh mục:</b> {selectedProduct.categoryCode || 'N/A'}</p>
                                <p><b>Size có sẵn:</b> {selectedProduct.size && selectedProduct.size.length > 0 ? selectedProduct.size.join(', ') : 'N/A'}</p>
                                <p><b>Màu sắc có sẵn:</b> {selectedProduct.colors && selectedProduct.colors.length > 0 ? selectedProduct.colors.join(', ') : 'N/A'}</p>
                                <p><b>Mô tả:</b> {selectedProduct.description || 'Không có mô tả'}</p>
                                <p><b>Ngày cập nhật:</b> {formatDate(selectedProduct.updatedAt)}</p>
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
                            <th>Đã bán</th>
                            <th>Mã danh mục</th>
                            <th>Size</th>
                            <th>Màu sắc</th>
                            <th>Mô tả</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map(product => (
                            <tr key={product._id} onClick={() => handleShowDetail(product._id)} style={{ cursor: 'pointer' }}>
                                <td>
                                    {product._id
                                        ? `${product._id.slice(0, 1)}...${product._id.slice(-4)}`
                                        : ''}
                                </td>
                                <td>{product.name ? product.name : 'Không có tên'}</td>
                                <td>
                                    {typeof product.price === 'number' && !isNaN(product.price)
                                        ? product.price.toLocaleString('vi-VN') + ' VNĐ'
                                        : 'N/A'}
                                </td>
                                <td>
                                    <div className="product-image">
                                        <img
                                            src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/60x60?text=No+Image'}
                                            alt={product.name ? product.name : 'No name'}
                                        />
                                        {product.images && product.images.length > 1 && (
                                            <span className="image-count">+{product.images.length - 1}</span>
                                        )}
                                    </div>
                                </td>
                                <td>{product.stock ?? 'N/A'}</td>
                                <td>{product.sold ?? '0'}</td>
                                <td>{product.categoryCode || 'N/A'}</td>
                                <td>{product.size && product.size.length > 0 ? product.size.join(', ') : 'N/A'}</td>
                                <td>{product.colors && product.colors.length > 0 ? product.colors.join(', ') : 'N/A'}</td>
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
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(product._id);
                                            }}
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
        </div>
    );
};

export default Product; 