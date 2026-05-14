import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  Image as ImageIcon,
  ExternalLink,
  Link as LinkIcon
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';

const ManagePortfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', category: 'Student Project', description: '', image: '', link: '' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'portfolio'));
      const portfolioList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPortfolio(portfolioList);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'portfolio', editingId), formData);
      } else {
        await addDoc(collection(db, 'portfolio'), formData);
      }
      fetchPortfolio();
      resetForm();
    } catch (error) {
      alert("Error saving project");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteDoc(doc(db, 'portfolio', id));
        fetchPortfolio();
      } catch (error) {
        alert("Error deleting project");
      }
    }
  };

  const resetForm = () => {
    setFormData({ title: '', category: 'Student Project', description: '', image: '', link: '' });
    setEditingId(null);
    setIsAdding(false);
  };

  const startEdit = (project) => {
    setFormData({
      title: project.title,
      category: project.category,
      description: project.description,
      image: project.image || '',
      link: project.link || ''
    });
    setEditingId(project.id);
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
          <h1 className="text-2xl font-bold">Manage Portfolio</h1>
          <p className="text-brand-light">Showcase your best work and student projects.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white rounded-xl hover:bg-brand-blue/80 transition-all font-bold shadow-lg shadow-brand-blue/20"
          >
            <Plus size={18} /> Add Project
          </button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-effect p-8 rounded-3xl border-t border-white/10 shadow-xl"
          >
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{editingId ? 'Edit Project' : 'New Project'}</h3>
                <button type="button" onClick={resetForm} className="text-brand-light hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side: Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-light mb-1.5">Project Title</label>
                    <input
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-brand-dark/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-brand-blue/50"
                      placeholder="e.g. Library Management System"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-light mb-1.5">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-brand-dark/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-brand-blue/50"
                    >
                      <option value="Student Project" className="bg-brand-dark">Student Project</option>
                      <option value="SME Tool" className="bg-brand-dark">SME Tool</option>
                      <option value="Web App" className="bg-brand-dark">Web App</option>
                      <option value="Mobile App" className="bg-brand-dark">Mobile App</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-light mb-1.5">Description</label>
                    <textarea
                      required
                      rows="4"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-brand-dark/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-brand-blue/50 resize-none"
                      placeholder="Tell us about the project..."
                    />
                  </div>
                </div>

                {/* Right Side: Media */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-light mb-1.5">Image URL</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light/50" size={18} />
                      <input
                        required
                        value={formData.image}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                        className="w-full bg-brand-dark/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-brand-blue/50"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-light mb-1.5">Project Link (Optional)</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light/50" size={18} />
                      <input
                        value={formData.link}
                        onChange={(e) => setFormData({...formData, link: e.target.value})}
                        className="w-full bg-brand-dark/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-brand-blue/50"
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>
                  
                  {/* Preview */}
                  <div className="pt-2">
                    <p className="text-[10px] text-brand-light uppercase tracking-widest font-bold mb-2">Image Preview</p>
                    <div className="aspect-video rounded-2xl overflow-hidden border border-white/5 bg-white/5 flex items-center justify-center">
                      {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <ImageIcon size={32} className="text-brand-light/20 mx-auto mb-2" />
                          <p className="text-xs text-brand-light/40">No image URL provided</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
                <button type="button" onClick={resetForm} className="px-6 py-2.5 text-brand-light hover:text-white transition-colors font-medium">
                  Cancel
                </button>
                <button type="submit" className="flex items-center gap-2 px-8 py-2.5 bg-brand-blue text-white rounded-xl hover:bg-brand-blue/80 transition-all font-bold shadow-lg shadow-brand-blue/20">
                  <Save size={18} /> {editingId ? 'Update Project' : 'Add to Portfolio'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {portfolio.map((project) => (
          <motion.div 
            key={project.id}
            layout
            className="glass-effect rounded-3xl border-t border-white/10 shadow-xl overflow-hidden group flex flex-col"
          >
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-6">
                <div className="flex items-center gap-2">
                  <button onClick={() => startEdit(project)} className="p-3 bg-brand-blue rounded-xl text-white hover:bg-brand-blue/80 transition-all shadow-lg">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(project.id)} className="p-3 bg-red-500 rounded-xl text-white hover:bg-red-400 transition-all shadow-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noreferrer" className="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/30 transition-all border border-white/20">
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>
            </div>
            
            <div className="p-6 space-y-3 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">{project.category}</span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-brand-blue transition-colors">{project.title}</h3>
              <p className="text-brand-light text-sm line-clamp-2">{project.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ManagePortfolio;
