import React from 'react';
import { motion } from 'framer-motion';

const Agreement = () => {
  return (
    <div className="min-h-screen pt-32 pb-24 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Service <span className="gradient-text">Agreement</span></h1>
          
          <div className="glass-effect rounded-3xl p-8 md:p-12 prose prose-invert max-w-none text-brand-light">
            <h2 className="text-2xl font-bold text-white mt-0">1. Acceptance of Terms</h2>
            <p>
              By accessing and using our services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8">2. Services Description</h2>
            <p>
              IT Startup provides custom software development, web application development, and technical consulting services. The specific scope, deliverables, timeline, and pricing for each project will be outlined in a separate Statement of Work (SOW) agreed upon by both parties.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8">3. Intellectual Property</h2>
            <p>
              Upon full payment for the services rendered, all intellectual property rights for the custom software developed specifically for the client will be transferred to the client, unless otherwise specified in the Statement of Work.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8">4. Payment Terms</h2>
            <p>
              Payment schedules will be detailed in the project proposal. A standard project requires a 50% deposit before work begins, with the remaining balance due upon completion and prior to final deployment.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8">5. Confidentiality</h2>
            <p>
              Both parties agree to maintain the confidentiality of any proprietary information shared during the course of the project. A separate Non-Disclosure Agreement (NDA) may be signed upon request.
            </p>
            
            <div className="mt-12 p-6 bg-brand-blue/10 border border-brand-blue/20 rounded-xl">
              <p className="m-0 text-sm">
                Last updated: May 2026. For questions regarding this agreement, please contact us via our contact page.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Agreement;
