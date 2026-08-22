import React from 'react';
import { useApp } from './context/AppContext';
import { ViewSwitcher } from './components/ViewSwitcher';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HRDashboard } from './components/HRDashboard';
import { HRAttentionCenter } from './components/HRAttentionCenter';
import { LeaveImpactAnalyzer } from './components/LeaveImpactAnalyzer';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { EmployeeDirectory } from './components/EmployeeDirectory';
import { MyProfileView } from './components/MyProfileView';
import { MyAttendanceView } from './components/MyAttendanceView';
import { AttendanceManagement } from './components/AttendanceManagement';
import { ApprovalsPage } from './components/ApprovalsPage';
import { PayrollPage } from './components/PayrollPage';
import { ReportsAnalytics } from './components/ReportsAnalytics';
import { ImportantDatesPage } from './components/ImportantDatesPage';
import { AddDateModal } from './components/AddDateModal';
import { AddAnnouncementModal } from './components/AddAnnouncementModal';
import { ApplyLeaveModal } from './components/ApplyLeaveModal';
import { CheckCircle } from 'lucide-react';

export const MainAppContent: React.FC = () => {
  const {
    role,
    activeTab,
    inspectingLeaveId,
    setInspectingLeaveId,
    leaveRequests,
    toastMsg
  } = useApp();

  const inspectingLeave = leaveRequests.find(r => r.id === inspectingLeaveId);

  const renderActiveView = () => {
    if (role === 'hr_manager') {
      switch (activeTab) {
        case 'attention_center':
          return <HRAttentionCenter />;
        case 'employees':
          return <EmployeeDirectory />;
        case 'attendance':
          return <AttendanceManagement />;
        case 'leave_management':
          return <ApprovalsPage />;
        case 'approvals':
          return <ApprovalsPage />;
        case 'payroll':
          return <PayrollPage />;
        case 'reports':
          return <ReportsAnalytics />;
        case 'dates':
          return <ImportantDatesPage />;
        case 'announcements':
          return <ImportantDatesPage />;
        default:
          return <HRDashboard />;
      }
    } else {
      switch (activeTab) {
        case 'profile':
          return <MyProfileView />;
        case 'attendance':
          return <MyAttendanceView />;
        case 'leave':
          return <EmployeeDashboard />;
        case 'payslips':
          return <PayrollPage />;
        case 'team':
          return <EmployeeDirectory />;
        case 'documents':
          return <MyProfileView />;
        default:
          return <EmployeeDashboard />;
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ViewSwitcher />
      <div className="app-container">
        <Sidebar />
        <div className="main">
          <Header />
          {renderActiveView()}
        </div>
      </div>

      {/* Leave Impact Analyzer Modal */}
      {inspectingLeave && (
        <LeaveImpactAnalyzer
          leaveRequest={inspectingLeave}
          onClose={() => setInspectingLeaveId(null)}
        />
      )}

      {/* Interactive Form Modals */}
      <AddDateModal />
      <AddAnnouncementModal />
      <ApplyLeaveModal />

      {/* Toast Popup Notification */}
      {toastMsg && (
        <div className="toast-container">
          <div className="toast">
            <CheckCircle size={16} color="var(--gold)" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}
    </div>
  );
};
