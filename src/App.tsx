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
import { CheckCircle, Loader2, AlertTriangle } from 'lucide-react';

// ---------------------------------------------------------------------------
// Full-screen loading spinner shown while Supabase data is being fetched
// ---------------------------------------------------------------------------
const LoadingScreen: React.FC = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '16px',
      background: 'var(--bg-primary, #0f0f12)',
    }}
  >
    <Loader2
      size={40}
      style={{
        color: 'var(--accent-blue, #375DFB)',
        animation: 'spin 1s linear infinite',
      }}
    />
    <p style={{ color: 'var(--text-secondary, #9ca3af)', fontSize: '14px', margin: 0 }}>
      Connecting to DayFlow HR database…
    </p>
    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
  </div>
);

// ---------------------------------------------------------------------------
// Error screen shown when the Supabase connection fails
// ---------------------------------------------------------------------------
const ErrorScreen: React.FC<{ message: string }> = ({ message }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '16px',
      background: 'var(--bg-primary, #0f0f12)',
      padding: '24px',
      textAlign: 'center',
    }}
  >
    <AlertTriangle size={40} style={{ color: '#ef4444' }} />
    <h2 style={{ color: '#f9fafb', margin: 0, fontSize: '20px' }}>Database Connection Error</h2>
    <p style={{ color: '#9ca3af', fontSize: '14px', maxWidth: '480px', margin: 0 }}>
      {message}
    </p>
    <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>
      Make sure your <code style={{ color: '#d1d5db' }}>.env.local</code> file contains valid{' '}
      <code style={{ color: '#d1d5db' }}>VITE_SUPABASE_URL</code> and{' '}
      <code style={{ color: '#d1d5db' }}>VITE_SUPABASE_ANON_KEY</code> values.
    </p>
  </div>
);

// ---------------------------------------------------------------------------
// Main app content (rendered once data is loaded)
// ---------------------------------------------------------------------------
export const MainAppContent: React.FC = () => {
  const {
    role,
    activeTab,
    inspectingLeaveId,
    setInspectingLeaveId,
    leaveRequests,
    toastMsg,
    isLoading,
    dbError,
  } = useApp();

  // Show loading / error screens before the real UI
  if (isLoading) return <LoadingScreen />;
  if (dbError) return <ErrorScreen message={dbError} />;

  const inspectingLeave = leaveRequests.find((r) => r.id === inspectingLeaveId);

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
