import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';
import { useNotification } from '../../utils/NotificationContext';

const NotificationSystem = () => {
  const { notifications, removeNotification } = useNotification();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-error" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-warning" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-info" />;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case 'success':
        return 'border-success/20 bg-success/5';
      case 'error':
        return 'border-error/20 bg-error/5';
      case 'warning':
        return 'border-warning/20 bg-warning/5';
      case 'info':
      default:
        return 'border-info/20 bg-info/5';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.3 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`glass-card p-4 border ${getStyles(notification.type)} relative group`}
          >
            {/* Progress Bar */}
            {notification.autoClose && (
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: notification.duration / 1000, ease: "linear" }}
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-b-xl"
              />
            )}

            <div className="flex items-start gap-3">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
              >
                {getIcon(notification.type)}
              </motion.div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {notification.title && (
                  <motion.h4
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="font-semibold text-text-primary text-sm mb-1"
                  >
                    {notification.title}
                  </motion.h4>
                )}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-text-secondary text-sm leading-relaxed"
                >
                  {notification.message}
                </motion.p>
              </div>

              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 }}
                onClick={() => removeNotification(notification.id)}
                className="p-1 rounded-md hover:bg-text-muted/10 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="w-4 h-4 text-text-muted" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationSystem;
