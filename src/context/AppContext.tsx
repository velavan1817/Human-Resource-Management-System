import React, { createContext, useContext, useState, useCallback } from 'react';
import type {
  Role,
  Employee,
  LeaveRequest,
  HRAttentionAlert,
  WorkforceRiskItem,
  ImportantDate,
  Announcement,
  PendingApproval,
  AttendanceRecord,
} from '../types';
import { WORKFORCE_RISK_HEATMAP } from '../data/initialData';
import {
  useEmployees,
  useLeaveRequests,
  useAttendanceLogs,
  useHRAlerts,
  useImportantDates,
  useAnnouncements,
  usePendingApprovals,
} from '../hooks/useSupabase';

// ---------------------------------------------------------------------------
// Context type
// ---------------------------------------------------------------------------
interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Data
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  attentionAlerts: HRAttentionAlert[];
  riskHeatmap: WorkforceRiskItem[];
  importantDates: ImportantDate[];
  announcements: Announcement[];
  pendingApprovals: PendingApproval[];
  attendanceLogs: AttendanceRecord[];

  // Loading / error state
  isLoading: boolean;
  dbError: string | null;

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

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>('hr_manager');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // ── Supabase hooks ──────────────────────────────────────────────────────
  const { employees, loading: empLoading, error: empError } = useEmployees();

  const {
    leaveRequests,
    loading: lrLoading,
    error: lrError,
    approveLeaveRequest: dbApprove,
    rejectLeaveRequest: dbReject,
    submitNewLeaveRequest: dbSubmit,
  } = useLeaveRequests();

  const { attendanceLogs, loading: attLoading, error: attError } = useAttendanceLogs();
  const { attentionAlerts, loading: alertLoading, error: alertError, resolveAlert: dbResolve } = useHRAlerts();
  const { importantDates, loading: datesLoading, error: datesError, addImportantDate: dbAddDate } = useImportantDates();
  const { announcements, loading: ancLoading, error: ancError, postAnnouncement: dbPost } = useAnnouncements();
  const { pendingApprovals, syncApprovalStatus } = usePendingApprovals();

  // Static data (no DB table needed — purely computed from initialData)
  const riskHeatmap: WorkforceRiskItem[] = WORKFORCE_RISK_HEATMAP;

  // Combined loading / error states
  const isLoading = empLoading || lrLoading || attLoading || alertLoading || datesLoading || ancLoading;
  const dbError = empError || lrError || attError || alertError || datesError || ancError || null;

  // ── Modal state ─────────────────────────────────────────────────────────
  const [inspectingLeaveId, setInspectingLeaveId] = useState<string | null>(null);
  const [inspectingEmployeeId, setInspectingEmployeeId] = useState<string | null>(null);
  const [isAddDateModalOpen, setIsAddDateModalOpen] = useState<boolean>(false);
  const [isAddAnnouncementModalOpen, setIsAddAnnouncementModalOpen] = useState<boolean>(false);
  const [isApplyLeaveModalOpen, setIsApplyLeaveModalOpen] = useState<boolean>(false);

  // ── Check-in state ──────────────────────────────────────────────────────
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(false);
  const [checkInTimeStr, setCheckInTimeStr] = useState<string | null>(null);

  // ── Toast ───────────────────────────────────────────────────────────────
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 4000);
  }, []);

  // ── Role switch ─────────────────────────────────────────────────────────
  const setRole = useCallback((newRole: Role) => {
    setRoleState(newRole);
    setActiveTab('dashboard');
    showToast(`Switched view to ${newRole === 'hr_manager' ? 'HR Manager' : 'Employee Portal'}`);
  }, [showToast]);

  // ── Check in / out ──────────────────────────────────────────────────────
  const toggleCheckIn = useCallback(() => {
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
  }, [isCheckedIn, showToast]);

  // ── Leave actions ───────────────────────────────────────────────────────
  const approveLeaveRequest = useCallback(async (id: string) => {
    await dbApprove(id);
    syncApprovalStatus(id, 'Approved');
    showToast(`Leave Request ${id} approved by HR Manager.`);
    setInspectingLeaveId(null);
  }, [dbApprove, syncApprovalStatus, showToast]);

  const rejectLeaveRequest = useCallback(async (id: string) => {
    await dbReject(id);
    syncApprovalStatus(id, 'Rejected');
    showToast(`Leave Request ${id} rejected.`);
    setInspectingLeaveId(null);
  }, [dbReject, syncApprovalStatus, showToast]);

  const submitNewLeaveRequest = useCallback(
    async (req: Omit<LeaveRequest, 'id' | 'submittedAt' | 'status' | 'impact'>) => {
      await dbSubmit(req);
      setIsApplyLeaveModalOpen(false);
      showToast(`Leave request submitted. Instant Leave Impact Analysis generated.`);
    },
    [dbSubmit, showToast]
  );

  // ── Date / Announcement / Alert actions ─────────────────────────────────
  const addImportantDate = useCallback(async (dateItem: Omit<ImportantDate, 'id'>) => {
    await dbAddDate(dateItem);
    setIsAddDateModalOpen(false);
    showToast(`New important date "${dateItem.title}" added.`);
  }, [dbAddDate, showToast]);

  const postAnnouncement = useCallback(
    async (anc: Omit<Announcement, 'id' | 'timeAgo' | 'postedBy'>) => {
      const postedBy = role === 'hr_manager' ? 'Priya Sharma (HR Team)' : 'HR Operations';
      await dbPost(anc, postedBy);
      setIsAddAnnouncementModalOpen(false);
      showToast(`Announcement published to workforce.`);
    },
    [dbPost, role, showToast]
  );

  const resolveAlert = useCallback(async (id: string) => {
    await dbResolve(id);
    showToast(`Alert resolved and moved to archived insights.`);
  }, [dbResolve, showToast]);

  // ── Render ──────────────────────────────────────────────────────────────
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
        isLoading,
        dbError,
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
        showToast,
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
