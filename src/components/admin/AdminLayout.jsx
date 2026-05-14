import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Wrench, 
  Briefcase, 
  LogOut, 
  Home,
  Menu,
  X,
  User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
  const { logout, currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/admin/customers', icon: Users, label: 'Customers' },
    { path: '/admin/services', icon: Wrench, label: 'Services' },
    { path: '/admin/portfolio', icon: Briefcase, label: 'Portfolio' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-brand-dark text-white font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(true)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-brand-dark/80 backdrop-blur-xl border-r border-white/10 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-8 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/30">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-xl font-bold tracking-tight">Admin <span className="text-brand-blue">Panel</span></span>
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-brand-light hover:text-white">
              <X size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 space-y-2 py-4">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group ${isActive ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-brand-light hover:bg-white/5 hover:text-white'}`}
                >
                  <item.icon size={20} className={isActive ? 'text-white' : 'text-brand-blue group-hover:scale-110 transition-transform'} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 mt-auto border-t border-white/5 space-y-4">
            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue">
                <User size={20} />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">{currentUser?.displayName || 'Admin'}</p>
                <p className="text-xs text-brand-light truncate">{currentUser?.email}</p>
              </div>
            </div>
            
            <Link to="/" className="flex items-center gap-4 px-4 py-3 text-brand-light hover:text-white hover:bg-white/5 rounded-2xl transition-all">
              <Home size={20} />
              <span className="font-medium">Go to Main Site</span>
            </Link>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-2xl transition-all"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-20 flex items-center justify-between px-8 bg-brand-dark/50 backdrop-blur-md border-b border-white/5 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-brand-light hover:text-white p-2 hover:bg-white/5 rounded-lg transition-all"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold">
              {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs text-brand-light">Status</span>
              <span className="text-sm font-medium flex items-center gap-1.5 text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Live System
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
