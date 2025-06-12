import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Post.css';

// Mock data for testing


const Post = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    category: '',
    status: 'draft'
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/posts');
      setPosts(Array.isArray(response.data.data) ? response.data.data : []);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách bài viết');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentPost) {
        // Cập nhật bài viết trong mock data
        const updatedPosts = posts.map(post => 
          post._id === currentPost._id ? { ...formData, _id: post._id, createdAt: post.createdAt } : post
        );
        setPosts(updatedPosts);
      } else {
        // Thêm bài viết mới vào mock data
        const newPost = {
          ...formData,
          _id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        setPosts([...posts, newPost]);
      }
      setShowAddModal(false);
      setShowEditModal(false);
      setCurrentPost(null);
      setFormData({
        title: '',
        content: '',
        image: '',
        category: '',
        status: 'draft'
      });
    } catch (err) {
      setError('Không thể lưu bài viết');
      console.error('Error saving post:', err);
    }
  };

  const handleEdit = (post) => {
    setCurrentPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      image: post.image,
      category: post.category,
      status: post.status
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        // Xóa bài viết khỏi mock data
        setPosts(posts.filter(post => post._id !== id));
      } catch (err) {
        setError('Không thể xóa bài viết');
        console.error('Error deleting post:', err);
      }
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="post-management">
      <div className="post-header">
        <h2>Quản lý bài viết</h2>
        <button className="add-button" onClick={() => setShowAddModal(true)}>
          Thêm bài viết mới
        </button>
      </div>

      <div className="post-list">
        <table>
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Danh mục</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post._id}>
                <td>{post.title}</td>
                <td>{post.category}</td>
                <td>{post.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}</td>
                <td>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</td>
                <td>
                  <button onClick={() => handleEdit(post)}>Sửa</button>
                  <button onClick={() => handleDelete(post._id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Thêm bài viết mới</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tiêu đề:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nội dung:</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Hình ảnh:</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Danh mục:</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Trạng thái:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="draft">Bản nháp</option>
                  <option value="published">Đã xuất bản</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit">Lưu</button>
                <button type="button" onClick={() => setShowAddModal(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Sửa bài viết</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tiêu đề:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nội dung:</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Hình ảnh:</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Danh mục:</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Trạng thái:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="draft">Bản nháp</option>
                  <option value="published">Đã xuất bản</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit">Cập nhật</button>
                <button type="button" onClick={() => setShowEditModal(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post; 