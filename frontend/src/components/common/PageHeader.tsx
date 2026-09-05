import React from 'react';
import { UI_TOKENS } from '../../config/designTokens';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  size?: 'default' | 'sm';
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon,
  badge,
  actions,
  size = 'default',
}) => {
  return (
    <div className={UI_TOKENS.pageHeader.wrapper}>
      <div>
        {/* Title & Icon Header */}
        <div className="flex items-center gap-3">
          {icon && (
            <span className={UI_TOKENS.pageHeader.iconWrapper}>
              {icon}
            </span>
          )}
          <div className="flex items-center gap-3">
            <h1 className={size === 'sm' ? UI_TOKENS.pageHeader.titleSm : UI_TOKENS.pageHeader.title}>
              <span>{title}</span>
            </h1>
            {badge && <div>{badge}</div>}
          </div>
        </div>

        {/* Description Subtitle */}
        {description && (
          <p className={UI_TOKENS.pageHeader.description}>
            {description}
          </p>
        )}
      </div>

      {/* Actions Toolbar */}
      {actions && <div className={UI_TOKENS.pageHeader.actions}>{actions}</div>}
    </div>
  );
};
