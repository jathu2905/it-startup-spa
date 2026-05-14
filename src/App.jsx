import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Agreement from './pages/Agreement';
import Order from './pages/Order';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import DashboardHome from './pages/admin/DashboardHome';
import ManageOrders from './pages/admin/ManageOrders';
import ManageCustomers from './pages/admin/ManageCustomers';
import ManageServices from './pages/admin/ManageServices';
import ManagePortfolio from './pages/admin/ManagePortfolio';

function App() {
  return (
    <div className="min-h-screen bg-brand-dark selection:bg-brand-blue selection:text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/agreement" element={<Agreement />} />
        <Route 
          path="/place-order" 
          element={
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="customers" element={<ManageCustomers />} />
          <Route path="services" element={<ManageServices />} />
          <Route path="portfolio" element={<ManagePortfolio />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
