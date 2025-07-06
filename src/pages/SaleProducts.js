import React, { useState, useEffect } from 'react';
import { saleProductAPI } from '../config/api';
import '../styles/SaleProducts.css';

const SaleProducts = () => {
  const [saleProducts, setSaleProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    fetchSaleProducts();
    // eslint-disable-next-line
  }, []);

  const fetchSaleProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await saleProductAPI.getAllSaleProducts();
      setSaleProducts(data);
    } catch (error) {
      console.error('Error fetching sale products:', error);
      setError(error.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await saleProductAPI.deleteSaleProduct(productId);
        setSaleProducts(saleProducts.filter(p => p._id !== productId));
        alert('Xóa sản phẩm thành công!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert(error.message || 'Có lỗi xảy ra khi xóa sản phẩm!');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = {
      name: formData.get('name'),
      price: parseInt(formData.get('price')),
      discount_percent: parseInt(formData.get('discount_percent')),
      discount_price: parseInt(formData.get('discount_price')),
      stock: parseInt(formData.get('stock')),
      description: formData.get('description'),
      image: formData.get('image'),
      size: formData.get('size').split(',').map(s => s.trim()),
      colors: formData.get('colors').split(',').map(c => c.trim()),
      categoryCode: formData.get('categoryCode'),
      isDiscount: true
    };

    try {
      if (editingProduct) {
        // Update existing product
        await saleProductAPI.updateSaleProduct(editingProduct._id, productData);
        setSaleProducts(saleProducts.map(p => 
          p._id === editingProduct._id ? { ...productData, _id: p._id } : p
        ));
      } else {
        // Add new product
        const newProduct = await saleProductAPI.createSaleProduct(productData);
        setSaleProducts([...saleProducts, newProduct]);
      }
      
      setShowForm(false);
      setEditingProduct(null);
      e.target.reset();
      alert(editingProduct ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!');
    } catch (error) {
      console.error('Error saving product:', error);
      alert(error.message || 'Có lỗi xảy ra khi lưu sản phẩm!');
    }
  };

  const handleToggleDiscountStatus = async (productId, currentStatus) => {
    try {
      await saleProductAPI.updateDiscountStatus(productId, !currentStatus);
      setSaleProducts(saleProducts.map(p => 
        p._id === productId ? { ...p, isDiscount: !currentStatus } : p
      ));
      alert('Cập nhật trạng thái giảm giá thành công!');
    } catch (error) {
      console.error('Error updating discount status:', error);
      alert(error.message || 'Có lỗi xảy ra khi cập nhật trạng thái!');
    }
  };

  const handleShowDetail = (product) => {
    setSelectedProduct(product);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedProduct(null);
  };

  if (error) {
    return (
      <div className="sale-products-container">
        <div className="error-message" style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#ff6b6b', 
          fontSize: '16px' 
        }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="sale-products-container">
      <div className="sale-products-header">
        <h2>Quản lý sản phẩm giảm giá</h2>
        <button 
          className="add-product-btn"
          onClick={() => setShowForm(true)}
        >
          Thêm sản phẩm
        </button>
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h3>{editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên sản phẩm:</label>
                <input 
                  type="text" 
                  name="name" 
                  defaultValue={editingProduct?.name || ''}
                  required 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Giá gốc (VNĐ):</label>
                  <input 
                    type="number" 
                    name="price" 
                    defaultValue={editingProduct?.price || ''}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Phần trăm giảm giá (%):</label>
                  <input 
                    type="number" 
                    name="discount_percent" 
                    min="0" 
                    max="100"
                    defaultValue={editingProduct?.discount_percent || ''}
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Giá sau giảm (VNĐ):</label>
                  <input 
                    type="number" 
                    name="discount_price" 
                    defaultValue={editingProduct?.discount_price || ''}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Số lượng tồn kho:</label>
                  <input 
                    type="number" 
                    name="stock" 
                    defaultValue={editingProduct?.stock || ''}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Mô tả:</label>
                <textarea 
                  name="description" 
                  defaultValue={editingProduct?.description || ''}
                  required 
                />
              </div>

              <div className="form-group">
                <label>Hình ảnh (URL):</label>
                <input 
                  type="url" 
                  name="image" 
                  defaultValue={editingProduct?.image || ''}
                  required 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Kích thước (phân cách bằng dấu phẩy):</label>
                  <input 
                    type="text" 
                    name="size" 
                    defaultValue={editingProduct?.size?.join(', ') || ''}
                    placeholder="M, L, XL"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Màu sắc (phân cách bằng dấu phẩy):</label>
                  <input 
                    type="text" 
                    name="colors" 
                    defaultValue={editingProduct?.colors?.join(', ') || ''}
                    placeholder="Đen, Trắng"
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Mã danh mục:</label>
                <input 
                  type="text" 
                  name="categoryCode" 
                  defaultValue={editingProduct?.categoryCode || ''}
                  required 
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingProduct ? 'Cập nhật' : 'Thêm'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                  }}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetail && selectedProduct && (
        <div className="detail-overlay" onClick={handleCloseDetail}>
          <div className="detail-modal" onClick={e => e.stopPropagation()}>
            <button className="close-detail-btn" onClick={handleCloseDetail}>&times;</button>
            <div className="detail-img-wrap">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="detail-img" />
            </div>
            <div className="detail-info">
              <h2>{selectedProduct.name}</h2>
              <div className="detail-row">
                <span className="original-price">{selectedProduct.price.toLocaleString('vi-VN')} VNĐ</span>
                <span className="discount-price">{selectedProduct.discount_price.toLocaleString('vi-VN')} VNĐ</span>
                <span className="detail-discount">-{selectedProduct.discount_percent}%</span>
              </div>
              <div className="detail-row"><b>Tồn kho:</b> {selectedProduct.stock}</div>
              <div className="detail-row"><b>Kích thước:</b> {selectedProduct.size.join(', ')}</div>
              <div className="detail-row"><b>Màu sắc:</b> {selectedProduct.colors.join(', ')}</div>
              <div className="detail-row"><b>Danh mục:</b> {selectedProduct.categoryCode}</div>
              <div className="detail-row">
                <b>Trạng thái:</b>
                <span className={`status-indicator ${selectedProduct.isDiscount ? 'status-active' : 'status-inactive'}`}
                  style={{marginLeft: 8}}>
                  <span className="status-icon">{selectedProduct.isDiscount ? '✔' : '✖'}</span>
                  {selectedProduct.isDiscount ? 'Đang giảm giá' : 'Không giảm giá'}
                </span>
              </div>
              <div className="detail-desc">
                <b>Mô tả:</b>
                <div>{selectedProduct.description}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : saleProducts.length === 0 ? (
        <div className="empty-state">
          <h3>Chưa có sản phẩm giảm giá</h3>
          <p>Bắt đầu bằng cách thêm sản phẩm giảm giá đầu tiên</p>
          <button 
            className="add-product-btn"
            onClick={() => setShowForm(true)}
          >
            Thêm sản phẩm
          </button>
        </div>
      ) : (
        <div className="sale-products-table-wrapper">
          <table className="sale-products-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Giá gốc</th>
                <th>Giá giảm</th>
                <th>% Giảm</th>
                <th>Tồn kho</th>
                <th>Kích thước</th>
                <th>Màu sắc</th>
                <th>Danh mục</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {saleProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img src={product.image} alt={product.name} className="table-product-img" onClick={() => handleShowDetail(product)} style={{cursor: 'pointer'}} />
                  </td>
                  <td>{product.name}</td>
                  <td><span className="original-price">{product.price.toLocaleString('vi-VN')} VNĐ</span></td>
                  <td><span className="discount-price">{product.discount_price.toLocaleString('vi-VN')} VNĐ</span></td>
                  <td>-{product.discount_percent}%</td>
                  <td>{product.stock}</td>
                  <td>{product.size.join(', ')}</td>
                  <td>{product.colors.join(', ')}</td>
                  <td>{product.categoryCode}</td>
                  <td>
                    <span className={`status-indicator ${product.isDiscount ? 'status-active' : 'status-inactive'}`}>
                      <span className="status-icon">
                        {product.isDiscount ? '✔' : '✖'}
                      </span>
                      {product.isDiscount ? 'Đang giảm giá' : 'Không giảm giá'}
                    </span>
                  </td>
                  <td className="action-cell">
                    <div className="action-group">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEdit(product)}
                      >
                        Sửa
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(product._id)}
                      >
                        Xóa
                      </button>
                      <button 
                        className={`discount-toggle-btn ${product.isDiscount ? 'active' : 'inactive'}`}
                        onClick={() => handleToggleDiscountStatus(product._id, product.isDiscount)}
                      >
                        {product.isDiscount ? 'Tắt giảm giá' : 'Bật giảm giá'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SaleProducts; 