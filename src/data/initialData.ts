import {
  Employee,
  LeaveRequest,
  HRAttentionAlert,
  WorkforceRiskItem,
  ImportantDate,
  Announcement,
  PendingApproval,
  AttendanceRecord
} from '../types';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-101',
    name: 'Arjun Mehta',
    initials: 'AM',
    email: 'arjun.mehta@dayflow.io',
    role: 'employee',
    designation: 'Senior Backend Developer',
    department: 'Backend',
    joiningDate: '15 Jan 2022',
    phone: '+91 98765 43210',
    location: 'Bangalore HQ',
    status: 'Present',
    attendancePct: 94.2,
    casualLeaveBal: { used: 4, total: 12 },
    sickLeaveBal: { used: 6, total: 12 },
    earnedLeaveBal: { used: 5, total: 15 },
    salary: {
      basic: 65000,
      hra: 26000,
      specialAllowance: 19000,
      deductions: 10000,
      net: 100000
    },
    skills: ['Node.js', 'PostgreSQL', 'Microservices', 'Redis', 'Python'],
    workloadScore: 'High',
    avatarGradient: 'linear-gradient(135deg, #375DFB, #6D5EF0)'
  },
  {
    id: 'EMP-102',
    name: 'Priya Sharma',
    initials: 'PS',
    email: 'priya.sharma@dayflow.io',
    role: 'hr_manager',
    designation: 'Head of HR Operations',
    department: 'Human Resources',
    joiningDate: '01 Mar 2020',
    phone: '+91 98123 45678',
    location: 'Bangalore HQ',
    status: 'Present',
    attendancePct: 98.5,
    casualLeaveBal: { used: 2, total: 12 },
    sickLeaveBal: { used: 1, total: 12 },
    earnedLeaveBal: { used: 3, total: 15 },
    salary: {
      basic: 80000,
      hra: 32000,
      specialAllowance: 23000,
      deductions: 15000,
      net: 120000
    },
    skills: ['Talent Ops', 'Conflict Resolution', 'Strategic HR', 'Compliance'],
    workloadScore: 'Medium',
    avatarGradient: 'linear-gradient(135deg, #1AA6A0, #375DFB)'
  },
  {
    id: 'EMP-103',
    name: 'Vikram Singh',
    initials: 'VS',
    email: 'vikram.singh@dayflow.io',
    role: 'employee',
    designation: 'Lead Backend Engineer',
    department: 'Backend',
    joiningDate: '10 Feb 2021',
    phone: '+91 99887 76655',
    location: 'Bangalore HQ',
    status: 'Present',
    attendancePct: 96.0,
    casualLeaveBal: { used: 3, total: 12 },
    sickLeaveBal: { used: 2, total: 12 },
    earnedLeaveBal: { used: 4, total: 15 },
    salary: {
      basic: 75000,
      hra: 30000,
      specialAllowance: 25000,
      deductions: 12000,
      net: 118000
    },
    skills: ['System Design', 'PostgreSQL', 'Golang', 'Docker'],
    workloadScore: 'High',
    avatarGradient: 'linear-gradient(135deg, #D6A94A, #F0C878)'
  },
  {
    id: 'EMP-104',
    name: 'Sneha Reddy',
    initials: 'SR',
    email: 'sneha.reddy@dayflow.io',
    role: 'employee',
    designation: 'Senior UI/UX Designer',
    department: 'Product Design',
    joiningDate: '01 Jun 2022',
    phone: '+91 97766 55443',
    location: 'Remote',
    status: 'Present',
    attendancePct: 92.0,
    casualLeaveBal: { used: 5, total: 12 },
    sickLeaveBal: { used: 4, total: 12 },
    earnedLeaveBal: { used: 6, total: 15 },
    salary: {
      basic: 60000,
      hra: 24000,
      specialAllowance: 16000,
      deductions: 8000,
      net: 92000
    },
    skills: ['Figma', 'User Research', 'Design Systems', 'Prototyping'],
    workloadScore: 'Medium',
    avatarGradient: 'linear-gradient(135deg, #12875A, #1AA6A0)'
  },
  {
    id: 'EMP-105',
    name: 'Meera Iyer',
    initials: 'MI',
    email: 'meera.iyer@dayflow.io',
    role: 'employee',
    designation: 'QA Automation Lead',
    department: 'QA',
    joiningDate: '12 Aug 2021',
    phone: '+91 96655 44332',
    location: 'Bangalore HQ',
    status: 'On Leave',
    attendancePct: 89.4,
    casualLeaveBal: { used: 7, total: 12 },
    sickLeaveBal: { used: 3, total: 12 },
    earnedLeaveBal: { used: 8, total: 15 },
    salary: {
      basic: 58000,
      hra: 23200,
      specialAllowance: 14800,
      deductions: 7000,
      net: 89000
    },
    skills: ['Playwright', 'Jest', 'Cypress', 'API Testing'],
    workloadScore: 'Medium',
    avatarGradient: 'linear-gradient(135deg, #6D5EF0, #9C90F8)'
  },
  {
    id: 'EMP-106',
    name: 'Rohan Das',
    initials: 'RD',
    email: 'rohan.das@dayflow.io',
    role: 'employee',
    designation: 'DevOps & Cloud Engineer',
    department: 'DevOps',
    joiningDate: '20 Sep 2022',
    phone: '+91 95544 33221',
    location: 'Bangalore HQ',
    status: 'Absent',
    attendancePct: 86.8,
    casualLeaveBal: { used: 6, total: 12 },
    sickLeaveBal: { used: 5, total: 12 },
    earnedLeaveBal: { used: 2, total: 15 },
    salary: {
      basic: 62000,
      hra: 24800,
      specialAllowance: 18200,
      deductions: 9000,
      net: 96000
    },
    skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD Pipelines'],
    workloadScore: 'High',
    avatarGradient: 'linear-gradient(135deg, #C6403C, #E37F7B)'
  }
];

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'LR-2026-089',
    employeeId: 'EMP-101',
    employeeName: 'Arjun Mehta',
    role: 'Senior Backend Developer',
    department: 'Backend',
    leaveType: 'Casual Leave',
    startDate: '15 May 2026',
    endDate: '18 May 2026',
    daysCount: 4,
    reason: 'Family event and personal travel',
    status: 'Pending',
    submittedAt: '2 hours ago',
    impact: {
      teamAvailabilityPct: 62,
      previousAvailabilityPct: 78,
      criticalSkillsAffected: 2,
      activeProjectsCount: 3,
      workloadImpact: 'HIGH',
      teamMembersOnLeave: 2,
      explanation: 'Approving this request may reduce backend team availability below the recommended threshold (70%). Two other backend developers are already scheduled on leave.',
      affectedTeamMembers: [
        { name: 'Vikram Singh', role: 'Lead Backend Engineer', skills: ['System Design', 'PostgreSQL'], currentWorkload: 'Critical' },
        { name: 'Karan Verma', role: 'Junior Dev', skills: ['Node.js API'], currentWorkload: 'High' }
      ],
      affectedProjects: [
        'Core Payment Gateway Integration (Deadline: May 22)',
        'Auth & Token Security Migration',
        'Database Sharding Sprint 4'
      ],
      suggestedActions: [
        'Reassign payment gateway testing tasks to Vikram Singh',
        'Notify Payment Project Manager (Rahul Kapoor)',
        'Assign backup resource for high-priority API bugs',
        'Consider schedule adjustment or partial leave request'
      ]
    }
  },
  {
    id: 'LR-2026-090',
    employeeId: 'EMP-104',
    employeeName: 'Sneha Reddy',
    role: 'Senior UI/UX Designer',
    department: 'Product Design',
    leaveType: 'Sick Leave',
    startDate: '22 May 2026',
    endDate: '23 May 2026',
    daysCount: 2,
    reason: 'Medical checkup and rest',
    status: 'Pending',
    submittedAt: '5 hours ago',
    impact: {
      teamAvailabilityPct: 75,
      previousAvailabilityPct: 100,
      criticalSkillsAffected: 1,
      activeProjectsCount: 2,
      workloadImpact: 'MEDIUM',
      teamMembersOnLeave: 0,
      explanation: 'Design team coverage remains acceptable at 75%. Design system review can be postponed by 1 day.',
      affectedTeamMembers: [
        { name: 'Ananya Gupta', role: 'UI Designer', skills: ['Figma'], currentWorkload: 'Normal' }
      ],
      affectedProjects: ['Design System 2.0 Tokens', 'Mobile App Check-in Flow'],
      suggestedActions: [
        'Pause Figma design review meeting',
        'Notify Product Manager'
      ]
    }
  },
  {
    id: 'LR-2026-085',
    employeeId: 'EMP-105',
    employeeName: 'Meera Iyer',
    role: 'QA Automation Lead',
    department: 'QA',
    leaveType: 'Earned Leave',
    startDate: '24 May 2026',
    endDate: '25 May 2026',
    daysCount: 2,
    reason: 'Personal time off',
    status: 'Approved',
    submittedAt: '1 day ago',
    impact: {
      teamAvailabilityPct: 80,
      previousAvailabilityPct: 100,
      criticalSkillsAffected: 1,
      activeProjectsCount: 1,
      workloadImpact: 'LOW',
      teamMembersOnLeave: 0,
      explanation: 'QA team capacity is sufficient with low impact on active release schedules.',
      affectedTeamMembers: [],
      affectedProjects: ['QA Regression Testing Suite'],
      suggestedActions: ['Automated test run scheduled in CI/CD']
    }
  }
];

export const INITIAL_ATTENTION_ALERTS: HRAttentionAlert[] = [
  {
    id: 'ALT-101',
    priority: 'HIGH',
    category: 'Availability',
    title: 'Backend Team — Low Availability Risk',
    summary: 'Only 62% availability next week due to overlapping leave requests.',
    department: 'Backend',
    impactLevel: 'HIGH',
    evidenceText: '3 out of 8 backend engineers requested or are on approved leave between May 15 and May 18. Critical projects pending release.',
    recommendedAction: 'Review Arjun Mehta\'s pending leave request and consult Backend Lead Vikram Singh regarding task reassignments.',
    status: 'Active',
    createdAt: '1 hour ago',
    affectedCount: 3
  },
  {
    id: 'ALT-102',
    priority: 'MEDIUM',
    category: 'Attendance Pattern',
    title: 'Attendance Pattern Change — Late Arrival Frequency',
    summary: '35% increase in late arrivals over the last 4 weeks (6 employees late 4+ times).',
    department: 'Engineering & QA',
    impactLevel: 'MEDIUM',
    evidenceText: '6 employees (including 3 in Engineering) recorded late check-ins on 4 separate days in 2 weeks. Pattern concentrated on Mondays and Fridays.',
    recommendedAction: 'Schedule a check-in with department managers to review commute or remote work flex-hours.',
    status: 'Active',
    createdAt: '3 hours ago',
    affectedCount: 6
  },
  {
    id: 'ALT-103',
    priority: 'MEDIUM',
    category: 'Leave Concentration',
    title: 'Multiple Leave Requests — Same Day',
    summary: '5 team members across Engineering and QA requesting leave on May 26.',
    department: 'Cross-Department',
    impactLevel: 'MEDIUM',
    evidenceText: '5 employees submitted leave requests for May 26 (post-holiday bridge day). Potential impact on client release support.',
    recommendedAction: 'Review on-call coverage for May 26 before approving remaining pending requests.',
    status: 'Active',
    createdAt: '1 day ago',
    affectedCount: 5
  },
  {
    id: 'ALT-104',
    priority: 'LOW',
    category: 'Overtime Spike',
    title: 'DevOps Overtime Spike Detected',
    summary: 'DevOps team logged 34 hours of overtime this week (+42% increase).',
    department: 'DevOps',
    impactLevel: 'LOW',
    evidenceText: 'Cloud infrastructure migration resulted in late-night deployments for 2 engineers.',
    recommendedAction: 'Ensure compensatory off is granted to DevOps team after deployment completion.',
    status: 'Active',
    createdAt: '2 days ago',
    affectedCount: 2
  }
];

export const WORKFORCE_RISK_HEATMAP: WorkforceRiskItem[] = [
  { department: 'Backend', thisWeek: 'High', nextWeek: 'High', twoWeeksOut: 'Medium', notes: '62% availability next week due to leaves' },
  { department: 'Frontend', thisWeek: 'Low', nextWeek: 'Medium', twoWeeksOut: 'Low', notes: 'Sprint release on May 25' },
  { department: 'QA', thisWeek: 'Low', nextWeek: 'Low', twoWeeksOut: 'Medium', notes: 'Automation test cycles normal' },
  { department: 'DevOps', thisWeek: 'Medium', nextWeek: 'Low', twoWeeksOut: 'Low', notes: 'Cloud migration overtime wrap-up' },
  { department: 'Design', thisWeek: 'Low', nextWeek: 'Medium', twoWeeksOut: 'Low', notes: 'Design token rollout' },
  { department: 'Support', thisWeek: 'Low', nextWeek: 'Low', twoWeeksOut: 'Low', notes: '100% team availability' }
];

export const INITIAL_IMPORTANT_DATES: ImportantDate[] = [
  {
    id: 'EVT-01',
    title: 'Company Foundation Day',
    date: '24 May 2026',
    daysLeft: 3,
    category: 'Company Events',
    description: 'Annual day celebrations and team awards at Main Auditorium.',
    priority: 'High'
  },
  {
    id: 'EVT-02',
    title: 'Monthly Payroll Processing',
    date: '31 May 2026',
    daysLeft: 10,
    category: 'Payroll',
    description: 'Final salary approval cutoff and direct deposit execution.',
    priority: 'High'
  },
  {
    id: 'EVT-03',
    title: 'Q1 Performance Review Cycle',
    date: '10 June 2026',
    daysLeft: 20,
    category: 'Performance Reviews',
    description: 'Manager feedback forms and self-assessment portal opens.',
    priority: 'Medium'
  },
  {
    id: 'EVT-04',
    title: 'Group Health Insurance Premium Due',
    date: '15 June 2026',
    daysLeft: 25,
    category: 'Benefits',
    description: 'Annual corporate health policy renewal documentation.',
    priority: 'Normal'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ANC-01',
    title: 'Office Holiday Announcement — Republic Day',
    content: 'The office will remain closed on Monday, 26 May 2026 on account of Republic Day. Emergency support rosters will apply.',
    postedBy: 'Priya Sharma (HR Team)',
    timeAgo: '2 hours ago',
    priority: 'Important',
    category: 'Holiday'
  },
  {
    id: 'ANC-02',
    title: 'Q1 Performance Review Timeline',
    content: 'The Q1 Performance Review process will officially begin on 10 June. Please ensure all project goal logs are updated by 5 June.',
    postedBy: 'Priya Sharma (HR Team)',
    timeAgo: '5 hours ago',
    priority: 'Normal',
    category: 'Policy'
  },
  {
    id: 'ANC-03',
    title: 'New Hybrid Work Policy Updated',
    content: 'Updated guidelines for work-from-home requests have been published under Documents. Maximum 2 remote days per week without prior manager approval.',
    postedBy: 'HR Operations',
    timeAgo: '2 days ago',
    priority: 'Normal',
    category: 'Policy'
  }
];

export const INITIAL_PENDING_APPROVALS: PendingApproval[] = [
  {
    id: 'PA-01',
    type: 'Leave Request',
    employeeName: 'Arjun Mehta',
    department: 'Backend',
    details: 'Casual Leave — 4 Days (15 May – 18 May)',
    date: '15 May 2026',
    status: 'Pending',
    leaveRequestId: 'LR-2026-089'
  },
  {
    id: 'PA-02',
    type: 'Leave Request',
    employeeName: 'Sneha Reddy',
    department: 'Product Design',
    details: 'Sick Leave — 2 Days (22 May – 23 May)',
    date: '22 May 2026',
    status: 'Pending',
    leaveRequestId: 'LR-2026-090'
  },
  {
    id: 'PA-03',
    type: 'Overtime Claim',
    employeeName: 'Rohan Das',
    department: 'DevOps',
    details: '14.5 Hours Cloud Migration Overtime',
    date: '18 May 2026',
    status: 'Pending'
  },
  {
    id: 'PA-04',
    type: 'Attendance Correction',
    employeeName: 'Vikram Singh',
    department: 'Backend',
    details: 'Missed Check-out due to VPN outage (14 May)',
    date: '14 May 2026',
    status: 'Pending'
  },
  {
    id: 'PA-05',
    type: 'Document Request',
    employeeName: 'Meera Iyer',
    department: 'QA',
    details: 'Employment Verification Letter for Visa',
    date: '19 May 2026',
    status: 'Pending'
  }
];

export const INITIAL_ATTENDANCE_LOGS: AttendanceRecord[] = [
  { id: 'ATT-01', employeeId: 'EMP-101', employeeName: 'Arjun Mehta', department: 'Backend', date: '20 May 2026', checkIn: '09:12 AM', checkOut: '06:30 PM', status: 'Present', overtimeHours: 0, lateArrival: false },
  { id: 'ATT-02', employeeId: 'EMP-103', employeeName: 'Vikram Singh', department: 'Backend', date: '20 May 2026', checkIn: '09:05 AM', checkOut: '07:15 PM', status: 'Present', overtimeHours: 1.25, lateArrival: false },
  { id: 'ATT-03', employeeId: 'EMP-104', employeeName: 'Sneha Reddy', department: 'Product Design', date: '20 May 2026', checkIn: '09:45 AM', checkOut: '06:15 PM', status: 'Late', overtimeHours: 0, lateArrival: true, anomalyFlag: '3rd Late Arrival this month' },
  { id: 'ATT-04', employeeId: 'EMP-105', employeeName: 'Meera Iyer', department: 'QA', date: '20 May 2026', checkIn: '-', checkOut: '-', status: 'Absent', overtimeHours: 0, lateArrival: false, anomalyFlag: 'Unplanned Absence' },
  { id: 'ATT-05', employeeId: 'EMP-106', employeeName: 'Rohan Das', department: 'DevOps', date: '20 May 2026', checkIn: '10:15 AM', checkOut: '08:45 PM', status: 'Late', overtimeHours: 2.5, lateArrival: true, anomalyFlag: '4th Late Arrival in 2 weeks' }
];
