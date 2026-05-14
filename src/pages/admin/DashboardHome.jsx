import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  ShoppingBag, 
  Briefcase, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Wrench
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProjects: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch counts
        const usersSnap = await getDocs(collection(db, 'users'));
        const ordersSnap = await getDocs(collection(db, 'orders'));
        const projectsSnap = await getDocs(collection(db, 'portfolio'));
        
        const orders = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const pending = orders.filter(o => o.status === 'pending').length;

        setStats({
          totalUsers: usersSnap.size,
          totalOrders: ordersSnap.size,
          totalProjects: projectsSnap.size,
          pendingOrders: pending
        });

        // Fetch recent orders
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5));
        const recentSnap = await getDocs(q);
        setRecentOrders(recentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { label: 'Total Customers', value: stats.totalUsers, icon: Users, color: 'brand-blue', trend: '+12%' },
    { label: 'Project Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'purple-500', trend: '+5%' },
    { label: 'Portfolio Items', value: stats.totalProjects, icon: Briefcase, color: 'brand-green', trend: '0%' },
    { label: 'Pending Requests', value: stats.pendingOrders, icon: Clock, color: 'orange-500', trend: 'Action Required' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-brand-light mt-1">Here's what's happening with your startup today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-brand-blue/10 border border-brand-blue/20 rounded-xl text-brand-blue text-sm font-medium">
            Real-time Updates Enabled
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-effect p-6 rounded-3xl border-t border-white/10 shadow-xl group hover:border-brand-blue/30 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 bg-${card.color}/10 rounded-2xl text-${card.color} group-hover:scale-110 transition-transform`}>
                <card.icon size={24} />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-lg ${card.trend.includes('+') ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'}`}>
                {card.trend}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{card.value}</h3>
            <p className="text-brand-light text-sm">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 glass-effect rounded-3xl border-t border-white/10 shadow-xl overflow-hidden"
        >
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ShoppingBag className="text-brand-blue" size={20} />
              Recent Orders
            </h3>
            <button className="text-sm text-brand-blue hover:text-white transition-colors">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-brand-light text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Client</th>
                  <th className="px-6 py-4 font-semibold">Service</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.length > 0 ? recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue text-xs font-bold">
                          {order.fullName?.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-white">{order.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-brand-light">{order.serviceType}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                        order.status === 'pending' ? 'bg-orange-500/10 text-orange-400' :
                        'bg-blue-500/10 text-blue-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-brand-light">
                      {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Pending...'}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-brand-light">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Growth/Activity Chart Placeholder */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-effect rounded-3xl border-t border-white/10 shadow-xl p-6"
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="text-brand-green" size={20} />
            Quick Actions
          </h3>
          <div className="space-y-4">
            <button className="w-full p-4 bg-white/5 hover:bg-brand-blue/10 border border-white/5 hover:border-brand-blue/30 rounded-2xl flex items-center gap-4 transition-all text-left group">
              <div className="p-2 bg-brand-blue/20 rounded-xl text-brand-blue group-hover:scale-110 transition-transform">
                <Users size={20} />
              </div>
              <div>
                <p className="font-semibold text-sm">Add Portfolio Item</p>
                <p className="text-xs text-brand-light">Showcase a new project</p>
              </div>
            </button>
            <button className="w-full p-4 bg-white/5 hover:bg-brand-green/10 border border-white/5 hover:border-brand-green/30 rounded-2xl flex items-center gap-4 transition-all text-left group">
              <div className="p-2 bg-brand-green/20 rounded-xl text-brand-green group-hover:scale-110 transition-transform">
                <Wrench size={20} />
              </div>
              <div>
                <p className="font-semibold text-sm">Update Services</p>
                <p className="text-xs text-brand-light">Modify your offerings</p>
              </div>
            </button>
            <div className="pt-6 border-t border-white/5 mt-6">
              <p className="text-xs font-bold text-brand-light uppercase tracking-widest mb-4">System Notifications</p>
              <div className="space-y-3">
                <div className="flex gap-3 text-sm">
                  <div className="mt-1 w-2 h-2 rounded-full bg-brand-blue shrink-0" />
                  <p className="text-brand-light"><span className="text-white font-medium">New Backup</span> completed successfully 2h ago.</p>
                </div>
                <div className="flex gap-3 text-sm">
                  <div className="mt-1 w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                  <p className="text-brand-light"><span className="text-white font-medium">Email Alert:</span> Template 'Order Confirmed' updated.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;
