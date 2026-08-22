import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Employee,
  AttendanceRecord,
  LeaveRequest,
  PayrollRecord,
  NotificationItem,
  ToastMessage,
  SalaryStructure,
  LeaveStatus,
  Department
} from '../types';
import {
  INITIAL_EMPLOYEES,
  generateInitialAttendance,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_PAYROLL_RECORDS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';

interface HRMSContextType {
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  payroll: PayrollRecord[];
  notifications: NotificationItem[];
  toasts: ToastMessage[];

  // Attendance actions
  checkIn: (employeeId: string) => { success: boolean; message: string };
  checkOut: (employeeId: string) => { success: boolean; message: string };
  getTodayAttendance: (employeeId: string) => AttendanceRecord | undefined;
  getWeeklyAttendance: (employeeId: string) => AttendanceRecord[];
  getMonthAttendance: (employeeId: string, year: number, month: number) => AttendanceRecord[];

  // Leave actions
  applyLeave: (data: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn'>) => { success: boolean; message: string };
  updateLeaveStatus: (leaveId: string, status: LeaveStatus, comments?: string, reviewerName?: string) => { success: boolean; message: string };

  // Employee actions
  addEmployee: (empData: Omit<Employee, 'id'>) => { success: boolean; message: string; employee?: Employee };
  updateEmployee: (id: string, empData: Partial<Employee>) => { success: boolean; message: string };
  deleteEmployee: (id: string) => { success: boolean; message: string };
  toggleEmployeeStatus: (id: string) => { success: boolean; message: string };

  // Payroll actions
  updateSalary: (employeeId: string, salary: SalaryStructure) => { success: boolean; message: string };
  processMonthlyPayroll: (month: string, monthKey: string) => { success: boolean; count: number };

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (role: string, userId?: string) => void;
  sendBroadcastNotification: (title: string, message: string, targetRole?: 'all' | 'admin' | 'employee') => void;

  // Toast
  showToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Utilities
  resetToMockData: () => void;
}

const HRMSContext = createContext<HRMSContextType | undefined>(undefined);

export const HRMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Employees state
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('dayflow_employees');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_EMPLOYEES;
  });

  // 2. Attendance state
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('dayflow_attendance');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return generateInitialAttendance();
  });

  // 3. Leaves state
  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('dayflow_leaves');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_LEAVE_REQUESTS;
  });

  // 4. Payroll state
  const [payroll, setPayroll] = useState<PayrollRecord[]>(() => {
    const saved = localStorage.getItem('dayflow_payroll');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PAYROLL_RECORDS;
  });

  // 5. Notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('dayflow_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // 6. Toasts state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('dayflow_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('dayflow_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('dayflow_leaves', JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem('dayflow_payroll', JSON.stringify(payroll));
  }, [payroll]);

  useEffect(() => {
    localStorage.setItem('dayflow_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Toast Helpers
  const showToast = (title: string, description?: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, title, description, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // ---------------- ATTENDANCE ACTIONS ----------------
  const getTodayDateStr = () => '2026-08-21'; // matching system local date anchor

  const getTodayAttendance = (employeeId: string) => {
    const today = getTodayDateStr();
    return attendance.find((a) => a.employeeId === employeeId && a.date === today);
  };

  const getWeeklyAttendance = (employeeId: string) => {
    // Return records for the last 7 days leading to today
    const past7Dates = [
      '2026-08-15',
      '2026-08-16',
      '2026-08-17',
      '2026-08-18',
      '2026-08-19',
      '2026-08-20',
      '2026-08-21'
    ];
    return attendance.filter((a) => a.employeeId === employeeId && past7Dates.includes(a.date));
  };

  const getMonthAttendance = (employeeId: string, year: number, month: number) => {
    const monthPrefix = `${year}-${month < 10 ? '0' + month : month}`;
    return attendance.filter((a) => a.employeeId === employeeId && a.date.startsWith(monthPrefix));
  };

  const checkIn = (employeeId: string) => {
    const emp = employees.find((e) => e.id === employeeId);
    if (!emp) return { success: false, message: 'Employee not found' };

    const today = getTodayDateStr();
    const existing = attendance.find((a) => a.employeeId === employeeId && a.date === today);

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    if (existing) {
      if (existing.checkIn) {
        return { success: false, message: `Already checked in at ${existing.checkIn}` };
      }
      setAttendance((prev) =>
        prev.map((item) =>
          item.id === existing.id
            ? {
                ...item,
                checkIn: timeFormatted,
                status: 'present',
                workingHours: '0h 01m',
                workingMinutes: 1
              }
            : item
        )
      );
    } else {
      const newRecord: AttendanceRecord = {
        id: `att-${emp.empId}-${today}`,
        employeeId: emp.id,
        employeeName: emp.name,
        employeeAvatar: emp.avatar,
        department: emp.department,
        date: today,
        checkIn: timeFormatted,
        checkOut: null,
        workingHours: '0h 01m',
        workingMinutes: 1,
        status: 'present'
      };
      setAttendance((prev) => [newRecord, ...prev]);
    }

    showToast('Checked in successfully', `Timestamp recorded at ${timeFormatted}`, 'success');
    return { success: true, message: `Checked in at ${timeFormatted}` };
  };

  const checkOut = (employeeId: string) => {
    const today = getTodayDateStr();
    const existing = attendance.find((a) => a.employeeId === employeeId && a.date === today);

    if (!existing || !existing.checkIn) {
      return { success: false, message: 'Must check in before checking out' };
    }

    if (existing.checkOut) {
      return { success: false, message: `Already checked out at ${existing.checkOut}` };
    }

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // Approximate working hours
    const workingHours = '8h 58m';
    const workingMinutes = 538;

    setAttendance((prev) =>
      prev.map((item) =>
        item.id === existing.id
          ? {
              ...item,
              checkOut: timeFormatted,
              workingHours,
              workingMinutes
            }
          : item
      )
    );

    showToast('Checked out successfully', `Workday ended at ${timeFormatted} (${workingHours})`, 'success');
    return { success: true, message: `Checked out at ${timeFormatted}` };
  };

  // ---------------- LEAVE ACTIONS ----------------
  const applyLeave = (data: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn'>) => {
    const newLeave: LeaveRequest = {
      ...data,
      id: `leave-${Date.now()}`,
      status: 'Pending',
      appliedOn: getTodayDateStr()
    };

    setLeaves((prev) => [newLeave, ...prev]);

    // Push notification to HR/Admin
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      targetRole: 'admin',
      title: 'New Leave Request',
      message: `${data.employeeName} submitted a ${data.leaveType} request (${data.daysCount} days).`,
      type: 'warning',
      timestamp: 'Just now',
      read: false,
      link: '/admin/leave',
      sender: data.employeeName
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast('Leave request submitted', 'Your application has been sent to HR for approval.', 'success');
    return { success: true, message: 'Leave application submitted successfully' };
  };

  const updateLeaveStatus = (
    leaveId: string,
    status: LeaveStatus,
    comments?: string,
    reviewerName: string = 'HR Admin'
  ) => {
    const target = leaves.find((l) => l.id === leaveId);
    if (!target) return { success: false, message: 'Leave request not found' };

    setLeaves((prev) =>
      prev.map((l) =>
        l.id === leaveId
          ? {
              ...l,
              status,
              approvalComments: comments || (status === 'Approved' ? 'Approved by HR.' : 'Rejected by HR.'),
              reviewedBy: reviewerName,
              reviewedAt: `${getTodayDateStr()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            }
          : l
      )
    );

    // Also update employee status to on_leave if approved and includes today
    if (status === 'Approved') {
      const today = getTodayDateStr();
      if (target.startDate <= today && target.endDate >= today) {
        setEmployees((prev) =>
          prev.map((e) => (e.id === target.employeeId ? { ...e, status: 'on_leave' } : e))
        );
      }
    }

    // Push notification to the employee
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      targetRole: 'employee',
      targetUserId: target.employeeId,
      title: status === 'Approved' ? '✓ Leave Request Approved' : '✗ Leave Request Rejected',
      message: `Your ${target.leaveType} request for ${target.startDate} to ${target.endDate} was ${status.toLowerCase()} by ${reviewerName}.${comments ? ` Note: "${comments}"` : ''}`,
      type: status === 'Approved' ? 'success' : 'error',
      timestamp: 'Just now',
      read: false,
      link: '/employee/leave',
      sender: reviewerName
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast(
      `Leave request ${status.toLowerCase()}`,
      `${target.employeeName}'s application was marked as ${status}.`,
      status === 'Approved' ? 'success' : 'warning'
    );
    return { success: true, message: `Leave request ${status.toLowerCase()} successfully` };
  };

  // ---------------- EMPLOYEE ACTIONS ----------------
  const addEmployee = (empData: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...empData,
      id: `emp-${Date.now()}`
    };

    setEmployees((prev) => [newEmp, ...prev]);

    // Push notification to admin
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      targetRole: 'admin',
      title: 'New Employee Added',
      message: `${newEmp.name} (${newEmp.empId}) was onboarded into ${newEmp.department}.`,
      type: 'success',
      timestamp: 'Just now',
      read: false,
      link: `/admin/employees/${newEmp.id}`,
      sender: 'System'
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast('Employee Added', `${newEmp.name} has been added to the directory.`, 'success');
    return { success: true, message: 'Employee added successfully', employee: newEmp };
  };

  const updateEmployee = (id: string, empData: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const updated = { ...e, ...empData };
          // If updating current active user in localStorage, sync it
          const savedUser = localStorage.getItem('dayflow_user');
          if (savedUser) {
            try {
              const u = JSON.parse(savedUser);
              if (u.id === id) {
                localStorage.setItem('dayflow_user', JSON.stringify(updated));
              }
            } catch (err) {
              console.error(err);
            }
          }
          return updated;
        }
        return e;
      })
    );

    showToast('Profile Updated', 'Employee details have been saved successfully.', 'success');
    return { success: true, message: 'Employee updated successfully' };
  };

  const deleteEmployee = (id: string) => {
    const emp = employees.find((e) => e.id === id);
    if (!emp) return { success: false, message: 'Employee not found' };

    setEmployees((prev) => prev.filter((e) => e.id !== id));
    showToast('Employee Removed', `${emp.name} has been removed from directory.`, 'info');
    return { success: true, message: 'Employee deleted' };
  };

  const toggleEmployeeStatus = (id: string) => {
    const emp = employees.find((e) => e.id === id);
    if (!emp) return { success: false, message: 'Employee not found' };

    const newStatus = emp.status === 'active' ? 'inactive' : 'active';
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );

    showToast(
      `Employee Status Changed`,
      `${emp.name} is now marked as ${newStatus}.`,
      'info'
    );
    return { success: true, message: `Employee status changed to ${newStatus}` };
  };

  // ---------------- PAYROLL ACTIONS ----------------
  const updateSalary = (employeeId: string, salary: SalaryStructure) => {
    const emp = employees.find((e) => e.id === employeeId);
    if (!emp) return { success: false, message: 'Employee not found' };

    // Auto-calculate net salary
    const totalEarnings = (salary.basic || 0) + (salary.hra || 0) + (salary.allowances || 0);
    const totalDeductions = (salary.taxDeduction || 0) + (salary.providentFund || 0) + (salary.otherDeductions || 0);
    const calculatedNet = totalEarnings - totalDeductions;

    const finalSalary: SalaryStructure = {
      ...salary,
      netSalary: calculatedNet
    };

    setEmployees((prev) =>
      prev.map((e) => (e.id === employeeId ? { ...e, salary: finalSalary } : e))
    );

    // Notify employee
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      targetRole: 'employee',
      targetUserId: employeeId,
      title: 'Salary Structure Updated',
      message: `HR has updated your compensation structure. Net monthly salary: ${finalSalary.currency}${finalSalary.netSalary.toLocaleString('en-IN')}`,
      type: 'info',
      timestamp: 'Just now',
      read: false,
      link: '/employee/payroll',
      sender: 'Finance & HR'
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast('Salary Updated', `Salary structure for ${emp.name} updated successfully.`, 'success');
    return { success: true, message: 'Salary updated successfully' };
  };

  const processMonthlyPayroll = (month: string, monthKey: string) => {
    const newRecords: PayrollRecord[] = employees
      .filter((e) => e.status !== 'inactive')
      .map((emp, idx) => {
        const totalEarnings = emp.salary.basic + emp.salary.hra + emp.salary.allowances;
        const totalDeductions = emp.salary.taxDeduction + emp.salary.providentFund + emp.salary.otherDeductions;

        return {
          id: `pay-${monthKey}-${emp.empId}`,
          employeeId: emp.id,
          employeeName: emp.name,
          employeeAvatar: emp.avatar,
          department: emp.department,
          position: emp.position,
          month,
          monthKey,
          basic: emp.salary.basic,
          allowances: emp.salary.hra + emp.salary.allowances,
          deductions: totalDeductions,
          netSalary: emp.salary.netSalary,
          paymentDate: `${monthKey}-28`,
          status: 'Paid' as const,
          payslipNumber: `DF-PAY-${monthKey.replace('-', '')}-${(idx + 1).toString().padStart(3, '0')}`,
          paymentMethod: 'Direct Bank Transfer (NEFT)',
          bankAccount: 'Salary Account •••• 4892'
        };
      });

    // Replace or merge month
    setPayroll((prev) => {
      const filtered = prev.filter((p) => p.monthKey !== monthKey);
      return [...newRecords, ...filtered];
    });

    showToast(
      'Payroll Processed',
      `Successfully processed payroll batch for ${month} (${newRecords.length} employees).`,
      'success'
    );
    return { success: true, count: newRecords.length };
  };

  // ---------------- NOTIFICATIONS ACTIONS ----------------
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = (role: string, userId?: string) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (
          n.targetRole === 'all' ||
          n.targetRole === role ||
          (userId && n.targetUserId === userId)
        ) {
          return { ...n, read: true };
        }
        return n;
      })
    );
    showToast('Notifications updated', 'All notifications marked as read.', 'info');
  };

  const sendBroadcastNotification = (
    title: string,
    message: string,
    targetRole: 'all' | 'admin' | 'employee' = 'all'
  ) => {
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      targetRole,
      title,
      message,
      type: 'info',
      timestamp: 'Just now',
      read: false,
      link: '/employee/dashboard',
      sender: 'HR Administration'
    };

    setNotifications((prev) => [notif, ...prev]);
    showToast('Broadcast Sent', `Alert sent to ${targetRole === 'all' ? 'all employees' : targetRole + 's'}.`, 'success');
  };

  const resetToMockData = () => {
    localStorage.removeItem('dayflow_employees');
    localStorage.removeItem('dayflow_attendance');
    localStorage.removeItem('dayflow_leaves');
    localStorage.removeItem('dayflow_payroll');
    localStorage.removeItem('dayflow_notifications');

    setEmployees(INITIAL_EMPLOYEES);
    setAttendance(generateInitialAttendance());
    setLeaves(INITIAL_LEAVE_REQUESTS);
    setPayroll(INITIAL_PAYROLL_RECORDS);
    setNotifications(INITIAL_NOTIFICATIONS);

    showToast('Data Reset', 'All records have been reset to pristine mock data.', 'info');
  };

  return (
    <HRMSContext.Provider
      value={{
        employees,
        attendance,
        leaves,
        payroll,
        notifications,
        toasts,
        checkIn,
        checkOut,
        getTodayAttendance,
        getWeeklyAttendance,
        getMonthAttendance,
        applyLeave,
        updateLeaveStatus,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        toggleEmployeeStatus,
        updateSalary,
        processMonthlyPayroll,
        markNotificationRead,
        markAllNotificationsRead,
        sendBroadcastNotification,
        showToast,
        removeToast,
        resetToMockData
      }}
    >
      {children}
    </HRMSContext.Provider>
  );
};

export const useHRMS = () => {
  const context = useContext(HRMSContext);
  if (!context) {
    throw new Error('useHRMS must be used within an HRMSProvider');
  }
  return context;
};
