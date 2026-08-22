import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBg = 'bg-blue-50 border-blue-100',
  trend,
  onClick,
  className = ''
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`stat-card p-5 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{title}</span>
        <div className={`p-2 rounded-lg border ${iconBg} ${iconColor} shrink-0`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900 tracking-tight font-display">{value}</span>
      </div>

      {(subtitle || trend) && (
        <div className="mt-2.5 flex items-center gap-2 text-xs text-gray-500">
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 font-medium px-1.5 py-0.5 rounded text-[11px] ${
                trend.isPositive
                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                  : 'text-red-700 bg-red-50 border border-red-200'
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {trend.value}
            </span>
          )}
          {trend?.label && <span className="text-[11px] text-gray-500">{trend.label}</span>}
          {subtitle && !trend && <span className="text-[11px] text-gray-500">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};

