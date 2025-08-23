import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import LogoutButton from './components/LogoutButton';
import AdminChat from './pages/AdminChat';

//import ChatAdmin from './pages/ChatAdmin';
//import ChatFloatingButton from './components/ChatFloatingButton';
import './App.css';

function App() {
  return (
    <Router>
      <LogoutButton />
      <Routes>
        {/* Redirect root to login if not authenticated */}
        <Route path="/" element={
          localStorage.getItem('token') ? <Navigate to="/home" /> : <Navigate to="/login" />
        } />
        
        {/* Login route */}
        <Route path="/login" element={
          localStorage.getItem('token') ? <Navigate to="/home" /> : <Login />
        } />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requireAdmin={true}>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Chat route */}
        {/* <Route path="/admin/chat" element={<ChatAdmin />} /> */}

        {/* Catch all route - redirect to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <AdminChat />
    </Router>
  );
}

export default App;
