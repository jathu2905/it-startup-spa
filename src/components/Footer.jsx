import React from 'react';
import { Code } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Footer = () => {
  const { isAdmin } = useAuth();
  return (
    <footer className="border-t border-white/10 bg-brand-dark relative z-10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-brand-blue/20 rounded-lg border border-brand-blue/30">
              <Code className="text-brand-blue" size={24} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">IT<span className="text-brand-blue">Startup</span></span>
          </div>
          
          <div className="flex space-x-6 text-sm font-medium text-brand-light">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#portfolio" className="hover:text-white transition-colors">Portfolio</a>
            {!isAdmin && <a href="#contact" className="hover:text-white transition-colors">Contact</a>}
          </div>
        </div>

        <div className="text-center text-sm text-brand-light/60 border-t border-white/5 pt-8">
          <p>&copy; {new Date().getFullYear()} IT Startup. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
