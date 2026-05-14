import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  Globe, 
  Smartphone, 
  GraduationCap, 
  Code, 
  Database, 
  Cloud,
  Layout,
  Terminal
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';

const ICON_MAP = {
  'Globe': Globe,
  'Smartphone': Smartphone,
  'GraduationCap': GraduationCap,
  'Code': Code,
  'Database': Database,
  'Cloud': Cloud,
  'Layout': Layout,
  'Terminal': Terminal
};

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', icon: 'Globe', tags: '' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'services'));
      const servicesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setServices(servicesList);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, 'services', editingId), data);
      } else {
        await addDoc(collection(db, 'services'), data);
      }
      fetchServices();
      resetForm();
    } catch (error) {
      alert("Error saving service");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteDoc(doc(db, 'services', id));
        fetchServices();
      } catch (error) {
        alert("Error deleting service");
      }
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', icon: 'Globe', tags: '' });
    setEditingId(null);
    setIsAdding(false);
  };

  const startEdit = (service) => {
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon || 'Globe',
      tags: service.tags?.join(', ') || ''
    });
    setEditingId(service.id);
    setIsAdding(true);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Services</h1>
          <p className="text-brand-light">Manage the services displayed on your website.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white rounded-xl hover:bg-brand-blue/80 transition-all font-bold shadow-lg shadow-brand-blue/20"
          >
            <Plus size={18} /> Add Service
          </button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-effect p-8 rounded-3xl border-t border-white/10 shadow-xl"
          >
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{editingId ? 'Edit Service' : 'New Service'}</h3>
                <button type="button" onClick={resetForm} className="text-brand-light hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-light mb-1.5">Service Title</label>
                    <input
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-brand-dark/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-brand-blue/50"
                      placeholder="e.g. Mobile Development"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-light mb-1.5">Icon Selection</label>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.keys(ICON_MAP).map((iconName) => {
                        const IconComponent = ICON_MAP[iconName];
                        return (
                          <button
                            key={iconName}
                            type="button"
                            onClick={() => setFormData({...formData, icon: iconName})}
                            className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${formData.icon === iconName ? 'bg-brand-blue/20 border-brand-blue text-brand-blue' : 'bg-white/5 border-white/10 text-brand-light hover:bg-white/10'}`}
                          >
                            <IconComponent size={20} />
                            <span className="text-[10px]">{iconName}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-light mb-1.5">Description</label>
                    <textarea
                      required
                      rows="4"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-brand-dark/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-brand-blue/50 resize-none"
                      placeholder="Service details..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-light mb-1.5">Tags (comma separated)</label>
                    <input
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      className="w-full bg-brand-dark/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-brand-blue/50"
                      placeholder="React, Node.js, Firebase"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
                <button type="button" onClick={resetForm} className="px-6 py-2.5 text-brand-light hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex items-center gap-2 px-8 py-2.5 bg-brand-blue text-white rounded-xl hover:bg-brand-blue/80 transition-all font-bold shadow-lg shadow-brand-blue/20">
                  <Save size={18} /> {editingId ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const IconComponent = ICON_MAP[service.icon] || Globe;
          return (
            <motion.div 
              key={service.id}
              layout
              className="glass-effect p-6 rounded-3xl border-t border-white/10 shadow-xl flex flex-col group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/5 rounded-full blur-2xl group-hover:bg-brand-blue/10 transition-all" />
              
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="p-3 bg-brand-blue/10 rounded-2xl text-brand-blue">
                  <IconComponent size={24} />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit(service)} className="p-2 hover:bg-white/10 rounded-lg text-brand-light hover:text-white transition-all">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(service.id)} className="p-2 hover:bg-white/10 rounded-lg text-red-400 hover:text-red-300 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
              <p className="text-brand-light text-sm line-clamp-3 mb-6 flex-1">{service.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {service.tags?.map((tag, i) => (
                  <span key={i} className="px-2 py-1 bg-white/5 rounded-lg text-[10px] text-brand-light border border-white/5">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageServices;
