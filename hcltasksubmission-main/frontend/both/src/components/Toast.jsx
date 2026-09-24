import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function Toast({ message, type = 'info', onClose }) {
  if (!message) return null;

  return (
    <div className={`toast ${type}`}>
      {type === 'success' && <CheckCircle2 size={18} />}
      {type === 'error' && <AlertCircle size={18} />}
      {type === 'info' && <Info size={18} />}
      <span style={{ flex: 1 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', padding: 2 }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
