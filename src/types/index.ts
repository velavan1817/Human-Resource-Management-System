export type Role = 'admin' | 'employee';

export type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'leave' | 'weekend';

export type LeaveType = 'Paid Leave' | 'Sick Leave' | 'Unpaid Leave' | 'Casual Leave';

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export type EmployeeStatus = 'active' | 'on_leave' | 'inactive' | 'Active' | 'On Leave' | 'Inactive';

export type Department = 
  | 'Engineering'
  | 'Design'
  | 'Product'
  | 'Human Resources'
  | 'Marketing'
  | 'Finance'
  | 'Operations'
  | 'Finance & Accounting'
  | 'Product & Design'
  | 'Marketing & Growth'
  | 'Operations & Support';

export interface SalaryStructure {
  basic: number;
  hra: number;
  allowances: number;
  taxDeduction: number;
  providentFund: number;
  otherDeductions: number;
  netSalary: number;
  currency: string;
}

export interface EmployeeDocument {
  id: string;
  title: string;
  type: 'PDF' | 'DOC' | 'IMG';
  size: string;
  uploadDate: string;
  category: 'Contract' | 'Tax' | 'Identity' | 'Certificate';
}

export interface Employee {
  id: string;
  empId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  department: Department;
  position: string;
  joiningDate: string;
  avatar: string;
  status: EmployeeStatus;
  role: Role;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  salary: SalaryStructure;
  documents: EmployeeDocument[];
  bio?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: Department;
  date: string; // YYYY-MM-DD
  checkIn: string | null; // e.g. "09:04 AM"
  checkOut: string | null; // e.g. "06:12 PM"
  workingHours: string; // e.g. "9h 08m" or "-"
  workingMinutes: number; // For calculations
  status: AttendanceStatus;
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: Department;
  leaveType: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  daysCount: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  approvalComments?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: Department;
  position: string;
  month: string; // e.g. "August 2026"
  monthKey: string; // e.g. "2026-08"
  basic: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  paymentDate: string;
  status: 'Paid' | 'Processing' | 'Pending';
  payslipNumber: string;
  paymentMethod: string;
  bankAccount: string;
}

export interface NotificationItem {
  id: string;
  targetRole?: Role | 'all';
  targetUserId?: string; // specific employee id
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  timestamp: string;
  read: boolean;
  link?: string;
  sender?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface LeaveBalance {
  paidLeave: { total: number; used: number; remaining: number };
  sickLeave: { total: number; used: number; remaining: number };
  casualLeave: { total: number; used: number; remaining: number };
  unpaidLeave: { used: number };
}
