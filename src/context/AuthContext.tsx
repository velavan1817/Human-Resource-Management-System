import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee, Role } from '../types';
import { INITIAL_EMPLOYEES } from '../data/mockData';

interface AuthContextType {
  currentUser: Employee | null;
  currentRole: Role;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => { success: boolean; message?: string; role?: Role };
  demoLogin: (role: Role) => void;
  logout: () => void;
  updateProfile: (data: Partial<Employee>) => boolean;
  register: (data: { empId: string; name: string; email: string; role: Role }) => { success: boolean; message?: string };
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Employee | null>(() => {
    const saved = localStorage.getItem('dayflow_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    // Default to Arun Kumar (Employee)
    return INITIAL_EMPLOYEES[0];
  });

  const [currentRole, setCurrentRole] = useState<Role>(() => {
    const saved = localStorage.getItem('dayflow_role') as Role;
    if (saved && (saved === 'admin' || saved === 'employee')) {
      return saved;
    }
    return 'employee';
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('dayflow_user', JSON.stringify(currentUser));
      localStorage.setItem('dayflow_role', currentUser.role);
      setCurrentRole(currentUser.role);
    } else {
      localStorage.removeItem('dayflow_user');
      localStorage.removeItem('dayflow_role');
    }
  }, [currentUser]);

  const login = (email: string, pass: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    
    // Check credentials
    if (normalizedEmail === 'admin@dayflow.com' && pass === 'admin123') {
      const adminUser = INITIAL_EMPLOYEES.find(e => e.email === 'admin@dayflow.com') || {
        ...INITIAL_EMPLOYEES[1],
        role: 'admin' as Role
      };
      setCurrentUser(adminUser);
      setCurrentRole('admin');
      return { success: true, role: 'admin' as Role };
    }

    if (normalizedEmail === 'employee@dayflow.com' && pass === 'employee123') {
      const empUser = INITIAL_EMPLOYEES.find(e => e.email === 'employee@dayflow.com') || INITIAL_EMPLOYEES[0];
      setCurrentUser(empUser);
      setCurrentRole('employee');
      return { success: true, role: 'employee' as Role };
    }

    // Check registered custom users from local storage
    const storedEmployeesRaw = localStorage.getItem('dayflow_employees');
    if (storedEmployeesRaw) {
      try {
        const storedEmployees: Employee[] = JSON.parse(storedEmployeesRaw);
        const match = storedEmployees.find(e => e.email.toLowerCase() === normalizedEmail);
        if (match) {
          setCurrentUser(match);
          setCurrentRole(match.role);
          return { success: true, role: match.role };
        }
      } catch (err) {
        console.error(err);
      }
    }

    return {
      success: false,
      message: 'Invalid credentials. Please use demo logins: admin@dayflow.com / admin123 or employee@dayflow.com / employee123'
    };
  };

  const demoLogin = (role: Role) => {
    if (role === 'admin') {
      const admin = INITIAL_EMPLOYEES.find(e => e.email === 'admin@dayflow.com') || INITIAL_EMPLOYEES[1];
      setCurrentUser({ ...admin, role: 'admin' });
      setCurrentRole('admin');
    } else {
      const emp = INITIAL_EMPLOYEES.find(e => e.email === 'employee@dayflow.com') || INITIAL_EMPLOYEES[0];
      setCurrentUser({ ...emp, role: 'employee' });
      setCurrentRole('employee');
    }
  };

  const switchRole = (role: Role) => {
    if (role === 'admin') {
      const admin = INITIAL_EMPLOYEES.find(e => e.role === 'admin') || INITIAL_EMPLOYEES[1];
      setCurrentUser(admin);
      setCurrentRole('admin');
    } else {
      const emp = INITIAL_EMPLOYEES.find(e => e.role === 'employee') || INITIAL_EMPLOYEES[0];
      setCurrentUser(emp);
      setCurrentRole('employee');
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (data: Partial<Employee>) => {
    if (!currentUser) return false;

    // Enforce Employee role permissions: can only edit phone, address, avatar, bio
    let updated: Employee;
    if (currentRole === 'employee') {
      updated = {
        ...currentUser,
        phone: data.phone ?? currentUser.phone,
        address: data.address ?? currentUser.address,
        avatar: data.avatar ?? currentUser.avatar,
        bio: data.bio ?? currentUser.bio,
        emergencyContact: data.emergencyContact ?? currentUser.emergencyContact
      };
    } else {
      // Admin can update everything
      updated = {
        ...currentUser,
        ...data
      };
    }

    setCurrentUser(updated);

    // Sync to employees list in localStorage
    const saved = localStorage.getItem('dayflow_employees');
    if (saved) {
      try {
        const list: Employee[] = JSON.parse(saved);
        const idx = list.findIndex(e => e.id === updated.id);
        if (idx !== -1) {
          list[idx] = updated;
          localStorage.setItem('dayflow_employees', JSON.stringify(list));
        }
      } catch (err) {
        console.error(err);
      }
    }

    return true;
  };

  const register = (data: { empId: string; name: string; email: string; role: Role }) => {
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      empId: data.empId,
      name: data.name,
      email: data.email,
      phone: '+91 98000 00000',
      address: 'Bengaluru, Karnataka, India',
      department: 'Engineering',
      position: data.role === 'admin' ? 'HR Administrator' : 'Software Engineer',
      joiningDate: new Date().toISOString().split('T')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
      status: 'active',
      role: data.role,
      bio: 'New team member at Dayflow.',
      emergencyContact: {
        name: 'Emergency Contact',
        relationship: 'Family',
        phone: '+91 98000 11111'
      },
      salary: {
        basic: 45000,
        hra: 18000,
        allowances: 12000,
        taxDeduction: 4500,
        providentFund: 4500,
        otherDeductions: 1000,
        netSalary: 65000,
        currency: '₹'
      },
      documents: []
    };

    // Save in local storage
    const currentListRaw = localStorage.getItem('dayflow_employees');
    let list: Employee[] = INITIAL_EMPLOYEES;
    if (currentListRaw) {
      try {
        list = JSON.parse(currentListRaw);
      } catch (e) {
        list = INITIAL_EMPLOYEES;
      }
    }
    list = [newEmp, ...list];
    localStorage.setItem('dayflow_employees', JSON.stringify(list));

    // Auto login as new user
    setCurrentUser(newEmp);
    setCurrentRole(newEmp.role);

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isAuthenticated: !!currentUser,
        login,
        demoLogin,
        logout,
        updateProfile,
        register,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
