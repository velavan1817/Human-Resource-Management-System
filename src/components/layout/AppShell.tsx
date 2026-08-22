import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '../common/ToastContainer';
import { GlobalSearchModal } from '../common/GlobalSearchModal';

export const AppShell: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex text-gray-900">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:pl-18' : 'lg:pl-64'
        }`}
      >
        <Header
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Modals & Toasts */}
      <ToastContainer />
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};
