import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MoreVertical,
  Eye,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  DollarSign
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, doc, orderBy, query } from 'firebase/firestore';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const ordersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const filteredOrders = orders.filter(order => 
    order.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.serviceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-400';
      case 'pending': return 'bg-orange-500/10 text-orange-400';
      case 'in-progress': return 'bg-brand-blue/10 text-brand-blue';
      case 'cancelled': return 'bg-red-500/10 text-red-400';
      default: return 'bg-white/10 text-white';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Orders</h1>
          <p className="text-brand-light">Review project requests and update their progress.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light" size={18} />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-blue/50 w-full md:w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Orders Table */}
        <div className={`xl:col-span-2 glass-effect rounded-3xl border-t border-white/10 shadow-xl overflow-hidden transition-all ${selectedOrder ? 'hidden xl:block' : 'block'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-brand-light text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Project / Client</th>
                  <th className="px-6 py-4 font-semibold">Service</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className={`hover:bg-white/5 transition-colors group cursor-pointer ${selectedOrder?.id === order.id ? 'bg-brand-blue/5' : ''}`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-white">{order.fullName}</p>
                        <p className="text-xs text-brand-light truncate max-w-[200px]">{order.institutionName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-brand-light">{order.serviceType}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-white/10 rounded-lg text-brand-light hover:text-white transition-all">
                        <Eye size={18} />
                      </button>
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
        </div>

        {/* Order Details Panel */}
        <AnimatePresence mode="wait">
          {selectedOrder ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass-effect rounded-3xl border-t border-white/10 shadow-xl overflow-hidden flex flex-col h-fit sticky top-4"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-bold text-lg">Order Details</h3>
                <button onClick={() => setSelectedOrder(null)} className="text-brand-light hover:text-white">
                  <XCircle size={20} />
                </button>
              </div>
              <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-250px)] custom-scrollbar">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-brand-light uppercase tracking-widest font-bold">Current Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>

                {/* Client Info */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail size={16} className="text-brand-blue mt-0.5 shrink-0" />
                    <div className="overflow-hidden">
                      <p className="text-xs text-brand-light">Email Address</p>
                      <p className="text-sm font-medium text-white truncate">{selectedOrder.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={16} className="text-brand-blue mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-brand-light">Phone Number</p>
                      <p className="text-sm font-medium text-white">{selectedOrder.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-brand-blue mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-brand-light">Address</p>
                      <p className="text-sm font-medium text-white">{selectedOrder.address}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 rounded-2xl">
                      <p className="text-[10px] text-brand-light uppercase tracking-wider mb-1">Service</p>
                      <p className="text-sm font-bold text-white">{selectedOrder.serviceType}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl">
                      <p className="text-[10px] text-brand-light uppercase tracking-wider mb-1">Budget</p>
                      <p className="text-sm font-bold text-brand-green">${selectedOrder.estimatedBudget}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-brand-light mb-2">Project Brief</p>
                    <div className="p-4 bg-white/5 rounded-2xl text-sm text-brand-light leading-relaxed">
                      {selectedOrder.projectDescription}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-2 text-xs text-brand-light">
                      <Briefcase size={14} className="text-brand-blue" />
                      Client Type: <span className="text-white font-medium">{selectedOrder.clientType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-brand-light">
                      <Clock size={14} className="text-brand-blue" />
                      Submitted: <span className="text-white font-medium">{selectedOrder.createdAt?.toDate ? selectedOrder.createdAt.toDate().toLocaleString() : 'Pending sync...'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-white/5 pt-6">
                  <p className="text-xs font-bold text-brand-light uppercase tracking-widest mb-4">Update Status</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => updateStatus(selectedOrder.id, 'in-progress')}
                      className="px-3 py-2 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 rounded-xl text-xs font-bold hover:bg-brand-blue/20 transition-all"
                    >
                      Process
                    </button>
                    <button 
                      onClick={() => updateStatus(selectedOrder.id, 'completed')}
                      className="px-3 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl text-xs font-bold hover:bg-green-500/20 transition-all"
                    >
                      Complete
                    </button>
                    <button 
                      onClick={() => updateStatus(selectedOrder.id, 'cancelled')}
                      className="px-3 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold hover:bg-red-500/20 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => updateStatus(selectedOrder.id, 'pending')}
                      className="px-3 py-2 bg-white/5 text-white border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="hidden xl:flex items-center justify-center h-[500px] glass-effect rounded-3xl border border-white/5 border-dashed">
              <div className="text-center p-8">
                <ShoppingBag size={48} className="text-brand-light/20 mx-auto mb-4" />
                <p className="text-brand-light">Select an order to view full details and manage progress.</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ManageOrders;
