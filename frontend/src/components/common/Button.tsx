import React from 'react';
import { UI_TOKENS } from '../../config/designTokens';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'subtle';
export type ButtonSize = 'md' | 'sm';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  let tokenClass = '';

  if (variant === 'primary') {
    tokenClass = size === 'sm' ? UI_TOKENS.button.primarySm : UI_TOKENS.button.primary;
  } else if (variant === 'secondary') {
    tokenClass = size === 'sm' ? UI_TOKENS.button.secondarySm : UI_TOKENS.button.secondary;
  } else if (variant === 'danger') {
    tokenClass = size === 'sm' ? UI_TOKENS.button.dangerSm : UI_TOKENS.button.danger;
  } else if (variant === 'subtle') {
    tokenClass = size === 'sm' ? UI_TOKENS.button.subtleSm : UI_TOKENS.button.subtle;
  }

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`${tokenClass} ${className}`}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent animate-spin shrink-0" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children && <span>{children}</span>}
    </button>
  );
};
