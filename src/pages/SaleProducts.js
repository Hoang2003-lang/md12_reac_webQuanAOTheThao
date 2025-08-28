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
  const [newSaleProduct, setNewSaleProduct] = useState({
    name: '',
    price: 0,
    discount_percent: 0,
    discount_price: 0,
    stock: 0,
    sold: 0,
    description: '',
    images: [''], // 👈 mảng để nhập nhiều ảnh
    size: [],
    colors: [],
    categoryCode: '',
    isDiscount: true
  });

  useEffect(() => {
    fetchSaleProducts();
    // eslint-disable-next-line
  }, []);

  const fetchSaleProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await saleProductAPI.getAllSaleProducts();
      // Ensure all products have required fields with default values
      const formattedData = data.map(product => ({
        ...product,
        price: product.price || 0,
        discount_price: product.discount_price || 0,
        discount_percent: product.discount_percent || 0,
        stock: product.stock || 0,
        sold: product.sold || 0,
        size: Array.isArray(product.size) ? product.size : [],
        colors: Array.isArray(product.colors) ? product.colors : [],
        images: Array.isArray(product.images) ? product.images : [],
        isDiscount: product.isDiscount !== undefined ? product.isDiscount : true
      }));
      setSaleProducts(formattedData);
    } catch (error) {
      console.error('Error fetching sale products:', error);
      setError(error.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };


  const handleSaleImagesChange = (index, value) => {
    setNewSaleProduct(prev => {
      const newImages = [...prev.images];
      newImages[index] = value;
      return { ...prev, images: newImages };
    });
  };

  const addSaleImageField = () => {
    setNewSaleProduct(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeSaleImageField = (index) => {
    setNewSaleProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  // const handleEdit = (product) => {
  //   setEditingProduct(product);
  //   setShowForm(true);
  // };
  const handleEdit = (product) => {
    setEditingProduct(product);
    setNewSaleProduct({
      ...product,
      images: Array.isArray(product.images) && product.images.length > 0 ? product.images : ['']
    });
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

    // Debug: Log all form data
    console.log('Form data entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    // Validate required fields
    const name = formData.get('name')?.trim();
    const price = parseInt(formData.get('price'));
    const discountPercent = parseInt(formData.get('discount_percent'));
    const stock = parseInt(formData.get('stock'));
    const sold = parseInt(formData.get('sold'));
    const description = formData.get('description')?.trim();
    const validImages = newSaleProduct.images.filter(img => img.trim() !== '');
    const size = formData.get('size')?.trim();
    const colors = formData.get('colors')?.trim();
    const categoryCode = formData.get('categoryCode')?.trim();

    // Debug: Log individual field values
    console.log('Field values:', {
      name, price, discountPercent, stock, sold, description, validImages, size, colors, categoryCode
    });

    // Check for required fields with specific error messages
    const missingFields = [];
    if (!name) missingFields.push('Tên sản phẩm');
    if (!price) missingFields.push('Giá gốc');
    if (!discountPercent) missingFields.push('Phần trăm giảm giá');
    if (!stock) missingFields.push('Số lượng tồn kho');
    if (!description) missingFields.push('Mô tả');
    if (!validImages) missingFields.push('Hình ảnh');
    if (!size) missingFields.push('Kích thước');
    if (!colors) missingFields.push('Màu sắc');
    if (!categoryCode) missingFields.push('Mã danh mục');

    if (missingFields.length > 0) {
      // Highlight empty fields
      missingFields.forEach(field => {
        const fieldName = field.toLowerCase().replace(/\s+/g, '');
        const input = document.querySelector(`input[name="${fieldName}"], textarea[name="${fieldName}"]`);
        if (input) {
          input.style.borderColor = '#ff6b6b';
          input.style.backgroundColor = '#fff5f5';
        }
      });

      alert(`Vui lòng nhập đầy đủ thông tin: ${missingFields.join(', ')}`);
      return;
    }

    // Validate numeric fields
    if (price <= 0 || discountPercent < 0 || discountPercent > 100 || stock < 0 || sold < 0) {
      alert('Vui lòng kiểm tra lại các giá trị số');
      return;
    }

    const discountPrice = Math.round(price * (1 - discountPercent / 100));


    const productData = {
      name,
      price,
      discount_percent: discountPercent,
      stock,
      sold: sold ?? 0,
      description,
      images: validImages, // 👈 lấy nhiều ảnh
      size: size.split(',').map(s => s.trim()).filter(Boolean),
      colors: colors.split(',').map(c => c.trim()).filter(Boolean),
      categoryCode,
      isDiscount: true
    };


    try {
      console.log('Sending product data:', productData);

      if (editingProduct) {
        // Update existing product
        const updatedProduct = await saleProductAPI.updateSaleProduct(editingProduct._id, productData);
        setSaleProducts(saleProducts.map(p =>
          p._id === editingProduct._id ? {
            ...updatedProduct,
            price: updatedProduct.price || 0,
            discount_price: updatedProduct.discount_price || 0,
            discount_percent: updatedProduct.discount_percent || 0,
            stock: updatedProduct.stock || 0,
            sold: updatedProduct.sold || 0,
            size: Array.isArray(updatedProduct.size) ? updatedProduct.size : [],
            colors: Array.isArray(updatedProduct.colors) ? updatedProduct.colors : [],
            images: Array.isArray(updatedProduct.images) ? updatedProduct.images : []
          } : p
        ));
      } else {
        // Add new product
        const newProduct = await saleProductAPI.createSaleProduct(productData);
        setSaleProducts([...saleProducts, {
          ...newProduct,
          price: newProduct.price || 0,
          discount_price: newProduct.discount_price || 0,
          discount_percent: newProduct.discount_percent || 0,
          stock: newProduct.stock || 0,
          sold: newProduct.sold || 0,
          size: Array.isArray(newProduct.size) ? newProduct.size : [],
          colors: Array.isArray(newProduct.colors) ? newProduct.colors : [],
          images: Array.isArray(newProduct.images) ? newProduct.images : []
        }]);
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

  const handleUpdateSoldCount = async (productId, currentSold) => {
    const newSoldCount = prompt('Nhập số lượng đã bán mới:', currentSold);
    if (newSoldCount !== null && !isNaN(newSoldCount)) {
      try {
        await saleProductAPI.updateSoldCount(productId, parseInt(newSoldCount));
        setSaleProducts(saleProducts.map(p =>
          p._id === productId ? { ...p, sold: parseInt(newSoldCount) } : p
        ));
        alert('Cập nhật số lượng đã bán thành công!');
      } catch (error) {
        console.error('Error updating sold count:', error);
        alert(error.message || 'Có lỗi xảy ra khi cập nhật số lượng đã bán!');
      }
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

  // Auto-calculate discount price when price or discount percent changes
  const handlePriceChange = (e) => {
    const price = parseInt(e.target.value) || 0;
    const discountPercent = parseInt(document.querySelector('input[name="discount_percent"]').value) || 0;
    const discountPrice = Math.round(price * (1 - discountPercent / 100));
    document.querySelector('input[name="discount_price"]').value = discountPrice;
  };

  const handleDiscountPercentChange = (e) => {
    const price = parseInt(document.querySelector('input[name="price"]').value) || 0;
    const discountPercent = parseInt(e.target.value) || 0;
    const discountPrice = Math.round(price * (1 - discountPercent / 100));
    document.querySelector('input[name="discount_price"]').value = discountPrice;
  };

  const clearFieldError = (e) => {
    e.target.style.borderColor = '';
    e.target.style.backgroundColor = '';
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
        {/* <button
          className="add-product-btn"
          onClick={() => setShowForm(true)}
        >
          Thêm sản phẩm
        </button> */}
        <button
          className="add-product-btn"
          onClick={() => {
            setEditingProduct(null);
            setNewSaleProduct({
              name: '',
              price: 0,
              discount_percent: 0,
              discount_price: 0,
              stock: 0,
              sold: 0,
              description: '',
              images: [''], // reset về 1 ô input ảnh
              size: [],
              colors: [],
              categoryCode: '',
              isDiscount: true
            });
            setShowForm(true);
          }}
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
                  placeholder="Nhập tên sản phẩm"
                  onFocus={clearFieldError}
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
                    onChange={handlePriceChange}
                    onFocus={clearFieldError}
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
                    onChange={handleDiscountPercentChange}
                    onFocus={clearFieldError}
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
                    readOnly
                    style={{ backgroundColor: '#f5f5f5' }}
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

              <div className="form-row">
                <div className="form-group">
                  <label>Đã bán:</label>
                  <input
                    type="number"
                    name="sold"
                    defaultValue={editingProduct?.sold || 0}
                    min="0"
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
              {/* 
              <div className="form-group">
                <label>Hình ảnh (URL):</label>
                <input
                  type="url"
                  name="image"
                  defaultValue={editingProduct?.image || ''}
                  required
                />
              </div> */}

              <div className="form-group">
                <label>Link hình ảnh:</label>
                {newSaleProduct.images.map((image, index) => (
                  <div key={index} className="image-input-group">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => handleSaleImagesChange(index, e.target.value)}
                      placeholder={`Link hình ảnh ${index + 1}`}
                      required={index === 0}
                    />
                    {newSaleProduct.images.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-remove"
                        onClick={() => removeSaleImageField(index)}
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-add-image"
                  onClick={addSaleImageField}
                >
                  + Thêm hình ảnh
                </button>
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
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {Array.isArray(selectedProduct.images) && selectedProduct.images.length > 0 ? (
                selectedProduct.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${selectedProduct.name} - ${index + 1}`}
                    style={{ width: 120, height: 120, objectFit: 'contain', borderRadius: 8, background: '#fff' }}
                  />
                ))
              ) : (
                <img
                  src={selectedProduct.image || 'https://via.placeholder.com/120x120?text=No+Image'}
                  alt={selectedProduct.name || 'No name'}
                  style={{ width: 120, height: 120, objectFit: 'contain', borderRadius: 8, background: '#fff' }}
                />
              )}
            </div>
            <div className="detail-info">
              <h2>{selectedProduct.name}</h2>
              <div className="detail-row">
                <span className="original-price">{(selectedProduct.price || 0).toLocaleString('vi-VN')} VNĐ</span>
                <span className="discount-price">{(selectedProduct.discount_price || 0).toLocaleString('vi-VN')} VNĐ</span>
                <span className="detail-discount">-{selectedProduct.discount_percent || 0}%</span>
              </div>
              <div className="detail-row"><b>Tồn kho:</b> {selectedProduct.stock}</div>
              <div className="detail-row"><b>Đã bán:</b> {selectedProduct.sold || 0}</div>
              <div className="detail-row"><b>Kích thước:</b> {(selectedProduct.size || []).join(', ')}</div>
              <div className="detail-row"><b>Màu sắc:</b> {(selectedProduct.colors || []).join(', ')}</div>
              <div className="detail-row"><b>Danh mục:</b> {selectedProduct.categoryCode}</div>
              <div className="detail-row">
                <b>Trạng thái:</b>
                <span className={`status-indicator ${selectedProduct.isDiscount ? 'status-active' : 'status-inactive'}`}
                  style={{ marginLeft: 8 }}>
                  <span className="status-icon">{selectedProduct.isDiscount ? '' : ''}</span>
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
                <th>Đã bán</th>
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
                    <img
                      src={
                        Array.isArray(product.images) && product.images.length > 0
                          ? product.images[0]
                          : product.image || 'https://via.placeholder.com/50x50?text=No+Image'
                      }
                      alt={product.name}
                      className="table-product-img"
                      onClick={() => handleShowDetail(product)}
                      style={{ cursor: 'pointer', width: 50, height: 50, objectFit: 'contain', borderRadius: 4 }}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td><span className="original-price">{(product.price || 0).toLocaleString('vi-VN')} VNĐ</span></td>
                  <td><span className="discount-price">{(product.discount_price || 0).toLocaleString('vi-VN')} VNĐ</span></td>
                  <td>-{product.discount_percent || 0}%</td>
                  <td>{product.stock}</td>
                  <td>
                    <span style={{ cursor: 'pointer' }} onClick={() => handleUpdateSoldCount(product._id, product.sold || 0)}>
                      {product.sold || 0}
                    </span>
                  </td>
                  <td>{(product.size || []).join(', ')}</td>
                  <td>{(product.colors || []).join(', ')}</td>
                  <td>{product.categoryCode}</td>
                  <td>
                    <span className={`status-indicator ${product.isDiscount ? 'status-active' : 'status-inactive'}`}>
                      <span className="status-icon">
                        {product.isDiscount ? '' : ''}
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