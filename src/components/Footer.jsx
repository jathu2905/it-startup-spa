import React from 'react';
import { Code } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

const Footer = () => {
  const { isAdmin } = useAuth();
  return (
    <footer className="border-t border-white/10 bg-brand-dark relative z-10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="flex flex-col items-start leading-none">
            <Logo />
            <span className="text-[0.5rem] tracking-[0.3em] text-brand-light/40 font-orbitron mt-1.5 ml-1">AI FOR THE NEXT GENERATION</span>
          </div>
          
          <div className="flex space-x-6 text-sm font-medium text-brand-light">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#portfolio" className="hover:text-white transition-colors">Portfolio</a>
            {!isAdmin && <a href="#contact" className="hover:text-white transition-colors">Contact</a>}
          </div>
        </div>

        <div className="text-center text-sm text-brand-light/60 border-t border-white/5 pt-8">
          <p>&copy; {new Date().getFullYear()} DUDE AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
