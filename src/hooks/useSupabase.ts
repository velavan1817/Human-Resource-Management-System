/**
 * useSupabase.ts
 * 
 * Custom React hooks that wrap all Supabase database operations.
 * Each hook fetches data on mount and exposes mutation helpers
 * that write back to Supabase and keep local state in sync.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type {
  Employee,
  LeaveRequest,
  LeaveImpact,
  AttendanceRecord,
  HRAttentionAlert,
  ImportantDate,
  Announcement,
  PendingApproval,
} from '../types';

// ---------------------------------------------------------------------------
// Generic helpers
// ---------------------------------------------------------------------------

/** Convert snake_case DB row → camelCase Employee */
function rowToEmployee(row: Record<string, unknown>): Employee {
  return {
    id: row.id as string,
    name: row.name as string,
    initials: row.initials as string,
    email: row.email as string,
    role: row.role as Employee['role'],
    designation: row.designation as string,
    department: row.department as string,
    joiningDate: row.joining_date as string,
    phone: row.phone as string,
    location: row.location as string,
    status: row.status as Employee['status'],
    attendancePct: Number(row.attendance_pct),
    casualLeaveBal: { used: 0, total: 12 },   // filled in by useEmployees join
    sickLeaveBal: { used: 0, total: 12 },
    earnedLeaveBal: { used: 0, total: 15 },
    salary: {
      basic: Number(row.salary_basic),
      hra: Number(row.salary_hra),
      specialAllowance: Number(row.salary_special),
      deductions: Number(row.salary_deductions),
      net: Number(row.salary_net),
    },
    skills: (row.skills as string[]) ?? [],
    workloadScore: row.workload_score as Employee['workloadScore'],
    avatarGradient: row.avatar_gradient as string | undefined,
  };
}

function rowToLeaveRequest(row: Record<string, unknown>, impact?: LeaveImpact): LeaveRequest {
  return {
    id: row.id as string,
    employeeId: row.employee_id as string,
    employeeName: row.employee_name as string,
    role: row.role as string,
    department: row.department as string,
    leaveType: row.leave_type as LeaveRequest['leaveType'],
    startDate: row.start_date as string,
    endDate: row.end_date as string,
    daysCount: Number(row.days_count),
    reason: row.reason as string,
    status: row.status as LeaveRequest['status'],
    submittedAt: row.submitted_at as string,
    impact: impact ?? {
      teamAvailabilityPct: 0,
      previousAvailabilityPct: 0,
      criticalSkillsAffected: 0,
      activeProjectsCount: 0,
      workloadImpact: 'LOW',
      teamMembersOnLeave: 0,
      explanation: '',
      affectedTeamMembers: [],
      affectedProjects: [],
      suggestedActions: [],
    },
  };
}

function rowToImpact(row: Record<string, unknown>): LeaveImpact {
  return {
    teamAvailabilityPct: Number(row.team_availability_pct),
    previousAvailabilityPct: Number(row.previous_availability_pct),
    criticalSkillsAffected: Number(row.critical_skills_affected),
    activeProjectsCount: Number(row.active_projects_count),
    workloadImpact: row.workload_impact as LeaveImpact['workloadImpact'],
    teamMembersOnLeave: Number(row.team_members_on_leave),
    explanation: row.explanation as string,
    affectedTeamMembers: (row.affected_team_members as LeaveImpact['affectedTeamMembers']) ?? [],
    affectedProjects: (row.affected_projects as string[]) ?? [],
    suggestedActions: (row.suggested_actions as string[]) ?? [],
  };
}

function rowToAttendance(row: Record<string, unknown>): AttendanceRecord {
  return {
    id: row.id as string,
    employeeId: row.employee_id as string,
    employeeName: row.employee_name as string,
    department: row.department as string,
    date: row.date as string,
    checkIn: row.check_in as string,
    checkOut: row.check_out as string,
    status: row.status as AttendanceRecord['status'],
    overtimeHours: Number(row.overtime_hours),
    lateArrival: row.late_arrival as boolean,
    anomalyFlag: row.anomaly_flag as string | undefined,
  };
}

function rowToAlert(row: Record<string, unknown>): HRAttentionAlert {
  return {
    id: row.id as string,
    priority: row.priority as HRAttentionAlert['priority'],
    category: row.category as HRAttentionAlert['category'],
    title: row.title as string,
    summary: row.summary as string,
    department: row.department as string,
    impactLevel: row.impact_level as HRAttentionAlert['impactLevel'],
    evidenceText: row.evidence_text as string,
    recommendedAction: row.recommended_action as string,
    status: row.status as HRAttentionAlert['status'],
    createdAt: row.created_at as string,
    affectedCount: Number(row.affected_count),
  };
}

function rowToDate(row: Record<string, unknown>): ImportantDate {
  return {
    id: row.id as string,
    title: row.title as string,
    date: row.date as string,
    daysLeft: Number(row.days_left),
    category: row.category as ImportantDate['category'],
    description: row.description as string,
    priority: row.priority as ImportantDate['priority'],
  };
}

function rowToAnnouncement(row: Record<string, unknown>): Announcement {
  return {
    id: row.id as string,
    title: row.title as string,
    content: row.content as string,
    postedBy: row.posted_by as string,
    timeAgo: row.time_ago as string,
    priority: row.priority as Announcement['priority'],
    category: row.category as Announcement['category'],
  };
}

function rowToApproval(row: Record<string, unknown>): PendingApproval {
  return {
    id: row.id as string,
    type: row.type as PendingApproval['type'],
    employeeName: row.employee_name as string,
    department: row.department as string,
    details: row.details as string,
    date: row.date as string,
    status: row.status as PendingApproval['status'],
    leaveRequestId: row.leave_request_id as string | undefined,
  };
}

// ---------------------------------------------------------------------------
// useEmployees
// ---------------------------------------------------------------------------
export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data: empRows, error: empError } = await supabase
      .from('employees')
      .select('*')
      .order('id');
    if (empError) { setError(empError.message); setLoading(false); return; }

    const { data: balRows } = await supabase.from('leave_balance').select('*');
    const balMap = new Map((balRows ?? []).map((b) => [b.employee_id, b]));

    const mapped: Employee[] = (empRows ?? []).map((row) => {
      const emp = rowToEmployee(row as Record<string, unknown>);
      const bal = balMap.get(emp.id);
      if (bal) {
        emp.casualLeaveBal = { used: bal.casual_used, total: bal.casual_total };
        emp.sickLeaveBal = { used: bal.sick_used, total: bal.sick_total };
        emp.earnedLeaveBal = { used: bal.earned_used, total: bal.earned_total };
      }
      return emp;
    });
    setEmployees(mapped);
    setLoading(false);
  }, []);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  return { employees, loading, error, refetch: fetchEmployees };
}

// ---------------------------------------------------------------------------
// useLeaveRequests
// ---------------------------------------------------------------------------
export function useLeaveRequests() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaveRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data: lrRows, error: lrError } = await supabase
      .from('leave_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (lrError) { setError(lrError.message); setLoading(false); return; }

    const { data: impRows } = await supabase.from('leave_impact').select('*');
    const impMap = new Map((impRows ?? []).map((i) => [i.leave_request_id, i]));

    const mapped: LeaveRequest[] = (lrRows ?? []).map((row) => {
      const impRow = impMap.get(row.id);
      const impact = impRow ? rowToImpact(impRow as Record<string, unknown>) : undefined;
      return rowToLeaveRequest(row as Record<string, unknown>, impact);
    });
    setLeaveRequests(mapped);
    setLoading(false);
  }, []);

  useEffect(() => { fetchLeaveRequests(); }, [fetchLeaveRequests]);

  /** Approve a leave request — updates both leave_requests and pending_approvals */
  const approveLeaveRequest = useCallback(async (id: string) => {
    await supabase.from('leave_requests').update({ status: 'Approved' }).eq('id', id);
    await supabase.from('pending_approvals').update({ status: 'Approved' }).eq('leave_request_id', id);
    setLeaveRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r))
    );
  }, []);

  /** Reject a leave request */
  const rejectLeaveRequest = useCallback(async (id: string) => {
    await supabase.from('leave_requests').update({ status: 'Rejected' }).eq('id', id);
    await supabase.from('pending_approvals').update({ status: 'Rejected' }).eq('leave_request_id', id);
    setLeaveRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r))
    );
  }, []);

  /** Submit a new leave request (employee action) */
  const submitNewLeaveRequest = useCallback(
    async (req: Omit<LeaveRequest, 'id' | 'submittedAt' | 'status' | 'impact'>) => {
      const newId = `LR-2026-${Math.floor(100 + Math.random() * 900)}`;
      const newImpact: LeaveImpact = {
        teamAvailabilityPct: 68,
        previousAvailabilityPct: 85,
        criticalSkillsAffected: 1,
        activeProjectsCount: 2,
        workloadImpact: 'MEDIUM',
        teamMembersOnLeave: 1,
        explanation: `Submitting this leave reduces ${req.department} team availability to 68%. Workload reassignment advised.`,
        affectedTeamMembers: [{ name: 'Team Colleague', role: 'Colleague', skills: ['Collaboration'], currentWorkload: 'Normal' }],
        affectedProjects: ['Sprint Deliverables Q2'],
        suggestedActions: ['Notify Project Lead', 'Ensure task handoff before leave start'],
      };

      // Insert leave request
      await supabase.from('leave_requests').insert({
        id: newId,
        employee_id: req.employeeId,
        employee_name: req.employeeName,
        role: req.role,
        department: req.department,
        leave_type: req.leaveType,
        start_date: req.startDate,
        end_date: req.endDate,
        days_count: req.daysCount,
        reason: req.reason,
        status: 'Pending',
        submitted_at: 'Just now',
      });

      // Insert impact
      await supabase.from('leave_impact').insert({
        leave_request_id: newId,
        team_availability_pct: newImpact.teamAvailabilityPct,
        previous_availability_pct: newImpact.previousAvailabilityPct,
        critical_skills_affected: newImpact.criticalSkillsAffected,
        active_projects_count: newImpact.activeProjectsCount,
        workload_impact: newImpact.workloadImpact,
        team_members_on_leave: newImpact.teamMembersOnLeave,
        explanation: newImpact.explanation,
        affected_team_members: newImpact.affectedTeamMembers,
        affected_projects: newImpact.affectedProjects,
        suggested_actions: newImpact.suggestedActions,
      });

      // Insert pending approval
      const paId = `PA-${Math.floor(10 + Math.random() * 90)}`;
      await supabase.from('pending_approvals').insert({
        id: paId,
        type: 'Leave Request',
        employee_name: req.employeeName,
        department: req.department,
        details: `${req.leaveType} — ${req.daysCount} Day(s) (${req.startDate} – ${req.endDate})`,
        date: req.startDate,
        status: 'Pending',
        leave_request_id: newId,
      });

      // Optimistic local update
      const newReq: LeaveRequest = { ...req, id: newId, status: 'Pending', submittedAt: 'Just now', impact: newImpact };
      setLeaveRequests((prev) => [newReq, ...prev]);
    },
    []
  );

  return { leaveRequests, loading, error, approveLeaveRequest, rejectLeaveRequest, submitNewLeaveRequest, refetch: fetchLeaveRequests };
}

// ---------------------------------------------------------------------------
// useAttendanceLogs
// ---------------------------------------------------------------------------
export function useAttendanceLogs() {
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error: e } = await supabase
        .from('attendance_records')
        .select('*')
        .order('date', { ascending: false });
      if (e) { setError(e.message); } else {
        setAttendanceLogs((data ?? []).map((r) => rowToAttendance(r as Record<string, unknown>)));
      }
      setLoading(false);
    })();
  }, []);

  return { attendanceLogs, loading, error };
}

// ---------------------------------------------------------------------------
// useHRAlerts
// ---------------------------------------------------------------------------
export function useHRAlerts() {
  const [attentionAlerts, setAttentionAlerts] = useState<HRAttentionAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error: e } = await supabase
        .from('hr_attention_alerts')
        .select('*')
        .order('created_at', { ascending: false });
      if (e) { setError(e.message); } else {
        setAttentionAlerts((data ?? []).map((r) => rowToAlert(r as Record<string, unknown>)));
      }
      setLoading(false);
    })();
  }, []);

  const resolveAlert = useCallback(async (id: string) => {
    await supabase.from('hr_attention_alerts').update({ status: 'Resolved' }).eq('id', id);
    setAttentionAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return { attentionAlerts, loading, error, resolveAlert };
}

// ---------------------------------------------------------------------------
// useImportantDates
// ---------------------------------------------------------------------------
export function useImportantDates() {
  const [importantDates, setImportantDates] = useState<ImportantDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error: e } = await supabase
        .from('important_dates')
        .select('*')
        .order('created_at', { ascending: false });
      if (e) { setError(e.message); } else {
        setImportantDates((data ?? []).map((r) => rowToDate(r as Record<string, unknown>)));
      }
      setLoading(false);
    })();
  }, []);

  const addImportantDate = useCallback(async (dateItem: Omit<ImportantDate, 'id'>) => {
    const newId = `EVT-${Math.floor(10 + Math.random() * 90)}`;
    await supabase.from('important_dates').insert({
      id: newId,
      title: dateItem.title,
      date: dateItem.date,
      days_left: dateItem.daysLeft,
      category: dateItem.category,
      description: dateItem.description,
      priority: dateItem.priority,
    });
    setImportantDates((prev) => [{ ...dateItem, id: newId }, ...prev]);
  }, []);

  return { importantDates, loading, error, addImportantDate };
}

// ---------------------------------------------------------------------------
// useAnnouncements
// ---------------------------------------------------------------------------
export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error: e } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      if (e) { setError(e.message); } else {
        setAnnouncements((data ?? []).map((r) => rowToAnnouncement(r as Record<string, unknown>)));
      }
      setLoading(false);
    })();
  }, []);

  const postAnnouncement = useCallback(
    async (anc: Omit<Announcement, 'id' | 'timeAgo' | 'postedBy'>, postedBy: string) => {
      const newId = `ANC-${Math.floor(10 + Math.random() * 90)}`;
      await supabase.from('announcements').insert({
        id: newId,
        title: anc.title,
        content: anc.content,
        posted_by: postedBy,
        time_ago: 'Just now',
        priority: anc.priority,
        category: anc.category,
      });
      setAnnouncements((prev) => [
        { ...anc, id: newId, timeAgo: 'Just now', postedBy },
        ...prev,
      ]);
    },
    []
  );

  return { announcements, loading, error, postAnnouncement };
}

// ---------------------------------------------------------------------------
// usePendingApprovals
// ---------------------------------------------------------------------------
export function usePendingApprovals() {
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error: e } = await supabase
        .from('pending_approvals')
        .select('*')
        .order('created_at', { ascending: false });
      if (e) { setError(e.message); } else {
        setPendingApprovals((data ?? []).map((r) => rowToApproval(r as Record<string, unknown>)));
      }
      setLoading(false);
    })();
  }, []);

  /** Called by approveLeaveRequest / rejectLeaveRequest to sync local state */
  const syncApprovalStatus = useCallback((leaveRequestId: string, status: 'Approved' | 'Rejected') => {
    setPendingApprovals((prev) =>
      prev.map((p) => (p.leaveRequestId === leaveRequestId ? { ...p, status } : p))
    );
  }, []);

  return { pendingApprovals, loading, error, syncApprovalStatus };
}
