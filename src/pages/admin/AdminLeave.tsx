import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Search,
  MessageSquare,
  AlertCircle,
  Check,
  X,
  Building,
  User
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { LeaveStatusBadge } from '../../components/common/Badge';
import { LeaveRequest } from '../../types';

export const AdminLeave: React.FC = () => {
  const { leaves, approveLeave, rejectLeave, showToast } = useHRMS();

  const [filterStatus, setFilterStatus] = useState<string>('Pending');
  const [filterDept, setFilterDept] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Action review modal
  const [activeActionModal, setActiveActionModal] = useState<{
    request: LeaveRequest;
    action: 'approve' | 'reject';
  } | null>(null);
  const [reviewComment, setReviewComment] = useState('');

  const filteredLeaves = leaves.filter((req) => {
    const matchesStatus = filterStatus === 'All' || req.status === filterStatus;
    const matchesDept = filterDept === 'All' || req.department === filterDept;
    const matchesSearch =
      req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesDept && matchesSearch;
  });

  const pendingCount = leaves.filter((l) => l.status === 'Pending').length;
  const approvedCount = leaves.filter((l) => l.status === 'Approved').length;
  const rejectedCount = leaves.filter((l) => l.status === 'Rejected').length;

  const handleConfirmAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeActionModal) return;

    const { request, action } = activeActionModal;
    if (action === 'approve') {
      approveLeave(request.id, reviewComment || 'Approved by HR Lead');
      showToast('Leave Approved', `Approved leave for ${request.employeeName}.`, 'success');
    } else {
      rejectLeave(request.id, reviewComment || 'Rejected per company policy');
      showToast('Leave Rejected', `Rejected leave for ${request.employeeName}.`, 'info');
    }

    setActiveActionModal(null);
    setReviewComment('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-display">
            Leave Requests & Time-Off Approvals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review, approve, or reject employee leave applications across all business units.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {pendingCount} Pending Decision
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Pending Review
            </span>
            <p className="text-2xl font-bold text-amber-700 font-display mt-1">{pendingCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Approved This Month
            </span>
            <p className="text-2xl font-bold text-emerald-700 font-display mt-1">{approvedCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Rejected Requests
            </span>
            <p className="text-2xl font-bold text-rose-700 font-display mt-1">{rejectedCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  filterStatus === status
                    ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Department Filter */}
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:bg-white"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Product">Product</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>
      </div>

      {/* Leave Requests List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filteredLeaves.length === 0 ? (
          <div className="text-center py-14">
            <CalendarDays className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-700">No leave requests found</h4>
            <p className="text-xs text-slate-400 mt-1">No requests matching the selected filters.</p>
          </div>
        ) : (
          filteredLeaves.map((req) => (
            <div key={req.id} className="p-5 hover:bg-slate-50/70 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <img
                    src={req.employeeAvatar}
                    alt={req.employeeName}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{req.employeeName}</h4>
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium">
                        {req.department}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                      <span className="font-semibold text-indigo-700">{req.leaveType}</span>
                      <span>•</span>
                      <span className="font-mono font-medium">
                        {req.startDate} to {req.endDate} ({req.daysCount}{' '}
                        {req.daysCount === 1 ? 'day' : 'days'})
                      </span>
                      <span>•</span>
                      <span className="text-slate-400">Applied on {req.appliedOn}</span>
                    </div>

                    <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 mt-2">
                      <span className="font-semibold text-slate-800">Reason:</span> {req.reason}
                    </p>

                    {req.approvalComments && (
                      <p className="text-xs text-slate-600 mt-1.5 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                        <span>Remarks: {req.approvalComments}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Status & Review Controls */}
                <div className="flex sm:flex-col items-end justify-between gap-3 shrink-0">
                  <LeaveStatusBadge status={req.status} />

                  {req.status === 'Pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setActiveActionModal({ request: req, action: 'reject' });
                          setReviewComment('Declined per department capacity requirements');
                        }}
                        className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => {
                          setActiveActionModal({ request: req, action: 'approve' });
                          setReviewComment('Approved. Have a good break!');
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                      >
                        Approve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Decision Review Confirmation Modal */}
      {activeActionModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div
              className={`p-4 text-white flex items-center justify-between ${
                activeActionModal.action === 'approve' ? 'bg-emerald-600' : 'bg-rose-600'
              }`}
            >
              <h3 className="font-bold text-sm">
                {activeActionModal.action === 'approve' ? 'Approve' : 'Reject'} Leave Request
              </h3>
              <button
                onClick={() => setActiveActionModal(null)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmAction} className="p-6 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                You are about to{' '}
                <strong>
                  {activeActionModal.action === 'approve' ? 'approve' : 'reject'}
                </strong>{' '}
                the <strong>{activeActionModal.request.leaveType}</strong> request ({activeActionModal.request.daysCount} days) for{' '}
                <strong>{activeActionModal.request.employeeName}</strong>.
              </p>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Manager Review Remarks & Feedback
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveActionModal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-white font-semibold shadow-xs ${
                    activeActionModal.action === 'approve'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Confirm {activeActionModal.action === 'approve' ? 'Approval' : 'Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
