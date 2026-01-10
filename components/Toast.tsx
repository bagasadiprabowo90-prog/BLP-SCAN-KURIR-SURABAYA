
import React from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning';
}

export const Toast: React.FC<ToastProps> = ({ message, type }) => {
  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-600 border-emerald-500 shadow-emerald-500/20';
      case 'error':
        return 'bg-red-600 border-red-500 shadow-red-500/20';
      case 'warning':
        return 'bg-amber-600 border-amber-500 shadow-amber-500/20';
      default:
        return 'bg-slate-800 border-slate-700 shadow-slate-900/20';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
    }
  };

  return (
    <div className={`
      flex items-center gap-3 px-4 py-3 rounded-xl border text-white font-bold text-sm shadow-xl 
      animate-in fade-in slide-in-from-right-10 duration-300
      ${getStyles()}
    `}>
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      <p className="whitespace-nowrap">{message}</p>
    </div>
  );
};
