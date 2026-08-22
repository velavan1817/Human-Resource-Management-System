import React, { createContext, useContext, useState } from 'react';
import {
  Role,
  Employee,
  LeaveRequest,
  HRAttentionAlert,
  WorkforceRiskItem,
  ImportantDate,
  Announcement,
  PendingApproval,
  AttendanceRecord
} from '../types';
import {
  INITIAL_EMPLOYEES,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_ATTENTION_ALERTS,
  WORKFORCE_RISK_HEATMAP,
  INITIAL_IMPORTANT_DATES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_PENDING_APPROVALS,
  INITIAL_ATTENDANCE_LOGS
} from '../data/initialData';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  attentionAlerts: HRAttentionAlert[];
  riskHeatmap: WorkforceRiskItem[];
  importantDates: ImportantDate[];
  announcements: Announcement[];
  pendingApprovals: PendingApproval[];
  attendanceLogs: AttendanceRecord[];
  
  // Interactive Modals & Selection
  inspectingLeaveId: string | null;
  setInspectingLeaveId: (id: string | null) => void;
  inspectingEmployeeId: string | null;
  setInspectingEmployeeId: (id: string | null) => void;
  isAddDateModalOpen: boolean;
  setIsAddDateModalOpen: (open: boolean) => void;
  isAddAnnouncementModalOpen: boolean;
  setIsAddAnnouncementModalOpen: (open: boolean) => void;
  isApplyLeaveModalOpen: boolean;
  setIsApplyLeaveModalOpen: (open: boolean) => void;

  // Employee Check-in State
  isCheckedIn: boolean;
  checkInTimeStr: string | null;
  toggleCheckIn: () => void;

  // Decision & Action Handlers
  approveLeaveRequest: (id: string) => void;
  rejectLeaveRequest: (id: string) => void;
  submitNewLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'submittedAt' | 'status' | 'impact'>) => void;
  addImportantDate: (dateItem: Omit<ImportantDate, 'id'>) => void;
  postAnnouncement: (announcement: Omit<Announcement, 'id' | 'timeAgo' | 'postedBy'>) => void;
  resolveAlert: (id: string) => void;
  
  // Toast
  toastMsg: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>('hr_manager');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVE_REQUESTS);
  const [attentionAlerts, setAttentionAlerts] = useState<HRAttentionAlert[]>(INITIAL_ATTENTION_ALERTS);
  const [riskHeatmap] = useState<WorkforceRiskItem[]>(WORKFORCE_RISK_HEATMAP);
  const [importantDates, setImportantDates] = useState<ImportantDate[]>(INITIAL_IMPORTANT_DATES);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>(INITIAL_PENDING_APPROVALS);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE_LOGS);

  // Modals state
  const [inspectingLeaveId, setInspectingLeaveId] = useState<string | null>(null);
  const [inspectingEmployeeId, setInspectingEmployeeId] = useState<string | null>(null);
  const [isAddDateModalOpen, setIsAddDateModalOpen] = useState<boolean>(false);
  const [isAddAnnouncementModalOpen, setIsAddAnnouncementModalOpen] = useState<boolean>(false);
  const [isApplyLeaveModalOpen, setIsApplyLeaveModalOpen] = useState<boolean>(false);

  // Check in
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(false);
  const [checkInTimeStr, setCheckInTimeStr] = useState<string | null>(null);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    setActiveTab('dashboard');
    showToast(`Switched view to ${newRole === 'hr_manager' ? 'HR Manager' : 'Employee Portal'}`);
  };

  const toggleCheckIn = () => {
    if (!isCheckedIn) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setIsCheckedIn(true);
      setCheckInTimeStr(timeStr);
      showToast(`Checked in successfully at ${timeStr}`);
    } else {
      setIsCheckedIn(false);
      setCheckInTimeStr(null);
      showToast(`Checked out successfully. Work session recorded.`);
    }
  };

  const approveLeaveRequest = (id: string) => {
    setLeaveRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'Approved' } : r))
    );
    setPendingApprovals(prev =>
      prev.map(p => (p.leaveRequestId === id ? { ...p, status: 'Approved' } : p))
    );
    showToast(`Leave Request ${id} approved by HR Manager.`);
    setInspectingLeaveId(null);
  };

  const rejectLeaveRequest = (id: string) => {
    setLeaveRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'Rejected' } : r))
    );
    setPendingApprovals(prev =>
      prev.map(p => (p.leaveRequestId === id ? { ...p, status: 'Rejected' } : p))
    );
    showToast(`Leave Request ${id} rejected.`);
    setInspectingLeaveId(null);
  };

  const submitNewLeaveRequest = (req: Omit<LeaveRequest, 'id' | 'submittedAt' | 'status' | 'impact'>) => {
    const newId = `LR-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newReq: LeaveRequest = {
      ...req,
      id: newId,
      status: 'Pending',
      submittedAt: 'Just now',
      impact: {
        teamAvailabilityPct: 68,
        previousAvailabilityPct: 85,
        criticalSkillsAffected: 1,
        activeProjectsCount: 2,
        workloadImpact: 'MEDIUM',
        teamMembersOnLeave: 1,
        explanation: `Submitting this leave reduces ${req.department} team availability to 68%. Workload reassignment advised.`,
        affectedTeamMembers: [
          { name: 'Sneha Reddy', role: 'Team Colleague', skills: ['Collaboration'], currentWorkload: 'Normal' }
        ],
        affectedProjects: ['Sprint Deliverables Q2'],
        suggestedActions: [
          'Notify Project Lead',
          'Ensure task handoff before leave start'
        ]
      }
    };

    setLeaveRequests(prev => [newReq, ...prev]);

    // Also add to pending approvals for HR
    const newPA: PendingApproval = {
      id: `PA-${Math.floor(10 + Math.random() * 90)}`,
      type: 'Leave Request',
      employeeName: req.employeeName,
      department: req.department,
      details: `${req.leaveType} — ${req.daysCount} Day(s) (${req.startDate} – ${req.endDate})`,
      date: req.startDate,
      status: 'Pending',
      leaveRequestId: newId
    };
    setPendingApprovals(prev => [newPA, ...prev]);
    setIsApplyLeaveModalOpen(false);
    showToast(`Leave request submitted. Instant Leave Impact Analysis generated.`);
  };

  const addImportantDate = (dateItem: Omit<ImportantDate, 'id'>) => {
    const newId = `EVT-${Math.floor(10 + Math.random() * 90)}`;
    setImportantDates(prev => [{ ...dateItem, id: newId }, ...prev]);
    setIsAddDateModalOpen(false);
    showToast(`New important date "${dateItem.title}" added.`);
  };

  const postAnnouncement = (anc: Omit<Announcement, 'id' | 'timeAgo' | 'postedBy'>) => {
    const newId = `ANC-${Math.floor(10 + Math.random() * 90)}`;
    setAnnouncements(prev => [
      {
        ...anc,
        id: newId,
        timeAgo: 'Just now',
        postedBy: role === 'hr_manager' ? 'Priya Sharma (HR Team)' : 'HR Operations'
      },
      ...prev
    ]);
    setIsAddAnnouncementModalOpen(false);
    showToast(`Announcement published to workforce.`);
  };

  const resolveAlert = (id: string) => {
    setAttentionAlerts(prev => prev.filter(a => a.id !== id));
    showToast(`Alert resolved and moved to archived insights.`);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeTab,
        setActiveTab,
        employees,
        leaveRequests,
        attentionAlerts,
        riskHeatmap,
        importantDates,
        announcements,
        pendingApprovals,
        attendanceLogs,
        inspectingLeaveId,
        setInspectingLeaveId,
        inspectingEmployeeId,
        setInspectingEmployeeId,
        isAddDateModalOpen,
        setIsAddDateModalOpen,
        isAddAnnouncementModalOpen,
        setIsAddAnnouncementModalOpen,
        isApplyLeaveModalOpen,
        setIsApplyLeaveModalOpen,
        isCheckedIn,
        checkInTimeStr,
        toggleCheckIn,
        approveLeaveRequest,
        rejectLeaveRequest,
        submitNewLeaveRequest,
        addImportantDate,
        postAnnouncement,
        resolveAlert,
        toastMsg,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
