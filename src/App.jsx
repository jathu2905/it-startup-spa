import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Routes, Route, Outlet } from 'react-router-dom';
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
      <Routes>
        {/* Public Routes with Navbar and Footer */}
        <Route element={<><Navbar /><Outlet /><Footer /></>}>
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
        </Route>

        {/* Admin Routes - No Navbar or Footer */}
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
    </div>
  );
}

export default App;
