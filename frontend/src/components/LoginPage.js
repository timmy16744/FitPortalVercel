import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Eye, EyeOff, Lock, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '../utils/api';

const LoginPage = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await onLogin(credentials);
      if (success) {
        toast.success('Welcome back!', {
          style: {
            background: 'var(--warm-gray)',
            color: 'var(--warm-white)',
            border: '1px solid var(--warm-gray-light)',
          },
        });
      } else {
        toast.error('Invalid credentials. Please try again.', {
          style: {
            background: 'var(--warm-gray)',
            color: 'var(--warm-white)',
            border: '1px solid #ef4444',
          },
        });
      }
    } catch (error) {
      toast.error('Login failed. Please try again.', {
        style: {
          background: 'var(--warm-gray)',
          color: 'var(--warm-white)',
          border: '1px solid #ef4444',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-warm-black flex items-center justify-center px-4 noise">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 gradient-blue rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 gradient-purple rounded-full opacity-10 blur-3xl"></div>
      </div>

      {/* Login container */}
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 gradient-blue rounded-2xl mb-6 shadow-2xl">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-warm-white mb-2 uppercase tracking-tight">
            Trainer Portal
          </h1>
          <p className="text-warm-white opacity-60 text-sm uppercase tracking-wide">
            Professional Edition
          </p>
        </div>

        {/* Login form */}
        <div className="card slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username field */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-warm-white opacity-80 uppercase tracking-wide">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-warm-white opacity-40" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={credentials.username}
                  onChange={handleInputChange}
                  className="input-primary pl-10"
                  placeholder="Enter your username"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-warm-white opacity-80 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-warm-white opacity-40" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="input-primary pl-10 pr-10"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-warm-white opacity-40 hover:opacity-70 transition-opacity"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full btn-primary flex items-center justify-center space-x-2 text-sm
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 pt-6 border-t border-warm-gray-light">
            <div className="text-center">
              <p className="text-xs text-warm-white opacity-60 uppercase tracking-wide mb-3">
                Demo Credentials
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-1 px-3 bg-warm-gray-light rounded-lg">
                  <span className="text-warm-white opacity-80">Username:</span>
                  <code className="text-warm-white font-mono">trainer</code>
                </div>
                <div className="flex justify-between items-center py-1 px-3 bg-warm-gray-light rounded-lg">
                  <span className="text-warm-white opacity-80">Password:</span>
                  <code className="text-warm-white font-mono">duck</code>
                </div>
              </div>
              <p className="text-xs text-warm-white opacity-40 mt-3">
                Create a .env file to customize credentials
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 scale-in">
          <p className="text-xs text-warm-white opacity-40 uppercase tracking-wide">
            Fitness Training Portal
          </p>
          <p className="text-xs text-warm-white opacity-30 mt-1">
            © 2024 Professional Training Solutions
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 