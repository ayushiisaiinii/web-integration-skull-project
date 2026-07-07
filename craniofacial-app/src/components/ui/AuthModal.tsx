import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/40 backdrop-blur-sm p-4">
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border bg-blue-50">
          <h2 className="text-2xl font-bold text-blue-900">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <button 
            onClick={onClose}
            className="text-blue-400 hover:text-blue-700 hover:bg-blue-100 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-400">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <input 
                    type="text" 
                    className="pl-10 w-full bg-white border border-border rounded-lg py-2.5 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-blue-900" 
                    placeholder="Dr. Jane Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input 
                  type="email" 
                  className="pl-10 w-full bg-white border border-border rounded-lg py-2.5 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-blue-900" 
                  placeholder="jane.doe@hospital.org"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input 
                  type="password" 
                  className="pl-10 w-full bg-white border border-border rounded-lg py-2.5 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-blue-900" 
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-sm text-accent hover:text-blue-700 font-medium">
                  Forgot password?
                </button>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm"
              onClick={onClose}
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center text-sm text-blue-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:text-blue-800 font-bold underline underline-offset-4"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
