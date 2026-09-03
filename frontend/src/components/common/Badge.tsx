import React from 'react';
import { UI_TOKENS } from '../../config/designTokens';

export type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'root';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  icon,
  children,
  className = '',
  ...props
}) => {
  const tokenClass = UI_TOKENS.badge[variant] || UI_TOKENS.badge.neutral;

  return (
    <span {...props} className={`${tokenClass} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
