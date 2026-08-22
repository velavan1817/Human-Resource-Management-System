import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Calendar, Bell, Download, Plus } from 'lucide-react';

export const Header: React.FC = () => {
  const { role, activeTab, attentionAlerts, showToast, setIsApplyLeaveModalOpen } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const getTitleInfo = () => {
    if (role === 'hr_manager') {
      switch (activeTab) {
        case 'attention_center':
          return { title: 'HR Attention Center', sub: 'AI identifies patterns that require proactive HR attention' };
        case 'employees':
          return { title: 'Employee Directory', sub: 'Manage workforce details, profiles & roles' };
        case 'attendance':
          return { title: 'Attendance Management', sub: 'Track daily check-ins, overtime & anomalies' };
        case 'leave_management':
          return { title: 'Leave & Impact Intelligence', sub: 'Evaluate organizational impact of time-off requests' };
        case 'approvals':
          return { title: 'Pending Approvals', sub: 'Review leave, overtime & document requests' };
        case 'payroll':
          return { title: 'Payroll Operations', sub: 'Salary structure & payment disbursements' };
        case 'reports':
          return { title: 'Reports & Analytics', sub: 'Workforce metrics, absenteeism & overtime breakdown' };
        case 'dates':
          return { title: 'Upcoming Important Dates', sub: 'Key organizational milestones, payroll & compliance' };
        case 'announcements':
          return { title: 'Company Announcements', sub: 'Broadcast announcements to workforce' };
        default:
          return { title: 'HR Dashboard', sub: 'Overview of workforce & HR intelligence' };
      }
    } else {
      switch (activeTab) {
        case 'profile':
          return { title: 'My Profile', sub: 'Personal information, job role & leave history' };
        case 'attendance':
          return { title: 'My Attendance', sub: 'Check-in history, working hours & overtime' };
        case 'leave':
          return { title: 'My Leave & Time-off', sub: 'Leave balances, history & new requests' };
        case 'payslips':
          return { title: 'My Payroll & Payslips', sub: 'Salary breakdown and monthly payslips' };
        case 'team':
          return { title: 'My Team', sub: 'Colleagues and team availability status' };
        case 'documents':
          return { title: 'My Documents', sub: 'Policies, verification letters & contracts' };
        default:
          return { title: 'My Dashboard', sub: 'Welcome back, Arjun Mehta! 👋' };
      }
    }
  };

  const { title, sub } = getTitleInfo();

  const handleExport = () => {
    showToast('Exporting HR intelligence report (PDF/CSV)... Download starting.');
  };

  return (
    <div className="topbar">
      <div>
        <h1>{title}</h1>
        <div className="sub">{sub}</div>
      </div>

      {role === 'hr_manager' ? (
        <div className="search">
          <Search />
          <input
            type="text"
            placeholder="Search employees, reports, alerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      ) : (
        <button className="btn-primary" onClick={() => setIsApplyLeaveModalOpen(true)}>
          <Plus size={16} /> Apply Leave
        </button>
      )}

      <div className="top-actions">
        <div className="date-pick">
          <Calendar />
          May 15 – May 21, 2026
        </div>

        <div className="icon-btn" onClick={() => showToast('You have 4 new system notifications.')}>
          <Bell />
          {attentionAlerts.length > 0 && (
            <div className="count-badge">{attentionAlerts.length}</div>
          )}
        </div>

        <div className="top-user">
          <div className="avatar">
            {role === 'hr_manager' ? 'PS' : 'AM'}
          </div>
          <div className="who">
            <div className="n">{role === 'hr_manager' ? 'Priya Sharma' : 'Arjun Mehta'}</div>
            <div className="r">{role === 'hr_manager' ? 'HR Manager' : 'Senior Backend Developer'}</div>
          </div>
        </div>

        {role === 'hr_manager' && (
          <button className="btn-primary" onClick={handleExport}>
            <Download size={15} /> Export Report
          </button>
        )}
      </div>
    </div>
  );
};
