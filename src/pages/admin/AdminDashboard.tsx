import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Users,
  CalendarCheck,
  CalendarDays,
  DollarSign,
  UserPlus,
  ArrowRight,
  TrendingUp,
  Building,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Send,
  Sparkles,
  PieChart as PieChartIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHRMS } from '../../context/HRMSContext';
import { StatCard } from '../../components/common/StatCard';
import { LeaveStatusBadge, AttendanceBadge } from '../../components/common/Badge';

export const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    employees,
    attendance,
    leaves,
    payroll,
    approveLeave,
    rejectLeave,
    addNotification,
    showToast
  } = useHRMS();
  const navigate = useNavigate();

  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');

  // Key metrics calculation
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === 'Active').length;

  const todayStr = '2026-08-21';
  const todayAttendanceRecords = attendance.filter((a) => a.date === todayStr);
  const todayPresentCount = todayAttendanceRecords.filter((a) => a.status === 'present').length;
  const attendanceRate = totalEmployees > 0 ? ((todayPresentCount / totalEmployees) * 100).toFixed(1) : '94.2';

  const pendingLeaves = leaves.filter((l) => l.status === 'Pending');
  const totalPayrollExpenditure = payroll
    .filter((p) => p.month === 'July 2026')
    .reduce((sum, p) => sum + p.netSalary, 0);

  // Department distribution
  const deptCounts: Record<string, number> = {};
  employees.forEach((emp) => {
    deptCounts[emp.department] = (deptCounts[emp.department] || 0) + 1;
  });

  const handleQuickApprove = (leaveId: string, empName: string) => {
    approveLeave(leaveId, 'Approved by HR Lead on Dashboard');
    showToast('Leave Approved', `Leave request for ${empName} was approved.`, 'success');
  };

  const handleQuickReject = (leaveId: string, empName: string) => {
    rejectLeave(leaveId, 'Rejected due to critical milestone deliverables');
    showToast('Leave Rejected', `Leave request for ${empName} was rejected.`, 'info');
  };

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeMessage.trim()) return;

    addNotification({
      title: noticeTitle,
      message: noticeMessage,
      type: 'info',
      targetRole: 'all',
      sender: currentUser?.name || 'HR Admin'
    });

    setShowNoticeModal(false);
    setNoticeTitle('');
    setNoticeMessage('');
    showToast('Announcement Published', 'All organization members will receive this notification.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight font-display">
              HR Operations Dashboard
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Admin Console
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time workforce intelligence, employee directory, and daily operational approvals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNoticeModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            Post Notice
          </button>
          <button
            onClick={() => navigate('/admin/employees')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add Employee
          </button>
        </div>
      </div>

      {/* 4 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Headcount"
          value={`${totalEmployees} Staff`}
          subtitle={`${activeEmployees} Active employees`}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50 border-blue-100"
          trend={{ value: '+14%', isPositive: true, label: 'vs last quarter' }}
          onClick={() => navigate('/admin/employees')}
        />

        <StatCard
          title="Today's Attendance"
          value={`${todayPresentCount} / ${totalEmployees}`}
          subtitle={`${attendanceRate}% workplace presence`}
          icon={CalendarCheck}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 border-emerald-100"
          trend={{ value: '+3.1%', isPositive: true, label: 'on time' }}
          onClick={() => navigate('/admin/attendance')}
        />

        <StatCard
          title="Pending Leave Review"
          value={`${pendingLeaves.length} Requests`}
          subtitle="Requires supervisor sign-off"
          icon={CalendarDays}
          iconColor="text-amber-600"
          iconBg="bg-amber-50 border-amber-100"
          onClick={() => navigate('/admin/leave')}
        />

        <StatCard
          title="July Total Payroll"
          value={`₹${(totalPayrollExpenditure || 520000).toLocaleString('en-IN')}`}
          subtitle="Disbursed on July 31, 2026"
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 border-emerald-100"
          onClick={() => navigate('/admin/payroll')}
        />
      </div>

      {/* Department Breakdown & Attendance Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Distribution Bento */}
        <div className="stat-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                Department Breakdown
              </h3>
              <span className="text-xs text-gray-400 font-semibold">{Object.keys(deptCounts).length} Units</span>
            </div>

            <div className="space-y-3">
              {Object.entries(deptCounts).map(([dept, count]) => {
                const percentage = Math.round((count / totalEmployees) * 100);
                return (
                  <div key={dept} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-gray-700">{dept}</span>
                      <span className="font-bold text-gray-900">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between text-xs">
            <span className="text-gray-500">Fastest growing: Engineering (+4)</span>
            <Link to="/admin/analytics" className="text-blue-600 font-semibold hover:underline">
              View Analytics →
            </Link>
          </div>
        </div>

        {/* Pending Approvals Quick Review Center */}
        <div className="lg:col-span-2 stat-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-amber-500" />
                  Action Required: Pending Leave Approvals
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Review time-off requests submitted by team members.
                </p>
              </div>

              <Link
                to="/admin/leave"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                All Requests <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {pendingLeaves.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-gray-700">All leave requests processed!</p>
                <p className="text-[11px] text-gray-400">No pending actions requiring HR sign-off.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {pendingLeaves.slice(0, 3).map((req) => (
                  <div key={req.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={req.employeeAvatar}
                        alt={req.employeeName}
                        className="w-10 h-10 rounded-lg object-cover border border-gray-200 bg-gray-50"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-gray-900">{req.employeeName}</p>
                          <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded font-medium">
                            {req.department}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5">
                          <strong className="text-blue-700">{req.leaveType}</strong> ({req.daysCount}{' '}
                          {req.daysCount === 1 ? 'day' : 'days'}) • {req.startDate} to {req.endDate}
                        </p>
                        <p className="text-[11px] text-gray-500 italic mt-0.5">"{req.reason}"</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleQuickReject(req.id, req.employeeName)}
                        className="px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleQuickApprove(req.id, req.employeeName)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
            <span>Automatic email notifications sent upon status update.</span>
            <span className="font-semibold text-gray-700">{pendingLeaves.length} in queue</span>
          </div>
        </div>
      </div>

      {/* Recent Employees Table Overview */}
      <div className="stat-card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Recent Team Directory Snapshot</h3>
            <p className="text-xs text-gray-500">Quick list of registered team members.</p>
          </div>
          <Link
            to="/admin/employees"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            Manage All Staff ({employees.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Emp ID</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Role / Title</th>
                <th className="py-3 px-4">Joining Date</th>
                <th className="py-3 px-4">Monthly CTC</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
              {employees.slice(0, 5).map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{emp.name}</p>
                        <p className="text-[11px] text-gray-400">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-600 font-semibold">{emp.empId}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium text-[11px]">
                      {emp.department}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-800">{emp.position}</td>
                  <td className="py-3 px-4 text-gray-500 font-mono text-[11px]">{emp.joiningDate}</td>
                  <td className="py-3 px-4 font-bold text-gray-900">
                    ₹{emp.salary.netSalary.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Post Notice Announcement Modal */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl border border-gray-200">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-600" />
              Publish Workplace Announcement
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Broadcast an official notification to all employees across departments.
            </p>

            <form onSubmit={handlePostNotice} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Subject Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Townhall Meeting Scheduled for Friday"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Notice Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write the full announcement details..."
                  value={noticeMessage}
                  onChange={(e) => setNoticeMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs cursor-pointer"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
