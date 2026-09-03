import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { UI_TOKENS } from '../../config/designTokens';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onClose,
  className = '',
}) => {
  const tokenClass = UI_TOKENS.alert[variant] || UI_TOKENS.alert.info;

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-blue-600 shrink-0" />;
    }
  };

  return (
    <div className={`${tokenClass} ${className}`} role="alert">
      <div className="flex items-start gap-2.5 min-w-0 flex-1">
        <div className="mt-0.5">{getIcon()}</div>
        <div className="min-w-0 flex-1">
          {title && <div className="font-bold text-xs uppercase tracking-wider mb-0.5">{title}</div>}
          <div className="leading-relaxed">{children}</div>
        </div>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-3 p-1 text-current opacity-60 hover:opacity-100 transition-opacity rounded-sm focus:outline-none"
          title="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
