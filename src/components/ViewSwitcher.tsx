import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, UserCheck, Sparkles } from 'lucide-react';

export const ViewSwitcher: React.FC = () => {
  const { role, setRole } = useApp();

  return (
    <div className="view-switch">
      <div className="view-switch-info">
        <span><Sparkles size={14} /> DAYFLOW Interactive Prototype</span>
        <span>|</span>
        <span>Role Context: {role === 'hr_manager' ? 'HR Manager (Priya Sharma)' : 'Employee (Arjun Mehta)'}</span>
      </div>
      <div className="view-switch-btns">
        <button
          className={role === 'hr_manager' ? 'active' : ''}
          onClick={() => setRole('hr_manager')}
        >
          <ShieldCheck size={14} style={{ display: 'inline', marginRight: 6 }} />
          HR Manager View
        </button>
        <button
          className={role === 'employee' ? 'active' : ''}
          onClick={() => setRole('employee')}
        >
          <UserCheck size={14} style={{ display: 'inline', marginRight: 6 }} />
          Employee View
        </button>
      </div>
    </div>
  );
};
