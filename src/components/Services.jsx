import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Globe, Smartphone, GraduationCap, Code, Database, Cloud, Layout, Terminal } from 'lucide-react';

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchServices();
  }, []);

  if (loading && services.length === 0) return null;

  return (
    <section id="services" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Our <span className="gradient-text">Services</span></h2>
          <p className="text-brand-light max-w-2xl mx-auto">We provide top-notch digital solutions crafted with precision and modern technologies.</p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {services.map((service) => {
            const Icon = ICON_MAP[service.icon] || Globe;
            return (
              <motion.div key={service.id} variants={itemVariants} className="glass-effect p-8 rounded-2xl card-hover relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/10 rounded-full blur-2xl group-hover:bg-brand-blue/20 transition-colors pointer-events-none" />
                
                <div className="mb-6 inline-block p-4 bg-brand-dark rounded-xl border border-white/5 group-hover:border-brand-blue/30 transition-colors">
                  <Icon size={32} className="text-brand-blue" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-brand-light mb-6 line-clamp-3">{service.description}</p>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  {service.tags?.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 text-xs font-medium text-brand-white bg-white/5 rounded-full border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
