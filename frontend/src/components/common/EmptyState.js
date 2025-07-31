import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({ icon: Icon, title, message, actionButton }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center text-center p-8 h-full"
    >
      <div className="w-20 h-20 bg-content-bg rounded-full flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-brand-primary" />
      </div>
      <h2 className="text-xl font-bold text-display mb-2">{title}</h2>
      <p className="text-text-secondary max-w-xs mx-auto">{message}</p>
      {actionButton && <div className="mt-6">{actionButton}</div>}
    </motion.div>
  );
};

export default EmptyState;
