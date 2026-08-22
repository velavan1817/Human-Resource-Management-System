import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Clock,
  FileText,
  CreditCard,
  Zap,
  BarChart3,
  Bell,
  Settings,
  Sparkles,
  CalendarDays,
  Megaphone,
  UserCheck,
  FolderKanban
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role, activeTab, setActiveTab, attentionAlerts, pendingApprovals } = useApp();

  const activeAlertCount = attentionAlerts.length;
  const activeApprovalCount = pendingApprovals.filter(p => p.status === 'Pending').length;

  if (role === 'hr_manager') {
    return (
      <div className="sidebar">
        <div className="brand">
          <div className="brand-mark">D</div>
          <div className="brand-text">
            <div className="name">DAYFLOW</div>
            <div className="tag">HR Intelligence</div>
          </div>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Core Operations</div>
          <div
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard />
            HR Dashboard
          </div>
          <div
            className={`nav-item ${activeTab === 'attention_center' ? 'active' : ''}`}
            onClick={() => setActiveTab('attention_center')}
          >
            <Zap />
            HR Intelligence
            <span className="nav-new">NEW</span>
            {activeAlertCount > 0 && <span className="nav-badge">{activeAlertCount}</span>}
          </div>
          <div
            className={`nav-item ${activeTab === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            <Users />
            Employees
          </div>
          <div
            className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            <Clock />
            Attendance
          </div>
          <div
            className={`nav-item ${activeTab === 'leave_management' ? 'active' : ''}`}
            onClick={() => setActiveTab('leave_management')}
          >
            <FileText />
            Leave Management
          </div>
          <div
            className={`nav-item ${activeTab === 'approvals' ? 'active' : ''}`}
            onClick={() => setActiveTab('approvals')}
          >
            <UserCheck />
            Approvals
            {activeApprovalCount > 0 && <span className="nav-badge g">{activeApprovalCount}</span>}
          </div>
          <div
            className={`nav-item ${activeTab === 'payroll' ? 'active' : ''}`}
            onClick={() => setActiveTab('payroll')}
          >
            <CreditCard />
            Payroll
          </div>
          <div
            className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <BarChart3 />
            Reports & Analytics
          </div>
        </div>

        <div className="nav-sep"></div>

        <div className="nav-section">
          <div className="nav-section-title">Organization</div>
          <div
            className={`nav-item ${activeTab === 'dates' ? 'active' : ''}`}
            onClick={() => setActiveTab('dates')}
          >
            <CalendarDays />
            Important Dates
          </div>
          <div
            className={`nav-item ${activeTab === 'announcements' ? 'active' : ''}`}
            onClick={() => setActiveTab('announcements')}
          >
            <Megaphone />
            Announcements
          </div>
          <div
            className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell />
            Notifications
          </div>
          <div
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings />
            Settings
          </div>
        </div>

        <button
          className="ai-btn"
          onClick={() => setActiveTab('attention_center')}
        >
          <Sparkles />
          AI Insights Center
        </button>
      </div>
    );
  }

  // Employee View Navigation
  return (
    <div className="sidebar">
      <div className="brand">
        <div className="brand-mark">D</div>
        <div className="brand-text">
          <div className="name">DAYFLOW</div>
          <div className="tag">My Workspace</div>
        </div>
      </div>

      <div className="nav-section">
        <div className="nav-section-title">Personal Portal</div>
        <div
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard />
          My Dashboard
        </div>
        <div
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <Users />
          My Profile
        </div>
        <div
          className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveTab('attendance')}
        >
          <Clock />
          Attendance
        </div>
        <div
          className={`nav-item ${activeTab === 'leave' ? 'active' : ''}`}
          onClick={() => setActiveTab('leave')}
        >
          <FileText />
          Leave & Time-off
        </div>
        <div
          className={`nav-item ${activeTab === 'payslips' ? 'active' : ''}`}
          onClick={() => setActiveTab('payslips')}
        >
          <CreditCard />
          My Payroll
        </div>
        <div
          className={`nav-item ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          <Users />
          My Team
        </div>
        <div
          className={`nav-item ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          <FolderKanban />
          My Documents
        </div>
      </div>

      <div className="nav-sep"></div>

      <div className="nav-section">
        <div className="nav-section-title">Communication</div>
        <div
          className={`nav-item ${activeTab === 'announcements' ? 'active' : ''}`}
          onClick={() => setActiveTab('announcements')}
        >
          <Megaphone />
          Announcements
        </div>
        <div
          className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <Bell />
          Notifications
          <span className="nav-badge g">3</span>
        </div>
        <div
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings />
          Settings
        </div>
      </div>
    </div>
  );
};
