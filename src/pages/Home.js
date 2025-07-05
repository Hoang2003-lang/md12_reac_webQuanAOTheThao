import React, { useState } from 'react';
import Dashboard from './Dashboard';
import User from './User';
import Product from './Product';
import Order from './Order';
import Post from './Post';
import '../styles/Home.css';
import Voucher from './voucher';
import Banner from './Banner';
import SaleProducts from './SaleProducts';

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
          <li className={tab==='voucher' ? 'active' : ''} onClick={()=>setTab('voucher')}>Quản lý voucher</li>
          <li className={tab==='banner' ? 'active' : ''} onClick={()=>setTab('banner')}>Quản lý Banner</li>
          <li className={tab==='sale_products' ? 'active' : ''} onClick={()=>setTab('sale_products')}>Sản phẩm giảm giá</li>
        </ul>
      </aside>
      <main className="main-content">
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'users' && <User />}
        {tab === 'products' && <Product />}  
        {tab === 'orders' && <Order />}
        {tab === 'post' && <Post />}
        {tab === 'voucher' && <Voucher />}
        {tab === 'banner' && <Banner />}
        {tab === 'sale_products' && <SaleProducts />}
      </main>
    </div>
  );
};

export default Home; 