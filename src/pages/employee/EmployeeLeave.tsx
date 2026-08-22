import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CalendarDays,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Calendar,
  X,
  Filter,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHRMS } from '../../context/HRMSContext';
import { LeaveStatusBadge } from '../../components/common/Badge';
import { LeaveType, LeaveRequest } from '../../types';

export const EmployeeLeave: React.FC = () => {
  const { currentUser } = useAuth();
  const { leaves, applyLeave, showToast } = useHRMS();

  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  // Form states
  const [leaveType, setLeaveType] = useState<LeaveType>('Paid Leave');
  const [startDate, setStartDate] = useState('2026-08-25');
  const [endDate, setEndDate] = useState('2026-08-26');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const empId = currentUser?.id || 'emp-001';
  const myLeaves = leaves.filter((l) => l.employeeId === empId);

  const filteredLeaves = myLeaves.filter((l) => {
    if (filterStatus === 'All') return true;
    return l.status === filterStatus;
  });

  // Calculate day count
  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) return 0;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const daysCount = calculateDays();

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!startDate || !endDate || !reason.trim()) {
      setError('Please provide start date, end date, and a specific reason.');
      return;
    }

    if (daysCount <= 0) {
      setError('End date cannot be before start date.');
      return;
    }

    const res = applyLeave({
      employeeId: empId,
      employeeName: currentUser?.name || 'Arun Kumar',
      employeeAvatar:
        currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240',
      department: currentUser?.department || 'Engineering',
      leaveType,
      startDate,
      endDate,
      daysCount,
      reason
    });

    if (res.success) {
      setShowModal(false);
      setReason('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-display">
            Leave Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your annual leave entitlement, submit time-off requests, and monitor approval status.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Apply for Leave
        </button>
      </div>

      {/* Leave Balance Quota Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Paid Leave */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Paid Leave (PL)
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold text-xs">
              Annual
            </span>
          </div>
          <div className="my-3">
            <span className="text-3xl font-bold text-slate-900 font-display">12</span>
            <span className="text-xs text-slate-400 font-medium ml-1.5">/ 14 remaining</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }} />
          </div>
        </div>

        {/* Sick Leave */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Sick Leave (SL)
            </span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 font-bold text-xs">
              Medical
            </span>
          </div>
          <div className="my-3">
            <span className="text-3xl font-bold text-slate-900 font-display">7</span>
            <span className="text-xs text-slate-400 font-medium ml-1.5">/ 8 remaining</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: '87%' }} />
          </div>
        </div>

        {/* Casual Leave */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Casual Leave (CL)
            </span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 font-bold text-xs">
              Personal
            </span>
          </div>
          <div className="my-3">
            <span className="text-3xl font-bold text-slate-900 font-display">6</span>
            <span className="text-xs text-slate-400 font-medium ml-1.5">/ 6 remaining</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Unpaid Leave */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Unpaid Leave (LWP)
            </span>
            <span className="p-1.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 font-bold text-xs">
              Extended
            </span>
          </div>
          <div className="my-3">
            <span className="text-3xl font-bold text-slate-900 font-display">0</span>
            <span className="text-xs text-slate-400 font-medium ml-1.5">days used this year</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-slate-300 h-full rounded-full" style={{ width: '0%' }} />
          </div>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-sm">My Leave Requests History</h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
              {myLeaves.length} Total
            </span>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  filterStatus === tab
                    ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filteredLeaves.length === 0 ? (
          <div className="text-center py-12 px-4">
            <CalendarDays className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-700">No leave requests found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You haven't submitted any leave requests under "{filterStatus}".
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLeaves.map((item) => (
              <div key={item.id} className="p-5 hover:bg-slate-50/70 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-slate-900">{item.leaveType}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                      {item.daysCount} {item.daysCount === 1 ? 'Day' : 'Days'}
                    </span>
                  </div>

                  <LeaveStatusBadge status={item.status} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 my-2">
                  <div>
                    <span className="text-slate-400 font-medium">Date Range:</span>{' '}
                    <strong className="text-slate-800 font-mono">
                      {item.startDate} to {item.endDate}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Applied On:</span>{' '}
                    <span className="text-slate-700">{item.appliedOn}</span>
                  </div>
                  {item.reviewedBy && (
                    <div>
                      <span className="text-slate-400 font-medium">Reviewed By:</span>{' '}
                      <span className="text-slate-700">{item.reviewedBy}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 mt-2">
                  <span className="font-semibold text-slate-700">Reason:</span> {item.reason}
                </p>

                {item.approvalComments && (
                  <div className="mt-2 text-xs p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-indigo-900 flex items-start gap-2">
                    <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">HR Review Remarks:</span> {item.approvalComments}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Apply for Leave</h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {error && (
                <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleApply} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Leave Category</label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                  >
                    <option value="Paid Leave">Paid Leave (PL - 12 days available)</option>
                    <option value="Sick Leave">Sick Leave (SL - 7 days available)</option>
                    <option value="Casual Leave">Casual Leave (CL - 6 days available)</option>
                    <option value="Unpaid Leave">Unpaid Leave (LWP)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">Start Date</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">End Date</label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 font-mono"
                    />
                  </div>
                </div>

                {/* Duration indicator pill */}
                <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between text-indigo-950 font-semibold">
                  <span>Calculated Duration:</span>
                  <span className="font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-indigo-200">
                    {daysCount} {daysCount === 1 ? 'Day' : 'Days'}
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Reason & Remarks
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide context for HR and reporting manager review..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                  >
                    Submit Leave Request
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
