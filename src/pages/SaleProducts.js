import React, { useState, useEffect } from 'react';
import '../styles/SaleProducts.css';

const SaleProducts = () => {
  const [saleProducts, setSaleProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Mock data - replace with actual API calls
  const mockSaleProducts = [
    {
      "_id": "6868d2aaa5ff60d4b25d8077",
      "name": "Man City sân khách mùa giải 2024-2025",
      "price": 120000,
      "discount_percent": 20,
      "discount_price": 96000,
      "stock": 213,
      "description": "Chất vải thun lạnh thoáng mát, thoát mồ hôi tốt, Toàn thân in chuyển…",
      "image": "https://vicsport.vn/wp-content/uploads/2024/03/ao-da-banh-clb-man-city…",
      "size": ["M", "L", "XL"],
      "colors": ["Đen", "Trắng"],
      "categoryCode": "mancity",
      "isDiscount": true
    }
  ];

  useEffect(() => {
    fetchSaleProducts();
    // eslint-disable-next-line
  }, []);

  const fetchSaleProducts = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await fetch('/api/sale-products');
      // const data = await response.json();
      setSaleProducts(mockSaleProducts);
    } catch (error) {
      console.error('Error fetching sale products:', error);
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
        // Replace with actual API call
        // await fetch(`/api/sale-products/${productId}`, { method: 'DELETE' });
        setSaleProducts(saleProducts.filter(p => p._id !== productId));
        alert('Xóa sản phẩm thành công!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Có lỗi xảy ra khi xóa sản phẩm!');
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
        // await fetch(`/api/sale-products/${editingProduct._id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(productData)
        // });
        setSaleProducts(saleProducts.map(p => 
          p._id === editingProduct._id ? { ...productData, _id: p._id } : p
        ));
      } else {
        // Add new product
        // const response = await fetch('/api/sale-products', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(productData)
        // });
        // const newProduct = await response.json();
        const newProduct = { ...productData, _id: Date.now().toString() };
        setSaleProducts([...saleProducts, newProduct]);
      }
      
      setShowForm(false);
      setEditingProduct(null);
      e.target.reset();
      alert(editingProduct ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Có lỗi xảy ra khi lưu sản phẩm!');
    }
  };

  return (
    <div className="sale-products-container">
      <div className="sale-products-header">
        <h2>Quản lý sản phẩm giảm giá</h2>
        <button 
          className="add-product-btn"
          onClick={() => setShowForm(true)}
        >
          Thêm sản phẩm giảm giá
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

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="sale-products-grid">
          {saleProducts.map((product) => (
            <div key={product._id} className="sale-product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                <div className="discount-badge">
                  -{product.discount_percent}%
                </div>
              </div>
              
              <div className="product-info">
                <h3>{product.name}</h3>
                <div className="price-info">
                  <span className="original-price">
                    {product.price.toLocaleString('vi-VN')} VNĐ
                  </span>
                  <span className="discount-price">
                    {product.discount_price.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
                
                <div className="product-details">
                  <p><strong>Tồn kho:</strong> {product.stock}</p>
                  <p><strong>Kích thước:</strong> {product.size.join(', ')}</p>
                  <p><strong>Màu sắc:</strong> {product.colors.join(', ')}</p>
                  <p><strong>Danh mục:</strong> {product.categoryCode}</p>
                </div>
                
                <p className="description">{product.description}</p>
                
                <div className="product-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(product)}
                  >
                    Chỉnh sửa
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(product._id)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SaleProducts; 