import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarDays,
  DollarSign,
  BarChart3,
  Bell,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHRMS } from '../../context/HRMSContext';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: any;
  badge?: number;
  badgeVariant?: 'default' | 'warning';
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile
}) => {
  const { currentRole, currentUser, logout } = useAuth();
  const { leaves, notifications } = useHRMS();
  const navigate = useNavigate();

  const pendingLeavesCount = leaves.filter((l) => l.status === 'Pending').length;
  const unreadNotifsCount = notifications.filter(
    (n) =>
      !n.read &&
      (n.targetRole === 'all' ||
        n.targetRole === currentRole ||
        (currentUser && n.targetUserId === currentUser.id))
  ).length;

  const employeeNavItems: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/employee/dashboard',
      icon: LayoutDashboard
    },
    {
      label: 'My Profile',
      path: '/employee/profile',
      icon: User
    },
    {
      label: 'Attendance',
      path: '/employee/attendance',
      icon: CalendarCheck
    },
    {
      label: 'Leave Requests',
      path: '/employee/leave',
      icon: CalendarDays
    },
    {
      label: 'Payroll & Slips',
      path: '/employee/payroll',
      icon: DollarSign
    },
    {
      label: 'Notifications',
      path: '/employee/notifications',
      icon: Bell,
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined
    }
  ];

  const adminNavItems: NavItem[] = [
    {
      label: 'HR Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard
    },
    {
      label: 'Employees',
      path: '/admin/employees',
      icon: Users
    },
    {
      label: 'Attendance',
      path: '/admin/attendance',
      icon: CalendarCheck
    },
    {
      label: 'Leave Requests',
      path: '/admin/leave',
      icon: CalendarDays,
      badge: pendingLeavesCount > 0 ? pendingLeavesCount : undefined,
      badgeVariant: 'warning'
    },
    {
      label: 'Payroll',
      path: '/admin/payroll',
      icon: DollarSign
    },
    {
      label: 'Analytics & Reports',
      path: '/admin/analytics',
      icon: BarChart3
    }
  ];

  const navItems = currentRole === 'admin' ? adminNavItems : employeeNavItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 text-gray-700 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
            D
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <span className="font-display font-bold text-base tracking-tight text-gray-900 leading-none block">
                Dayflow
              </span>
              <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">
                Enterprise HRMS
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Mode Tag */}
      {!collapsed && (
        <div className="px-3 pt-3 pb-1">
          <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  currentRole === 'admin' ? 'bg-blue-600' : 'bg-emerald-500'
                }`}
              />
              <span className="font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                {currentRole === 'admin' ? 'Admin Portal' : 'Employee Portal'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-200">
              v2.4
            </span>
          </div>
        </div>
      )}

      {/* Nav links */}
      <div className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-all duration-150 group relative ${
                  isActive
                    ? 'sidebar-item-active'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 font-medium'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4.5 h-4.5 shrink-0 transition-colors ${
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />
                  {!collapsed && <span className="truncate flex-1">{item.label}</span>}
                  {!collapsed && item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        item.badgeVariant === 'warning'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {collapsed && item.badge !== undefined && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Profile card & Logout */}
      <div className="p-3 border-t border-gray-100">
        {!collapsed ? (
          <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 mb-2">
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-gray-900 truncate">{currentUser?.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{currentUser?.position}</p>
              </div>
            </div>
          </div>
        ) : null}

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Log out"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:block fixed inset-y-0 left-0 z-40 transition-all duration-300 ${
          collapsed ? 'w-18' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
