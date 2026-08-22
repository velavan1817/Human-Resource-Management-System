import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bell,
  Search,
  Menu,
  Clock,
  ChevronDown,
  User,
  LogOut,
  RefreshCw,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHRMS } from '../../context/HRMSContext';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar, onOpenSearch }) => {
  const { currentUser, currentRole, logout } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead, resetToMockData } = useHRMS();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter relevant notifications for current user/role
  const userNotifications = notifications.filter(
    (n) =>
      n.targetRole === 'all' ||
      n.targetRole === currentRole ||
      (currentUser && n.targetUserId === currentUser.id)
  );

  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 h-16 flex items-center justify-between gap-4 select-none">
      {/* Left section: mobile toggle + search trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-400 hover:text-gray-600 transition-all text-xs w-48 sm:w-64 cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="truncate text-xs">Search Dayflow...</span>
          <kbd className="hidden sm:inline-block ml-auto text-[10px] font-semibold bg-white px-1.5 py-0.5 rounded border border-gray-200 text-gray-400 shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right section: Live Time, Demo Role Switcher Pill, Notifications, Profile Menu */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Live Clock & Date Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200/80 text-gray-600 text-xs">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-medium">Fri, Aug 21, 2026</span>
          <span className="text-gray-300">|</span>
          <span className="font-mono text-gray-800 font-semibold">{currentTime}</span>
        </div>

        {/* Active Portal Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 border border-gray-200 text-xs">
          {currentRole === 'admin' ? (
            <>
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-semibold text-gray-800">Admin Portal</span>
            </>
          ) : (
            <>
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-semibold text-gray-800">Employee Portal</span>
            </>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-gray-200 py-2.5 z-50">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded-full border border-blue-100">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllNotificationsRead(currentRole, currentUser?.id)}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                {userNotifications.length === 0 ? (
                  <div className="text-center py-6 text-xs text-gray-400">
                    No notifications yet.
                  </div>
                ) : (
                  userNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.link) {
                          navigate(notif.link);
                          setShowNotifications(false);
                        }
                      }}
                      className={`p-3.5 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 ${
                        !notif.read ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="mt-0.5">
                        <span
                          className={`w-2 h-2 rounded-full block ${
                            !notif.read ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 leading-snug">
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-gray-400 mt-1 block">
                          {notif.timestamp} {notif.sender && `• from ${notif.sender}`}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 px-4 border-t border-gray-100 flex justify-between items-center text-xs">
                <Link
                  to={currentRole === 'admin' ? '/admin/notifications' : '/employee/notifications'}
                  onClick={() => setShowNotifications(false)}
                  className="text-blue-600 hover:text-blue-800 font-medium text-[11px]"
                >
                  View all notifications →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-lg hover:bg-gray-100 transition-colors text-left cursor-pointer"
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
              alt={currentUser?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-gray-900 leading-tight">
                {currentUser?.name || 'Arun Kumar'}
              </p>
              <p className="text-[10px] text-gray-500 capitalize">
                {currentRole === 'admin' ? 'HR Lead' : 'Employee'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2.5 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-900">{currentUser?.name}</p>
                <p className="text-[11px] text-gray-500 truncate">{currentUser?.email}</p>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-100">
                  <Shield className="w-3 h-3" />
                  Role: {currentRole === 'admin' ? 'Admin / HR Officer' : 'Employee'}
                </div>
              </div>

              <div className="py-1">
                <Link
                  to={currentRole === 'admin' ? '/admin/employees' : '/employee/profile'}
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{currentRole === 'admin' ? 'Staff Directory & Settings' : 'My Profile & Details'}</span>
                </Link>

                <button
                  onClick={() => {
                    resetToMockData();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-gray-400" />
                  <span>Reset Mock Data</span>
                </button>
              </div>

              <div className="pt-1 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors text-left font-medium cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
