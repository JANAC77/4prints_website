import React, { createContext, useContext, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((msg) => addToast(msg, 'success'), [addToast]);
  const error = useCallback((msg) => addToast(msg, 'error'), [addToast]);
  const info = useCallback((msg) => addToast(msg, 'info'), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all transform animate-slide-up ${
              toast.type === 'success'
                ? 'bg-white border-green-200 text-gray-900 shadow-green-100'
                : toast.type === 'error'
                ? 'bg-white border-red-200 text-gray-900 shadow-red-100'
                : 'bg-white border-yellow-200 text-gray-900 shadow-yellow-100'
            }`}
          >
            {toast.type === 'success' && (
              <span className="w-7 h-7 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <Icon icon="solar:check-circle-bold" className="text-lg" />
              </span>
            )}
            {toast.type === 'error' && (
              <span className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Icon icon="solar:danger-circle-bold" className="text-lg" />
              </span>
            )}
            {toast.type === 'info' && (
              <span className="w-7 h-7 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center shrink-0">
                <Icon icon="solar:bell-bing-bold" className="text-lg" />
              </span>
            )}
            <p className="flex-1 text-xs sm:text-sm text-gray-800">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <Icon icon="lucide:x" className="text-sm" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
