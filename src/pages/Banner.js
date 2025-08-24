
import React, { useEffect, useState } from "react";
import { bannerAPI } from "../config/api";
import "../styles/banner.css";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState({ name: "", banner: "", isActive: true });
  const [editingId, setEditingId] = useState(null);

  // Helper function to validate MongoDB ObjectId
  const isValidObjectId = (id) => {
    if (!id || typeof id !== 'string') return false;
    return /^[0-9a-fA-F]{24}$/.test(id);
  };

  const fetchBanners = async () => {
    try {
      const data = await bannerAPI.getAllBanners();
      console.log('Fetched banners:', data);
      
      // Filter out banners with invalid IDs
      const validBanners = (data || []).filter(banner => 
        banner && banner._id && isValidObjectId(banner._id)
      );
      
      if (validBanners.length !== (data || []).length) {
        console.warn('Some banners have invalid IDs and were filtered out');
      }
      
      setBanners(validBanners);
    } catch (error) {
      console.error('Error fetching banners:', error);
      alert('Có lỗi xảy ra khi tải danh sách banner!');
      setBanners([]);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!form.name.trim() || !form.banner.trim()) {
      alert('Vui lòng nhập đầy đủ thông tin banner');
      return;
    }
    
    try {
      if (editingId) {
        if (!isValidObjectId(editingId)) {
          alert('Lỗi: ID banner không hợp lệ. Vui lòng thử lại.');
          setEditingId(null);
          setForm({ name: "", banner: "", isActive: true });
          return;
        }
        
        // Check if banner still exists before updating
        const existingBanner = banners.find(b => b._id === editingId);
        if (!existingBanner) {
          alert('Banner không tồn tại hoặc đã bị xóa. Vui lòng làm mới danh sách.');
          setEditingId(null);
          setForm({ name: "", banner: "", isActive: true });
          fetchBanners(); // Refresh the list
          return;
        }
        
        console.log('Updating banner with ID:', editingId);
        console.log('Form data:', form);
        await bannerAPI.updateBanner(editingId, form);
        alert('Cập nhật banner thành công!');
      } else {
        await bannerAPI.createBanner(form);
        alert('Thêm banner thành công!');
      }
      setForm({ name: "", banner: "", isActive: true });
      setEditingId(null);
      fetchBanners();
    } catch (error) {
      console.error('Error saving banner:', error);
      if (error.message && error.message.includes('Không tìm thấy banner')) {
        alert('Banner không tồn tại hoặc đã bị xóa. Vui lòng làm mới danh sách.');
        setEditingId(null);
        setForm({ name: "", banner: "", isActive: true });
        fetchBanners(); // Refresh the list
      } else {
        alert(error.message || 'Có lỗi xảy ra khi lưu banner!');
      }
    }
  };

  const handleEdit = (banner) => {
    console.log('Editing banner:', banner);
    if (!banner._id || !isValidObjectId(banner._id)) {
      alert('Lỗi: Banner không có ID hợp lệ');
      return;
    }
    
    // Check if banner exists in current list
    const existingBanner = banners.find(b => b._id === banner._id);
    if (!existingBanner) {
      alert('Banner không tồn tại trong danh sách hiện tại. Vui lòng làm mới danh sách.');
      return;
    }
    
    setForm({
      name: banner.name || '',
      banner: banner.banner || '',
      isActive: banner.isActive !== undefined ? banner.isActive : true,
    });
    setEditingId(banner._id);
  };

  const handleDelete = async (id) => {
    if (!id || !isValidObjectId(id)) {
      alert('Lỗi: ID banner không hợp lệ');
      return;
    }
    
    if (window.confirm("Xóa banner này?")) {
      try {
        await bannerAPI.deleteBanner(id);
        alert('Xóa banner thành công!');
        fetchBanners();
      } catch (error) {
        console.error('Error deleting banner:', error);
        alert(error.message || 'Có lỗi xảy ra khi xóa banner!');
      }
    }
  };

  const handleToggle = async (id) => {
    if (!id || !isValidObjectId(id)) {
      alert('Lỗi: ID banner không hợp lệ');
      return;
    }
    
    try {
      await bannerAPI.toggleBannerStatus(id);
      alert('Cập nhật trạng thái banner thành công!');
      fetchBanners();
    } catch (error) {
      console.error('Error toggling banner status:', error);
      if (error.message && error.message.includes('Không tìm thấy banner')) {
        alert('Banner không tồn tại hoặc đã bị xóa. Vui lòng làm mới danh sách.');
        fetchBanners();
      } else {
        alert(error.message || 'Có lỗi xảy ra khi cập nhật trạng thái banner!');
      }
    }
  };

  const resetForm = () => {
    setForm({ name: "", banner: "", isActive: true });
    setEditingId(null);
  };

  return (
    <div className="banner-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Quản lý Banner</h2>
        <button 
          onClick={fetchBanners}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Làm mới
        </button>
      </div>
      <form className="banner-form" onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Tên banner"
          required
        />
        <input
          name="banner"
          value={form.banner}
          onChange={handleChange}
          placeholder="Link ảnh banner"
          required
        />
        <label>
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          Hiển thị
        </label>
        <button type="submit">{editingId ? "Cập nhật" : "Thêm mới"}</button>
        {editingId && (
          <button type="button" onClick={resetForm}>
            Hủy
          </button>
        )}
      </form>
             {banners.length === 0 ? (
         <div style={{ 
           textAlign: 'center', 
           padding: '40px', 
           color: '#666',
           backgroundColor: '#f9f9f9',
           borderRadius: '8px',
           marginTop: '20px'
         }}>
           <h3>Chưa có banner nào</h3>
           <p>Bắt đầu bằng cách thêm banner đầu tiên</p>
         </div>
       ) : (
         <table className="banner-table">
           <thead>
             <tr>
               <th>Tên</th>
               <th>Ảnh</th>
               <th>Hiển thị</th>
               <th>Hành động</th>
             </tr>
           </thead>
           <tbody>
             {banners.map((b) => (
               <tr key={b._id}>
                 <td>{b.name}</td>
                 <td>
                   <img src={b.banner} alt={b.name} className="banner-img" />
                 </td>
                 <td>
                   <input
                     type="checkbox"
                     checked={b.isActive}
                     onChange={() => handleToggle(b._id)}
                   />
                 </td>
                 <td>
                   <button onClick={() => handleEdit(b)}>Sửa</button>
                   <button onClick={() => handleDelete(b._id)}>Xóa</button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       )}
    </div>
  );
};

export default Banner;