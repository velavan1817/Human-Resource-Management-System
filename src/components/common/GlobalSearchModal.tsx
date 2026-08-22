import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  User,
  CalendarCheck,
  FileText,
  DollarSign,
  ArrowRight,
  X
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { useAuth } from '../../context/AuthContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { employees, leaves, payroll } = useHRMS();
  const { currentRole } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.trim().toLowerCase();

  const filteredEmployees = cleanQuery
    ? employees.filter(
        (e) =>
          e.name.toLowerCase().includes(cleanQuery) ||
          e.empId.toLowerCase().includes(cleanQuery) ||
          e.department.toLowerCase().includes(cleanQuery) ||
          e.position.toLowerCase().includes(cleanQuery)
      )
    : [];

  const filteredLeaves = cleanQuery
    ? leaves.filter(
        (l) =>
          l.employeeName.toLowerCase().includes(cleanQuery) ||
          l.leaveType.toLowerCase().includes(cleanQuery) ||
          l.status.toLowerCase().includes(cleanQuery) ||
          l.reason.toLowerCase().includes(cleanQuery)
      )
    : [];

  const filteredPayroll = cleanQuery
    ? payroll.filter(
        (p) =>
          p.employeeName.toLowerCase().includes(cleanQuery) ||
          p.month.toLowerCase().includes(cleanQuery) ||
          p.payslipNumber.toLowerCase().includes(cleanQuery)
      )
    : [];

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200"
      >
        {/* Search Header */}
        <div className="relative border-b border-slate-100 flex items-center px-4 py-3.5">
          <Search className="w-5 h-5 text-slate-400 shrink-0 ml-1" />
          <input
            type="text"
            autoFocus
            placeholder="Search employees, leaves, attendance, payroll records..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent px-3 py-1 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[11px] font-medium text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md shrink-0 ml-2">
            ESC
          </span>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {!cleanQuery && (
            <div className="text-xs text-slate-500 space-y-3">
              <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                Quick Navigation
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSelect(currentRole === 'admin' ? '/admin/dashboard' : '/employee/dashboard')}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 text-left transition-colors"
                >
                  <span className="font-medium text-slate-700">Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => handleSelect(currentRole === 'admin' ? '/admin/attendance' : '/employee/attendance')}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 text-left transition-colors"
                >
                  <span className="font-medium text-slate-700">Attendance Log</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => handleSelect(currentRole === 'admin' ? '/admin/leave' : '/employee/leave')}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 text-left transition-colors"
                >
                  <span className="font-medium text-slate-700">Leave Management</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => handleSelect(currentRole === 'admin' ? '/admin/payroll' : '/employee/payroll')}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 text-left transition-colors"
                >
                  <span className="font-medium text-slate-700">Payroll & Payslips</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          )}

          {cleanQuery && filteredEmployees.length === 0 && filteredLeaves.length === 0 && filteredPayroll.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-xs">
              No matching records found for "{query}".
            </div>
          )}

          {/* Employees Match */}
          {filteredEmployees.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Employees ({filteredEmployees.length})
              </p>
              <div className="space-y-1.5">
                {filteredEmployees.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() =>
                      handleSelect(
                        currentRole === 'admin'
                          ? `/admin/employees/${emp.id}`
                          : '/employee/profile'
                      )
                    }
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/60 border border-transparent hover:border-indigo-100 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-900 group-hover:text-indigo-900">
                          {emp.name}{' '}
                          <span className="text-[10px] font-normal text-slate-500">
                            ({emp.empId})
                          </span>
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {emp.position} • {emp.department}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Leave Requests Match */}
          {filteredLeaves.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Leave Requests ({filteredLeaves.length})
              </p>
              <div className="space-y-1.5">
                {filteredLeaves.map((leave) => (
                  <button
                    key={leave.id}
                    onClick={() =>
                      handleSelect(currentRole === 'admin' ? '/admin/leave' : '/employee/leave')
                    }
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/60 border border-transparent hover:border-indigo-100 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900 group-hover:text-indigo-900">
                          {leave.employeeName} — {leave.leaveType}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {leave.startDate} to {leave.endDate} • Status: {leave.status}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Payroll Match */}
          {filteredPayroll.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Payroll Records ({filteredPayroll.length})
              </p>
              <div className="space-y-1.5">
                {filteredPayroll.map((pay) => (
                  <button
                    key={pay.id}
                    onClick={() =>
                      handleSelect(currentRole === 'admin' ? '/admin/payroll' : '/employee/payroll')
                    }
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/60 border border-transparent hover:border-indigo-100 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900 group-hover:text-indigo-900">
                          {pay.employeeName} — {pay.month}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Net Pay: ₹{pay.netSalary.toLocaleString('en-IN')} • Ref: {pay.payslipNumber}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Navigate with mouse or quick keys</span>
          <span>Dayflow Unified Search</span>
        </div>
      </motion.div>
    </div>
  );
};
