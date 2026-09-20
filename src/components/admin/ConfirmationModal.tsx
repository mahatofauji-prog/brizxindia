import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconBg: 'bg-red-50 text-red-600 border-red-100',
          confirmBtn: 'bg-red-600 hover:bg-red-700 text-white shadow-red-200',
        };
      case 'warning':
        return {
          iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
          confirmBtn: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200',
        };
      case 'info':
      default:
        return {
          iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
          confirmBtn: 'bg-blue-700 hover:bg-blue-800 text-white shadow-indigo-200',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative overflow-hidden transform transition-all scale-100">
        <button
          onClick={onCancel}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-4 mb-5">
          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${styles.iconBg}`}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-indigo-950 font-heading">{title}</h3>
            <p className="text-sm text-slate-500 font-medium mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
            }}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer ${styles.confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
