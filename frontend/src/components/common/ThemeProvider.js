import React, { createContext, useContext } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemeProvider = ({ children, theme, toggleTheme }) => {
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
      
      {/* Floating Theme Toggle Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full glass-card flex items-center justify-center group hover:scale-110 transition-all duration-300"
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        <motion.div
          key={theme}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 180, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-text-secondary group-hover:text-brand-primary transition-colors" />
          ) : (
            <Sun className="w-5 h-5 text-text-secondary group-hover:text-warning transition-colors" />
          )}
        </motion.div>
      </motion.button>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
