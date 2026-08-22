import React from 'react';
import { AttendanceStatus, LeaveStatus, EmployeeStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = ''
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  const variantStyles = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    neutral: 'bg-gray-100 text-gray-600 border-gray-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-blue-50 text-blue-700 border-blue-200'
  };

  const dotColors = {
    default: 'bg-gray-400',
    neutral: 'bg-gray-400',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    purple: 'bg-blue-500'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border whitespace-nowrap ${sizeClasses} ${variantStyles[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

export const AttendanceBadge: React.FC<{ status: AttendanceStatus }> = ({ status }) => {
  switch (status) {
    case 'present':
      return <Badge variant="success" dot>Present</Badge>;
    case 'absent':
      return <Badge variant="error" dot>Absent</Badge>;
    case 'half_day':
      return <Badge variant="warning" dot>Half Day</Badge>;
    case 'leave':
      return <Badge variant="purple" dot>On Leave</Badge>;
    case 'weekend':
      return <Badge variant="neutral">Weekend</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};

export const LeaveStatusBadge: React.FC<{ status: LeaveStatus }> = ({ status }) => {
  switch (status) {
    case 'Approved':
      return <Badge variant="success" dot>Approved</Badge>;
    case 'Pending':
      return <Badge variant="warning" dot>Pending Review</Badge>;
    case 'Rejected':
      return <Badge variant="error" dot>Rejected</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};

export const EmployeeStatusBadge: React.FC<{ status: EmployeeStatus }> = ({ status }) => {
  switch (status) {
    case 'active':
      return <Badge variant="success" dot>Active</Badge>;
    case 'on_leave':
      return <Badge variant="purple" dot>On Leave</Badge>;
    case 'inactive':
      return <Badge variant="neutral" dot>Deactivated</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};
