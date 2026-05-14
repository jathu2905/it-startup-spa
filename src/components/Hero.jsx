import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Mail } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-blue/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-green/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
            <span className="text-sm font-medium text-brand-light">Open for student projects & SME work</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            Empowering Your <br className="hidden md:block" />
            <span className="gradient-text">Academic IT Journey</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-brand-light mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            We build modern, scalable digital solutions for SMEs and help students achieve top grades with professional-grade final year projects.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <a 
              href="https://wa.me/94743127451?text=Hi%2C%20I'm%20interested%20in%20your%20services" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-brand-blue text-white font-semibold rounded-full hover:bg-brand-blue/80 transition-colors shadow-lg shadow-brand-blue/20"
            >
              <MessageCircle size={20} />
              Chat on WhatsApp
            </a>
            <a 
              href="mailto:[jeyarajahjathushan@gmail.com]?subject=Project%20Inquiry"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 glass-effect text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
            >
              <Mail size={20} />
              Email Us
              
            </a>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto"
        >
          {[
            { label: 'Projects Done', value: '50+' },
            { label: 'Happy Clients', value: '40+' },
            { label: 'Technologies', value: '15+' },
          ].map((stat, index) => (
            <div key={index} className="glass-effect p-6 rounded-2xl text-center">
              <h3 className="text-4xl font-bold text-white mb-2">{stat.value}</h3>
              <p className="text-brand-light font-medium">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
