import React, { useState } from 'react';
import Dashboard from './Dashboard';
import User from './User';
import Product from './Product';
import Order from './Order';
import Post from './Post';
import '../styles/Home.css';

const Home = () => {
  const [tab, setTab] = useState('dashboard');
  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <h3>Quản trị</h3>
        <ul>
          <li className={tab==='dashboard' ? 'active' : ''} onClick={()=>setTab('dashboard')}>Thống kê</li>
          <li className={tab==='users' ? 'active' : ''} onClick={()=>setTab('users')}>Quản lý người dùng</li>
          <li className={tab==='products' ? 'active' : ''} onClick={()=>setTab('products')}>Quản lý sản phẩm</li>
          <li className={tab==='orders' ? 'active' : ''} onClick={()=>setTab('orders')}>Quản lý đơn hàng</li>
          <li className={tab==='post' ? 'active' : ''} onClick={()=>setTab('post')}>Quản lý bài viết</li>
        </ul>
      </aside>
      <main className="main-content">
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'users' && <User />}
        {tab === 'products' && <Product />}
        {tab === 'orders' && <Order />}
        {tab === 'post' && <Post />}
      </main>
    </div>
  );
};

export default Home; 