import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, Calendar, User, Shield, ShieldAlert } from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const customersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCustomers(customersList);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const toggleAdmin = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'client' : 'admin';
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole
      });
      setCustomers(prev => prev.map(c => c.id === userId ? { ...c, role: newRole } : c));
    } catch (error) {
      alert("Failed to update user role");
    }
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold">Manage Customers</h1>
          <p className="text-brand-light">View and manage registered users.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light" size={18} />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-blue/50 w-full md:w-64"
          />
        </div>
      </div>

      <div className="glass-effect rounded-3xl border-t border-white/10 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-brand-light text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">User Details</th>
                <th className="px-6 py-4 font-semibold">Joined Date</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue font-bold">
                        {customer.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{customer.name}</p>
                        <p className="text-xs text-brand-light flex items-center gap-1">
                          <Mail size={12} /> {customer.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-brand-light flex items-center gap-2">
                      <Calendar size={14} className="text-brand-blue/50" />
                      {customer.createdAt?.toDate ? customer.createdAt.toDate().toLocaleDateString() : 'Pending...'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit ${
                      customer.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {customer.role === 'admin' ? <Shield size={10} /> : <User size={10} />}
                      {customer.role || 'client'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => toggleAdmin(customer.id, customer.role)}
                      className={`text-xs font-medium px-4 py-2 rounded-xl transition-all ${
                        customer.role === 'admin' 
                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                        : 'bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20'
                      }`}
                    >
                      {customer.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-brand-light">No customers found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageCustomers;
