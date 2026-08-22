import { Employee, AttendanceRecord, LeaveRequest, PayrollRecord, NotificationItem } from '../types';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-001',
    empId: 'EMP001',
    name: 'Arun Kumar',
    email: 'employee@dayflow.com',
    phone: '+91 98450 12345',
    address: '42 Lotus Boulevard, Indiranagar, Bengaluru, Karnataka 560038',
    department: 'Engineering',
    position: 'Senior Full Stack Engineer',
    joiningDate: '2023-03-15',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
    status: 'active',
    role: 'employee',
    bio: 'Passionate full-stack developer specializing in scalable distributed architectures, TypeScript and React ecosystem.',
    emergencyContact: {
      name: 'Sunita Kumar',
      relationship: 'Spouse',
      phone: '+91 98450 99887'
    },
    salary: {
      basic: 48000,
      hra: 18000,
      allowances: 12000,
      taxDeduction: 5200,
      providentFund: 4800,
      otherDeductions: 1000,
      netSalary: 67000,
      currency: '₹'
    },
    documents: [
      { id: 'doc-1', title: 'Employment Contract - Arun Kumar', type: 'PDF', size: '2.4 MB', uploadDate: '2023-03-15', category: 'Contract' },
      { id: 'doc-2', title: 'National Identity Proof', type: 'PDF', size: '1.1 MB', uploadDate: '2023-03-16', category: 'Identity' },
      { id: 'doc-3', title: 'Form 16 Tax Certificate (FY 2025-26)', type: 'PDF', size: '890 KB', uploadDate: '2026-04-10', category: 'Tax' },
      { id: 'doc-4', title: 'AWS Solutions Architect Certificate', type: 'PDF', size: '3.2 MB', uploadDate: '2024-08-20', category: 'Certificate' }
    ]
  },
  {
    id: 'emp-002',
    empId: 'EMP002',
    name: 'Priya Sharma',
    email: 'admin@dayflow.com',
    phone: '+91 98110 54321',
    address: '108 Silver Oak Residency, HSR Layout, Bengaluru, Karnataka 560102',
    department: 'Human Resources',
    position: 'Chief People Officer / HR Lead',
    joiningDate: '2022-01-10',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80',
    status: 'active',
    role: 'admin',
    bio: 'People operations specialist building human-centric workplace culture, performance frameworks, and talent strategy.',
    emergencyContact: {
      name: 'Rohan Sharma',
      relationship: 'Brother',
      phone: '+91 98110 99881'
    },
    salary: {
      basic: 62000,
      hra: 24000,
      allowances: 16000,
      taxDeduction: 8400,
      providentFund: 6200,
      otherDeductions: 1400,
      netSalary: 86000,
      currency: '₹'
    },
    documents: [
      { id: 'doc-5', title: 'HR Director Contract - Priya Sharma', type: 'PDF', size: '2.1 MB', uploadDate: '2022-01-10', category: 'Contract' },
      { id: 'doc-6', title: 'Executive NDA & Code of Conduct', type: 'PDF', size: '950 KB', uploadDate: '2022-01-11', category: 'Identity' }
    ]
  },
  {
    id: 'emp-003',
    empId: 'EMP003',
    name: 'Rahul Menon',
    email: 'rahul.menon@dayflow.com',
    phone: '+91 97400 67890',
    address: '15 Palm Meadows, Whitefield, Bengaluru, Karnataka 560066',
    department: 'Finance & Accounting',
    position: 'Senior Financial Controller',
    joiningDate: '2022-07-01',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
    status: 'on_leave',
    role: 'employee',
    bio: 'Chartered Accountant overseeing fiscal health, internal audits, payroll compliance, and treasury operations.',
    emergencyContact: {
      name: 'Deepa Menon',
      relationship: 'Spouse',
      phone: '+91 97400 11223'
    },
    salary: {
      basic: 54000,
      hra: 20000,
      allowances: 14000,
      taxDeduction: 6800,
      providentFund: 5400,
      otherDeductions: 1800,
      netSalary: 74000,
      currency: '₹'
    },
    documents: [
      { id: 'doc-7', title: 'Employment Agreement', type: 'PDF', size: '1.8 MB', uploadDate: '2022-07-01', category: 'Contract' },
      { id: 'doc-8', title: 'CA License & Credentials', type: 'PDF', size: '2.8 MB', uploadDate: '2022-07-02', category: 'Certificate' }
    ]
  },
  {
    id: 'emp-004',
    empId: 'EMP004',
    name: 'Ananya Roy',
    email: 'ananya.roy@dayflow.com',
    phone: '+91 96320 45678',
    address: '89 Orchid Enclave, Koramangala 4th Block, Bengaluru 560034',
    department: 'Product & Design',
    position: 'Lead Product Designer',
    joiningDate: '2023-06-18',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240&auto=format&fit=crop&q=80',
    status: 'active',
    role: 'employee',
    bio: 'Designing intuitive digital products with focus on micro-interactions, accessibility, and design system scale.',
    emergencyContact: {
      name: 'Soumitra Roy',
      relationship: 'Father',
      phone: '+91 96320 77889'
    },
    salary: {
      basic: 52000,
      hra: 19000,
      allowances: 13000,
      taxDeduction: 6200,
      providentFund: 5200,
      otherDeductions: 1600,
      netSalary: 71000,
      currency: '₹'
    },
    documents: [
      { id: 'doc-9', title: 'Design Lead Offer & Terms', type: 'PDF', size: '2.3 MB', uploadDate: '2023-06-18', category: 'Contract' }
    ]
  },
  {
    id: 'emp-005',
    empId: 'EMP005',
    name: 'Vikram Patel',
    email: 'vikram.patel@dayflow.com',
    phone: '+91 99000 88221',
    address: '77 Greenwood Estate, Sarjapur Road, Bengaluru 560035',
    department: 'Engineering',
    position: 'DevOps & Cloud Architect',
    joiningDate: '2023-11-01',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80',
    status: 'active',
    role: 'employee',
    bio: 'Kubernetes, Terraform, and multi-region cloud infrastructure specialist guaranteeing 99.99% system availability.',
    emergencyContact: {
      name: 'Kavita Patel',
      relationship: 'Spouse',
      phone: '+91 99000 11992'
    },
    salary: {
      basic: 58000,
      hra: 22000,
      allowances: 15000,
      taxDeduction: 7500,
      providentFund: 5800,
      otherDeductions: 1700,
      netSalary: 80000,
      currency: '₹'
    },
    documents: [
      { id: 'doc-10', title: 'Offer Letter - Vikram Patel', type: 'PDF', size: '2.0 MB', uploadDate: '2023-11-01', category: 'Contract' }
    ]
  },
  {
    id: 'emp-006',
    empId: 'EMP006',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@dayflow.com',
    phone: '+91 98860 33445',
    address: '23 Cyber Heights, Electronic City Phase 1, Bengaluru 560100',
    department: 'Marketing & Growth',
    position: 'Growth Marketing Manager',
    joiningDate: '2024-02-15',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&auto=format&fit=crop&q=80',
    status: 'active',
    role: 'employee',
    bio: 'Performance marketing, demand generation, and brand storytelling strategist.',
    emergencyContact: {
      name: 'Venkat Reddy',
      relationship: 'Father',
      phone: '+91 98860 77112'
    },
    salary: {
      basic: 44000,
      hra: 16000,
      allowances: 11000,
      taxDeduction: 4500,
      providentFund: 4400,
      otherDeductions: 1100,
      netSalary: 61000,
      currency: '₹'
    },
    documents: [
      { id: 'doc-11', title: 'Employment Agreement', type: 'PDF', size: '1.9 MB', uploadDate: '2024-02-15', category: 'Contract' }
    ]
  },
  {
    id: 'emp-007',
    empId: 'EMP007',
    name: 'Karan Verma',
    email: 'karan.verma@dayflow.com',
    phone: '+91 97110 88776',
    address: '56 Lake View Towers, Bellandur, Bengaluru 560103',
    department: 'Operations & Support',
    position: 'Operations Specialist',
    joiningDate: '2024-05-10',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=240&auto=format&fit=crop&q=80',
    status: 'active',
    role: 'employee',
    bio: 'Streamlining customer success operations, internal tooling, and service level adherence.',
    emergencyContact: {
      name: 'Alok Verma',
      relationship: 'Brother',
      phone: '+91 97110 33441'
    },
    salary: {
      basic: 36000,
      hra: 14000,
      allowances: 9000,
      taxDeduction: 3200,
      providentFund: 3600,
      otherDeductions: 1200,
      netSalary: 51000,
      currency: '₹'
    },
    documents: [
      { id: 'doc-12', title: 'Contract - Karan Verma', type: 'PDF', size: '1.7 MB', uploadDate: '2024-05-10', category: 'Contract' }
    ]
  },
  {
    id: 'emp-008',
    empId: 'EMP008',
    name: 'Neha Gupta',
    email: 'neha.gupta@dayflow.com',
    phone: '+91 99450 66554',
    address: '14 Prestige Palms, Banashankari 3rd Stage, Bengaluru 560085',
    department: 'Engineering',
    position: 'Frontend Engineer',
    joiningDate: '2024-08-01',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=240&auto=format&fit=crop&q=80',
    status: 'inactive',
    role: 'employee',
    bio: 'Specializing in React, design systems, WebGL interactive graphs, and frontend performance.',
    emergencyContact: {
      name: 'Ramesh Gupta',
      relationship: 'Father',
      phone: '+91 99450 22110'
    },
    salary: {
      basic: 40000,
      hra: 15000,
      allowances: 10000,
      taxDeduction: 4000,
      providentFund: 4000,
      otherDeductions: 1000,
      netSalary: 56000,
      currency: '₹'
    },
    documents: [
      { id: 'doc-13', title: 'Joining Letter - Neha Gupta', type: 'PDF', size: '1.8 MB', uploadDate: '2024-08-01', category: 'Contract' }
    ]
  }
];

// Helper to generate August 2026 attendance for employees
export const generateInitialAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const employees = INITIAL_EMPLOYEES;
  const today = '2026-08-21'; // Current local date in environment

  // Generate for days 1 to 21 of August 2026
  for (let day = 1; day <= 21; day++) {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const dateStr = `2026-08-${dayStr}`;
    const dateObj = new Date(2026, 7, day);
    const dayOfWeek = dateObj.getDay(); // 0 is Sun, 6 is Sat

    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    employees.forEach((emp) => {
      let status: AttendanceRecord['status'] = 'present';
      let checkIn: string | null = '09:02 AM';
      let checkOut: string | null = '06:05 PM';
      let workingHours = '9h 03m';
      let workingMinutes = 543;

      if (isWeekend) {
        status = 'weekend';
        checkIn = null;
        checkOut = null;
        workingHours = '-';
        workingMinutes = 0;
      } else if (emp.empId === 'EMP003' && day >= 18) {
        // Rahul Menon on leave
        status = 'leave';
        checkIn = null;
        checkOut = null;
        workingHours = '-';
        workingMinutes = 0;
      } else if (emp.empId === 'EMP001' && day === 12) {
        // Arun had sick leave on Aug 12
        status = 'leave';
        checkIn = null;
        checkOut = null;
        workingHours = '-';
        workingMinutes = 0;
      } else if (day === 8 && emp.empId === 'EMP004') {
        status = 'half_day';
        checkIn = '09:15 AM';
        checkOut = '01:30 PM';
        workingHours = '4h 15m';
        workingMinutes = 255;
      } else if (day === 14 && emp.empId === 'EMP005') {
        status = 'absent';
        checkIn = null;
        checkOut = null;
        workingHours = '-';
        workingMinutes = 0;
      } else if (dateStr === today) {
        // Today's current punch
        if (emp.empId === 'EMP001') {
          // Arun Kumar is checked in right now
          status = 'present';
          checkIn = '09:04 AM';
          checkOut = null; // Currently at work
          workingHours = '8h 20m';
          workingMinutes = 500;
        } else if (emp.empId === 'EMP003') {
          status = 'leave';
          checkIn = null;
          checkOut = null;
          workingHours = '-';
          workingMinutes = 0;
        } else {
          status = 'present';
          checkIn = '09:12 AM';
          checkOut = null;
          workingHours = '7h 45m';
          workingMinutes = 465;
        }
      } else {
        // Normal past weekday
        const randomMinIn = (day * 7) % 25;
        const randomMinOut = (day * 11) % 35;
        checkIn = `09:${randomMinIn < 10 ? '0' + randomMinIn : randomMinIn} AM`;
        checkOut = `06:${randomMinOut < 10 ? '0' + randomMinOut : randomMinOut} PM`;
        const totalMinutes = 540 + randomMinOut - randomMinIn;
        const hrs = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        workingHours = `${hrs}h ${mins < 10 ? '0' + mins : mins}m`;
        workingMinutes = totalMinutes;
      }

      records.push({
        id: `att-${emp.empId}-${dateStr}`,
        employeeId: emp.id,
        employeeName: emp.name,
        employeeAvatar: emp.avatar,
        department: emp.department,
        date: dateStr,
        checkIn,
        checkOut,
        workingHours,
        workingMinutes,
        status,
        notes: status === 'half_day' ? 'Approved medical doctor appointment half day' : undefined
      });
    });
  }

  return records;
};

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'leave-101',
    employeeId: 'emp-001',
    employeeName: 'Arun Kumar',
    employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
    department: 'Engineering',
    leaveType: 'Paid Leave',
    startDate: '2026-08-25',
    endDate: '2026-08-26',
    daysCount: 2,
    reason: 'Family anniversary celebration out of town with relatives.',
    status: 'Pending',
    appliedOn: '2026-08-20'
  },
  {
    id: 'leave-102',
    employeeId: 'emp-001',
    employeeName: 'Arun Kumar',
    employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
    department: 'Engineering',
    leaveType: 'Sick Leave',
    startDate: '2026-08-12',
    endDate: '2026-08-12',
    daysCount: 1,
    reason: 'Viral fever and prescribed medical rest by doctor.',
    status: 'Approved',
    appliedOn: '2026-08-11',
    approvalComments: 'Approved. Take rest and feel better soon!',
    reviewedBy: 'Priya Sharma (HR Lead)',
    reviewedAt: '2026-08-11 04:30 PM'
  },
  {
    id: 'leave-103',
    employeeId: 'emp-003',
    employeeName: 'Rahul Menon',
    employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
    department: 'Finance & Accounting',
    leaveType: 'Paid Leave',
    startDate: '2026-08-18',
    endDate: '2026-08-22',
    daysCount: 5,
    reason: 'Annual family summer vacation in Coorg.',
    status: 'Approved',
    appliedOn: '2026-08-10',
    approvalComments: 'Approved as per annual leave quota balance.',
    reviewedBy: 'Priya Sharma (HR Lead)',
    reviewedAt: '2026-08-10 11:15 AM'
  },
  {
    id: 'leave-104',
    employeeId: 'emp-004',
    employeeName: 'Ananya Roy',
    employeeAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240&auto=format&fit=crop&q=80',
    department: 'Product & Design',
    leaveType: 'Casual Leave',
    startDate: '2026-08-28',
    endDate: '2026-08-28',
    daysCount: 1,
    reason: 'Attending Figma Config Regional Design Conference.',
    status: 'Pending',
    appliedOn: '2026-08-21'
  },
  {
    id: 'leave-105',
    employeeId: 'emp-006',
    employeeName: 'Sneha Reddy',
    employeeAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&auto=format&fit=crop&q=80',
    department: 'Marketing & Growth',
    leaveType: 'Paid Leave',
    startDate: '2026-07-15',
    endDate: '2026-07-16',
    daysCount: 2,
    reason: 'Personal house shifting and logistics.',
    status: 'Approved',
    appliedOn: '2026-07-10',
    approvalComments: 'Approved.',
    reviewedBy: 'Priya Sharma (HR Lead)',
    reviewedAt: '2026-07-11 10:00 AM'
  },
  {
    id: 'leave-106',
    employeeId: 'emp-007',
    employeeName: 'Karan Verma',
    employeeAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=240&auto=format&fit=crop&q=80',
    department: 'Operations & Support',
    leaveType: 'Unpaid Leave',
    startDate: '2026-08-05',
    endDate: '2026-08-06',
    daysCount: 2,
    reason: 'Personal emergency.',
    status: 'Rejected',
    appliedOn: '2026-08-04',
    approvalComments: 'High priority customer migration scheduled during these days. Please reschedule.',
    reviewedBy: 'Priya Sharma (HR Lead)',
    reviewedAt: '2026-08-04 05:40 PM'
  }
];

export const INITIAL_PAYROLL_RECORDS: PayrollRecord[] = [
  {
    id: 'pay-2026-07-001',
    employeeId: 'emp-001',
    employeeName: 'Arun Kumar',
    employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
    department: 'Engineering',
    position: 'Senior Full Stack Engineer',
    month: 'July 2026',
    monthKey: '2026-07',
    basic: 48000,
    allowances: 30000,
    deductions: 11000,
    netSalary: 67000,
    paymentDate: '2026-07-31',
    status: 'Paid',
    payslipNumber: 'DF-PAY-202607-001',
    paymentMethod: 'Direct Bank Transfer (NEFT)',
    bankAccount: 'HDFC Bank •••• 4892'
  },
  {
    id: 'pay-2026-06-001',
    employeeId: 'emp-001',
    employeeName: 'Arun Kumar',
    employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
    department: 'Engineering',
    position: 'Senior Full Stack Engineer',
    month: 'June 2026',
    monthKey: '2026-06',
    basic: 48000,
    allowances: 30000,
    deductions: 11000,
    netSalary: 67000,
    paymentDate: '2026-06-30',
    status: 'Paid',
    payslipNumber: 'DF-PAY-202606-001',
    paymentMethod: 'Direct Bank Transfer (NEFT)',
    bankAccount: 'HDFC Bank •••• 4892'
  },
  {
    id: 'pay-2026-05-001',
    employeeId: 'emp-001',
    employeeName: 'Arun Kumar',
    employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
    department: 'Engineering',
    position: 'Senior Full Stack Engineer',
    month: 'May 2026',
    monthKey: '2026-05',
    basic: 48000,
    allowances: 30000,
    deductions: 11000,
    netSalary: 67000,
    paymentDate: '2026-05-31',
    status: 'Paid',
    payslipNumber: 'DF-PAY-202605-001',
    paymentMethod: 'Direct Bank Transfer (NEFT)',
    bankAccount: 'HDFC Bank •••• 4892'
  },
  {
    id: 'pay-2026-07-002',
    employeeId: 'emp-002',
    employeeName: 'Priya Sharma',
    employeeAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80',
    department: 'Human Resources',
    position: 'Chief People Officer / HR Lead',
    month: 'July 2026',
    monthKey: '2026-07',
    basic: 62000,
    allowances: 40000,
    deductions: 16000,
    netSalary: 86000,
    paymentDate: '2026-07-31',
    status: 'Paid',
    payslipNumber: 'DF-PAY-202607-002',
    paymentMethod: 'Direct Bank Transfer (NEFT)',
    bankAccount: 'ICICI Bank •••• 7120'
  },
  {
    id: 'pay-2026-07-003',
    employeeId: 'emp-003',
    employeeName: 'Rahul Menon',
    employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
    department: 'Finance & Accounting',
    position: 'Senior Financial Controller',
    month: 'July 2026',
    monthKey: '2026-07',
    basic: 54000,
    allowances: 34000,
    deductions: 14000,
    netSalary: 74000,
    paymentDate: '2026-07-31',
    status: 'Paid',
    payslipNumber: 'DF-PAY-202607-003',
    paymentMethod: 'Direct Bank Transfer (NEFT)',
    bankAccount: 'Axis Bank •••• 9901'
  },
  {
    id: 'pay-2026-07-004',
    employeeId: 'emp-004',
    employeeName: 'Ananya Roy',
    employeeAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240&auto=format&fit=crop&q=80',
    department: 'Product & Design',
    position: 'Lead Product Designer',
    month: 'July 2026',
    monthKey: '2026-07',
    basic: 52000,
    allowances: 32000,
    deductions: 13000,
    netSalary: 71000,
    paymentDate: '2026-07-31',
    status: 'Paid',
    payslipNumber: 'DF-PAY-202607-004',
    paymentMethod: 'Direct Bank Transfer (NEFT)',
    bankAccount: 'Kotak Bank •••• 3145'
  },
  {
    id: 'pay-2026-07-005',
    employeeId: 'emp-005',
    employeeName: 'Vikram Patel',
    employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80',
    department: 'Engineering',
    position: 'DevOps & Cloud Architect',
    month: 'July 2026',
    monthKey: '2026-07',
    basic: 58000,
    allowances: 37000,
    deductions: 15000,
    netSalary: 80000,
    paymentDate: '2026-07-31',
    status: 'Paid',
    payslipNumber: 'DF-PAY-202607-005',
    paymentMethod: 'Direct Bank Transfer (NEFT)',
    bankAccount: 'HDFC Bank •••• 6512'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    targetRole: 'employee',
    targetUserId: 'emp-001',
    title: 'Leave Request Approved',
    message: 'Your sick leave application for Aug 12, 2026 has been approved by HR.',
    type: 'success',
    timestamp: '2026-08-11 04:30 PM',
    read: true,
    link: '/employee/leave',
    sender: 'Priya Sharma (HR)'
  },
  {
    id: 'notif-2',
    targetRole: 'employee',
    targetUserId: 'emp-001',
    title: 'Attendance Reminder',
    message: "You checked in at 09:04 AM today. Don't forget to punch check-out upon shift completion.",
    type: 'info',
    timestamp: '2026-08-21 09:05 AM',
    read: false,
    link: '/employee/attendance',
    sender: 'System Bot'
  },
  {
    id: 'notif-3',
    targetRole: 'employee',
    targetUserId: 'emp-001',
    title: 'July 2026 Payslip Released',
    message: 'Your monthly net salary of ₹67,000 has been credited to your HDFC account.',
    type: 'success',
    timestamp: '2026-07-31 06:00 PM',
    read: false,
    link: '/employee/payroll',
    sender: 'Finance Desk'
  },
  {
    id: 'notif-4',
    targetRole: 'admin',
    title: 'New Leave Request Pending Review',
    message: 'Arun Kumar has submitted a Paid Leave application for Aug 25 - Aug 26 (2 days).',
    type: 'warning',
    timestamp: '2026-08-20 02:15 PM',
    read: false,
    link: '/admin/leave',
    sender: 'Arun Kumar'
  },
  {
    id: 'notif-5',
    targetRole: 'admin',
    title: 'New Leave Request Pending Review',
    message: 'Ananya Roy has submitted a Casual Leave request for Aug 28 (1 day).',
    type: 'info',
    timestamp: '2026-08-21 11:30 AM',
    read: false,
    link: '/admin/leave',
    sender: 'Ananya Roy'
  },
  {
    id: 'notif-6',
    targetRole: 'all',
    title: 'Company Townhall & Q3 Strategy Session',
    message: 'Quarterly all-hands meeting scheduled for Friday Aug 28 at 04:00 PM in Main Auditorium & Zoom.',
    type: 'info',
    timestamp: '2026-08-19 10:00 AM',
    read: true,
    link: '/employee/dashboard',
    sender: 'Executive Office'
  }
];

export const COMPANY_HOLIDAYS = [
  { date: '2026-08-15', name: 'Independence Day', type: 'National Holiday' },
  { date: '2026-09-04', name: 'Janmashtami', type: 'Regional Holiday' },
  { date: '2026-10-02', name: 'Gandhi Jayanti', type: 'National Holiday' },
  { date: '2026-10-20', name: 'Dussehra / Vijayadashami', type: 'Gazetted Holiday' },
  { date: '2026-11-08', name: 'Diwali Festival of Lights', type: 'Public Holiday' },
  { date: '2026-12-25', name: 'Christmas Day', type: 'National Holiday' }
];
