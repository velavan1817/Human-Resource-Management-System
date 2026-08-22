export type Role = 'hr_manager' | 'employee';

export type LeaveType = 'Casual Leave' | 'Sick Leave' | 'Earned Leave' | 'Maternity Leave' | 'Paternity Leave';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Request Changes';

export interface AffectedTeamMember {
  name: string;
  role: string;
  skills: string[];
  currentWorkload: 'High' | 'Normal' | 'Critical';
}

export interface LeaveImpact {
  teamAvailabilityPct: number; // e.g. 62
  previousAvailabilityPct: number; // e.g. 78
  criticalSkillsAffected: number;
  activeProjectsCount: number;
  workloadImpact: 'HIGH' | 'MEDIUM' | 'LOW';
  teamMembersOnLeave: number;
  explanation: string;
  affectedTeamMembers: AffectedTeamMember[];
  affectedProjects: string[];
  suggestedActions: string[];
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: LeaveStatus;
  submittedAt: string;
  impact: LeaveImpact;
}

export interface Employee {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: Role;
  designation: string;
  department: string;
  joiningDate: string;
  phone: string;
  location: string;
  status: 'Present' | 'On Leave' | 'Absent' | 'Half Day';
  attendancePct: number;
  casualLeaveBal: { used: number; total: number };
  sickLeaveBal: { used: number; total: number };
  earnedLeaveBal: { used: number; total: number };
  salary: {
    basic: number;
    hra: number;
    specialAllowance: number;
    deductions: number;
    net: number;
  };
  skills: string[];
  workloadScore: 'High' | 'Medium' | 'Normal';
  avatarGradient?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'Late' | 'Absent' | 'Half Day';
  overtimeHours: number;
  lateArrival: boolean;
  anomalyFlag?: string;
}

export interface HRAttentionAlert {
  id: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'Availability' | 'Attendance Pattern' | 'Leave Concentration' | 'Overtime Spike' | 'Burnout Risk';
  title: string;
  summary: string;
  department: string;
  impactLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  evidenceText: string;
  recommendedAction: string;
  status: 'Active' | 'Investigating' | 'Resolved';
  createdAt: string;
  affectedCount?: number;
}

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface WorkforceRiskItem {
  department: string;
  thisWeek: RiskLevel;
  nextWeek: RiskLevel;
  twoWeeksOut: RiskLevel;
  notes: string;
}

export interface ImportantDate {
  id: string;
  title: string;
  date: string;
  daysLeft: number;
  category: 'Company Events' | 'Payroll' | 'Performance Reviews' | 'Benefits' | 'Holidays' | 'Compliance' | 'Meetings';
  description: string;
  priority: 'High' | 'Medium' | 'Normal';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  postedBy: string;
  timeAgo: string;
  priority: 'Important' | 'Normal';
  category: 'Policy' | 'Holiday' | 'Event' | 'General';
}

export interface PendingApproval {
  id: string;
  type: 'Leave Request' | 'Overtime Claim' | 'Document Request' | 'Attendance Correction';
  employeeName: string;
  department: string;
  details: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  leaveRequestId?: string;
}
