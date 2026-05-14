import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, MapPin, Phone, Send, CheckCircle2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 2500);
    } catch (error) {
      console.error("Error adding document: ", error);
      setStatus('error');
      setErrorMessage('Failed to send message. Please try again later.');
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Let's Build Something <span className="gradient-text">Together</span></h2>
          <p className="text-brand-light text-lg max-w-2xl mx-auto">
            Ready to start your next project? Get in touch with us today for a free consultation and quote.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="glass-effect rounded-3xl p-8 border-t border-white/20 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none" />
            
            <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
            
            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full py-12 text-center"
              >
                <div className="w-16 h-16 bg-brand-green/20 text-brand-green rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Message Sent!</h4>
                <p className="text-brand-light">Thanks for reaching out. We'll get back to you shortly.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {status === 'error' && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
                    {errorMessage}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-brand-light mb-1.5">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-brand-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-light/40 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/50 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-light mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-brand-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-light/40 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/50 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-light mb-1.5">Message</label>
                  <textarea
                    required
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-brand-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-light/40 focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/50 transition-all resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-3.5 bg-brand-blue text-white font-semibold rounded-xl hover:bg-brand-blue/80 transition-colors shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {status === 'loading' ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col justify-center space-y-8"
          >
            <a 
              href="https://wa.me/94743127451?text=Hi%2C%20I'm%20interested%20in%20your%20services" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-6 p-6 glass-effect rounded-2xl hover:bg-white/5 transition-colors group"
            >
              <div className="w-14 h-14 bg-brand-green/20 rounded-full flex items-center justify-center text-brand-green group-hover:scale-110 transition-transform shrink-0">
                <MessageCircle size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">WhatsApp</h3>
                <p className="text-brand-light text-sm">Fastest response time for quick inquiries.</p>
              </div>
            </a>

            <a 
              href="mailto:jeyarajahjathushan@gmail.com?subject=Project%20Inquiry"
              className="flex items-center gap-6 p-6 glass-effect rounded-2xl hover:bg-white/5 transition-colors group"
            >
              <div className="w-14 h-14 bg-brand-blue/20 rounded-full flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform shrink-0">
                <Mail size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Email Us</h3>
                <p className="text-brand-light text-sm">jeyarajahjathushan@gmail.com</p>
              </div>
            </a>

            <div className="pt-4 border-t border-white/10">
              <div className="flex flex-col gap-4 text-brand-light">
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-brand-blue" />
                  <span>+94 77 884 9835</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-brand-blue" />
                  <span>Sri Lanka</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
