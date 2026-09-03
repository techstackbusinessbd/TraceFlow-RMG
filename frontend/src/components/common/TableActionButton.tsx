import React from 'react';
import { UI_TOKENS } from '../../config/designTokens';

export type TableActionVariant = 'base' | 'primary' | 'purple' | 'warning' | 'danger';

interface TableActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TableActionVariant;
  icon: React.ReactNode;
  title: string;
}

export const TableActionButton: React.FC<TableActionButtonProps> = ({
  variant = 'base',
  icon,
  title,
  className = '',
  ...props
}) => {
  const tokenClass = UI_TOKENS.tableAction[variant] || UI_TOKENS.tableAction.base;

  return (
    <button
      type="button"
      title={title}
      {...props}
      className={`${tokenClass} ${className}`}
    >
      {icon}
    </button>
  );
};
