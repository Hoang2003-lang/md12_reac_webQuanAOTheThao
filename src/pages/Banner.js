
import React, { useEffect, useState } from "react";
import { bannerAPI } from "../config/api";
import "../styles/banner.css";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState({ name: "", banner: "", isActive: true });
  const [editingId, setEditingId] = useState(null);

  const fetchBanners = async () => {
    const data = await bannerAPI.getAllBanners();
    setBanners(data);
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
    if (editingId) {
      await bannerAPI.updateBanner(editingId, form);
    } else {
      await bannerAPI.createBanner(form);
    }
    setForm({ name: "", banner: "", isActive: true });
    setEditingId(null);
    fetchBanners();
  };

  const handleEdit = (banner) => {
    setForm({
      name: banner.name,
      banner: banner.banner,
      isActive: banner.isActive,
    });
    setEditingId(banner._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xóa banner này?")) {
      await bannerAPI.deleteBanner(id);
      fetchBanners();
    }
  };

  const handleToggle = async (id) => {
    await bannerAPI.toggleBannerStatus(id);
    fetchBanners();
  };

  return (
    <div className="banner-container">
      <h2>Quản lý Banner</h2>
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
          <button type="button" onClick={() => { setEditingId(null); setForm({ name: "", banner: "", isActive: true }); }}>
            Hủy
          </button>
        )}
      </form>
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
    </div>
  );
};

export default Banner;