import React, { useState, useEffect } from 'react';
import { Menu, X, Code, User, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  
  const { currentUser, logout, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const navLinks = [
    { name: 'Home', href: isHome ? '#home' : '/' },
    { name: 'Services', href: isHome ? '#services' : '/#services' },
    { name: 'Portfolio', href: isHome ? '#portfolio' : '/#portfolio' },
    ...(isAdmin ? [{ name: 'Admin Dashboard', href: '/admin', isRoute: true }] : [
      { name: 'Agreement', href: '/agreement', isRoute: true },
      ...(currentUser ? [{ name: 'Place Order', href: '/place-order', isRoute: true }] : []),
    ]),
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass-effect py-3 shadow-lg' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex flex-col items-start leading-none group">
            <Logo className="group-hover:scale-105 transition-transform duration-300" />
            <span className="text-[0.5rem] tracking-[0.3em] text-brand-light/40 font-orbitron mt-1.5 ml-1">AI FOR THE NEXT GENERATION</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link key={link.name} to={link.href} className="text-brand-light hover:text-white transition-colors text-sm font-medium">
                  {link.name}
                </Link>
              ) : (
                <a key={link.name} href={link.href} className="text-brand-light hover:text-white transition-colors text-sm font-medium">
                  {link.name}
                </a>
              )
            ))}
            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
              {currentUser ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-brand-light">
                    <User size={18} className="text-brand-blue" />
                    <span className="text-sm font-medium">{currentUser.displayName || currentUser.email.split('@')[0]}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-brand-light hover:text-white transition-colors text-sm font-medium">
                  Login
                </Link>
              )}
              {!isAdmin && (
                currentUser ? (
                  <Link to="/place-order" className="px-5 py-2.5 bg-brand-blue text-white text-sm font-semibold rounded-full hover:bg-brand-blue/80 transition-colors shadow-lg shadow-brand-blue/20">
                    Start Project
                  </Link>
                ) : (
                  <Link to="/place-order" className="px-5 py-2.5 bg-brand-blue text-white text-sm font-semibold rounded-full hover:bg-brand-blue/80 transition-colors shadow-lg shadow-brand-blue/20">
                    Let's Start
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-brand-light hover:text-white">
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-effect border-t border-white/10 absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.name} 
                  to={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 text-base font-medium text-brand-light hover:text-white hover:bg-white/5 rounded-md"
                >
                  {link.name}
                </Link>
              ) : (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 text-base font-medium text-brand-light hover:text-white hover:bg-white/5 rounded-md"
                >
                  {link.name}
                </a>
              )
            ))}
            
            <div className="my-4 border-t border-white/10 pt-4">
              {currentUser ? (
                <>
                  <div className="px-3 py-2 flex items-center gap-2 text-brand-light">
                    <User size={18} className="text-brand-blue" />
                    <span className="font-medium">{currentUser.displayName || currentUser.email.split('@')[0]}</span>
                  </div>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-3 text-base font-medium text-red-400 hover:text-red-300 hover:bg-white/5 rounded-md"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link 
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 text-base font-medium text-brand-light hover:text-white hover:bg-white/5 rounded-md"
                >
                  Login
                </Link>
              )}
            </div>

            {!isAdmin && (
              currentUser ? (
                <Link 
                  to="/place-order"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center mt-2 px-5 py-3 bg-brand-blue text-white font-semibold rounded-lg"
                >
                  Start Project
                </Link>
              ) : (
                <Link 
                  to="/place-order"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center mt-2 px-5 py-3 bg-brand-blue text-white font-semibold rounded-lg"
                >
                  Let's Start
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
