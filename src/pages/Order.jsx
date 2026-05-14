import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, FileText, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';

const Order = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    projectDescription: '',
    serviceType: '',
    clientType: '',
    institutionName: '',
    projectPurpose: '',
    estimatedBudget: '',
    acceptedTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.acceptedTerms) {
      alert("Please read and accept the Acknowledgment Agreement.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'orders'), {
        ...formData,
        userId: currentUser.uid,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      // Email Notification 
      // IMPORTANT: Replace 'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', and 'YOUR_PUBLIC_KEY' 
      // with your actual EmailJS credentials from https://www.emailjs.com/
      emailjs.send(
        'service_y6fpsil', // Replace with your Service ID
        'template_mwpo6wi', // Replace with your Template ID
        {
          to_name: 'Admin',
          from_name: formData.fullName,
          from_email: formData.email,
          phone: formData.phone,
          address: formData.address,
          service_type: formData.serviceType,
          client_type: formData.clientType,
          institution: formData.institutionName,
          purpose: formData.projectPurpose,
          message: formData.projectDescription,
          budget: formData.estimatedBudget
        },
        'Ud2DVxjAJpwbeiwzr' // Replace with your Public Key
      ).then((result) => {
          console.log('Email successfully sent!', result.text);
          // Optional: alert('Email notification sent to admin!');
      }, (error) => {
          console.error('Email failed to send...', error.text);
          alert(`Email notification failed: ${error.text}. Please check if your Template ID is correct (should start with 'template_').`);
      });

      setSubmitted(true);
      setTimeout(() => navigate('/'), 4000);
    } catch (error) {
      console.error("Error submitting order: ", error);
      alert(`Failed to submit order: ${error.message || 'Unknown error'}. Please check your internet connection and Firestore rules.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 relative overflow-hidden px-4">
      {/* Success Modal Overlay */}
      <AnimatePresence>
        {submitted && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-dark/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-effect p-8 md:p-12 rounded-[40px] text-center max-w-lg shadow-2xl border-t border-white/20 relative z-10"
            >
              <div className="w-24 h-24 bg-brand-blue/20 rounded-full flex items-center justify-center mx-auto mb-8 text-brand-blue">
                <CheckCircle size={56} className="animate-pulse" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Order Received!</h2>
              <p className="text-xl text-brand-light mb-8 leading-relaxed">
                Thank you for choosing us. We have received your order details successfully.
              </p>
              <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-2xl p-4 mb-8">
                <p className="text-brand-blue font-semibold">
                  🚀 Our professional team will contact you within 24 hours to discuss the next steps!
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 4 }}
                    className="h-full bg-brand-blue shadow-[0_0_15px_rgba(0,163,255,0.5)]"
                  />
                </div>
                <span className="text-xs text-brand-light/40 mt-2 font-medium tracking-widest uppercase">Redirecting to home</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Start Your <span className="text-brand-blue">Project</span>
          </h1>
          <p className="text-brand-light text-lg max-w-2xl mx-auto">
            Fill out the details below to initiate your project request. Our legal terms ensure a transparent and professional partnership.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Personal Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-effect p-8 rounded-3xl shadow-xl border-t border-white/10"
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <User className="text-brand-blue" size={20} />
              Personal Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-light mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={16} className="text-brand-blue/50" />
                  </div>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full bg-brand-dark/30 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-brand-light/30 focus:outline-none focus:border-brand-blue/50 transition-all"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-light mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={16} className="text-brand-blue/50" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-brand-dark/30 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-brand-light/30 focus:outline-none focus:border-brand-blue/50 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-light mb-1.5">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone size={16} className="text-brand-blue/50" />
                  </div>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full bg-brand-dark/30 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-brand-light/30 focus:outline-none focus:border-brand-blue/50 transition-all"
                    placeholder="+94 77 000 0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-light mb-1.5">Mailing Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin size={16} className="text-brand-blue/50" />
                  </div>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full bg-brand-dark/30 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-brand-light/30 focus:outline-none focus:border-brand-blue/50 transition-all"
                    placeholder="Street, City, Zip Code"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Project Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect p-8 rounded-3xl shadow-xl border-t border-white/10"
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <FileText className="text-brand-blue" size={20} />
              Project Details
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-light mb-1.5">Service Needed</label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    required
                    className="w-full bg-brand-dark/30 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-brand-blue/50 transition-all"
                  >
                    <option value="" className="bg-brand-dark">Select Service</option>
                    <option value="Website" className="bg-brand-dark">Website</option>
                    <option value="Mobile App" className="bg-brand-dark">Mobile App</option>
                    <option value="College Project" className="bg-brand-dark">College Project</option>
                    <option value="Other" className="bg-brand-dark">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-light mb-1.5">Who are you?</label>
                  <select
                    name="clientType"
                    value={formData.clientType}
                    onChange={handleChange}
                    required
                    className="w-full bg-brand-dark/30 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-brand-blue/50 transition-all"
                  >
                    <option value="" className="bg-brand-dark">Select Type</option>
                    <option value="Business" className="bg-brand-dark">Business / Company</option>
                    <option value="Student (College)" className="bg-brand-dark">Student (College)</option>
                    <option value="Student (University)" className="bg-brand-dark">Student (University)</option>
                    <option value="Student (School)" className="bg-brand-dark">Student (School)</option>
                    <option value="Other" className="bg-brand-dark">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-light mb-1.5">Institution / Company Name</label>
                <input
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleChange}
                  required
                  className="w-full bg-brand-dark/30 border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder:text-brand-light/30 focus:outline-none focus:border-brand-blue/50 transition-all"
                  placeholder="College Name or Company Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-light mb-1.5">Why you need this?</label>
                <select
                  name="projectPurpose"
                  value={formData.projectPurpose}
                  onChange={handleChange}
                  required
                  className="w-full bg-brand-dark/30 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-brand-blue/50 transition-all"
                >
                  <option value="" className="bg-brand-dark">Select Purpose</option>
                  <option value="College Project" className="bg-brand-dark">College Project</option>
                  <option value="Business Use" className="bg-brand-dark">Business Use</option>
                  <option value="Personal Use" className="bg-brand-dark">Personal Use</option>
                  <option value="Other" className="bg-brand-dark">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-light mb-1.5">Project Brief</label>
                <textarea
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full bg-brand-dark/30 border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder:text-brand-light/30 focus:outline-none focus:border-brand-blue/50 transition-all resize-none"
                  placeholder="Tell us about your project requirements..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-light mb-1.5">Estimated Budget (USD)</label>
                <select
                  name="estimatedBudget"
                  value={formData.estimatedBudget}
                  onChange={handleChange}
                  required
                  className="w-full bg-brand-dark border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-brand-blue/50 transition-all"
                >
                  <option value="" className="bg-brand-dark">Select Budget Range</option>
                  <option value="500-1000" className="bg-brand-dark">$500 - $1,000</option>
                  <option value="1000-5000" className="bg-brand-dark">$1,000 - $5,000</option>
                  <option value="5000-10000" className="bg-brand-dark">$5,000 - $10,000</option>
                  <option value="10000+" className="bg-brand-dark">$10,000+</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Bottom: Legal Agreement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 glass-effect p-8 rounded-3xl shadow-xl border-t border-white/10"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <AlertCircle className="text-brand-blue" size={20} />
              Acknowledgment Agreement
            </h3>
            
            <div className="bg-brand-dark/50 border border-white/5 rounded-xl p-6 h-48 overflow-y-auto mb-6 text-sm text-brand-light/80 leading-relaxed custom-scrollbar">
              <h4 className="font-bold text-white mb-2 uppercase tracking-wider">1. Project Commencement</h4>
              <p className="mb-4">Upon submission of this form and payment of the initial deposit, the project shall be considered active. Our team will begin resource allocation and development work as per the project scope.</p>

              <h4 className="font-bold text-white mb-2 uppercase tracking-wider">2. Cancellation Policy</h4>
              <p className="mb-4 text-brand-blue font-semibold">IMPORTANT: In the event of project cancellation by the Client after the commencement of work, the Client shall be liable to pay 30% of the total project value as a liquidation fee to cover administrative and preliminary development costs.</p>

              <h4 className="font-bold text-white mb-2 uppercase tracking-wider">3. Intellectual Property</h4>
              <p className="mb-4">Upon full and final payment of all project fees, the Client shall own all rights, titles, and interests in the developed project. We reserve the right to display the completed work in our portfolio unless a non-disclosure agreement is in place.</p>

              <h4 className="font-bold text-white mb-2 uppercase tracking-wider">4. Payment Terms</h4>
              <p className="mb-4">Payments are structured in milestones. Failure to meet payment schedules may result in project delays or suspension. Late payments may incur a penalty fee of 5% per month.</p>

              <h4 className="font-bold text-white mb-2 uppercase tracking-wider">5. Limitation of Liability</h4>
              <p>We are not liable for any indirect, special, or consequential damages arising out of the project performance. Our total liability is limited to the amount paid for the specific service phase in question.</p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-1">
                  <input
                    type="checkbox"
                    name="acceptedTerms"
                    checked={formData.acceptedTerms}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-white/20 rounded bg-transparent peer-checked:bg-brand-blue peer-checked:border-brand-blue transition-all" />
                  <CheckCircle className="absolute top-0.5 left-0.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" size={16} />
                </div>
                <span className="text-sm text-brand-light group-hover:text-white transition-colors">
                  I have read and agree to the Acknowledgment Agreement and Legal Terms.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading || !formData.acceptedTerms}
                className="px-10 py-4 bg-brand-blue text-white font-bold rounded-2xl hover:bg-brand-blue/80 transition-all shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Submit Order
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default Order;
