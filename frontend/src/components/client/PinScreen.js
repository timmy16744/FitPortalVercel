import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Shield, Smartphone } from 'lucide-react';

const PinScreen = ({ onPinSubmit }) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePinChange = (value) => {
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setPin(value);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (pin.length !== 4) {
      setError('Please enter a 4-digit PIN');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await onPinSubmit(pin);
      if (!success) {
        setError('Invalid PIN. Please try again.');
        setPin('');
      }
    } catch (error) {
      setError('Authentication failed. Please try again.');
      setPin('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNumberClick = (number) => {
    if (pin.length < 4) {
      handlePinChange(pin + number);
    }
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-bg via-accent-bg to-primary-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-brand-primary/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-brand-secondary/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-brand-accent/20 to-transparent rounded-full blur-2xl" />
      </div>

      {/* PIN Entry Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="glass-card p-8 text-center">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-display mb-2">
              Secure Access
            </h1>
            <p className="text-text-secondary">
              Enter your 4-digit PIN to access your fitness dashboard
            </p>
          </motion.div>

          {/* PIN Display */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              {[0, 1, 2, 3].map((index) => (
                <motion.div
                  key={index}
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                    pin.length > index
                      ? 'bg-brand-primary border-brand-primary'
                      : 'border-border-medium'
                  }`}
                  animate={pin.length > index ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>

            {/* PIN Input (Hidden) */}
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => handlePinChange(e.target.value)}
                className="input text-center text-lg tracking-widest"
                placeholder="Enter PIN"
                maxLength={4}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
              >
                {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-error text-sm mt-2"
              >
                {error}
              </motion.p>
            )}
          </motion.div>

          {/* Number Pad */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="grid grid-cols-3 gap-4 mb-6"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <motion.button
                key={number}
                onClick={() => handleNumberClick(number.toString())}
                className="w-16 h-16 rounded-xl bg-secondary-bg hover:bg-hover-bg border border-border-light text-text-primary font-semibold text-lg transition-all duration-200 mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
              >
                {number}
              </motion.button>
            ))}
            
            {/* Bottom Row */}
            <motion.button
              onClick={handleClear}
              className="w-16 h-16 rounded-xl bg-secondary-bg hover:bg-hover-bg border border-border-light text-text-secondary font-medium transition-all duration-200 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              Clear
            </motion.button>
            
            <motion.button
              onClick={() => handleNumberClick('0')}
              className="w-16 h-16 rounded-xl bg-secondary-bg hover:bg-hover-bg border border-border-light text-text-primary font-semibold text-lg transition-all duration-200 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              0
            </motion.button>
            
            <motion.button
              onClick={handleBackspace}
              className="w-16 h-16 rounded-xl bg-secondary-bg hover:bg-hover-bg border border-border-light text-text-secondary font-medium transition-all duration-200 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              ⌫
            </motion.button>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            onClick={handleSubmit}
            disabled={pin.length !== 4 || isLoading}
            className="w-full btn btn-primary py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={pin.length === 4 && !isLoading ? { scale: 1.02 } : {}}
            whileTap={pin.length === 4 && !isLoading ? { scale: 0.98 } : {}}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                Verifying...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Lock className="w-5 h-5" />
                Access Dashboard
              </div>
            )}
          </motion.button>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-6 p-4 bg-info/5 border border-info/20 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <Smartphone className="w-4 h-4 text-info" />
              <span className="text-sm font-medium text-info">First time?</span>
            </div>
            <p className="text-xs text-text-secondary">
              Your trainer will provide you with a 4-digit PIN to access your personalized fitness dashboard.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PinScreen;
