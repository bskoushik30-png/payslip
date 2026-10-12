import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'info' | 'danger' | 'neutral' | 'purple';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  const variantClasses = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 font-medium',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/80 font-medium',
    info: 'bg-blue-50 text-blue-700 border-blue-200/80 font-medium',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/80 font-medium',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/80 font-medium',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${sizeClasses} ${variantClasses[variant]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      {children}
    </span>
  );
};
