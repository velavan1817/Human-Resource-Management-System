import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Clock,
  CalendarCheck,
  CalendarDays,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Coffee,
  Plane,
  Briefcase,
  Bell,
  Download,
  Calendar,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHRMS } from '../../context/HRMSContext';
import { StatCard } from '../../components/common/StatCard';
import { AttendanceBadge, LeaveStatusBadge } from '../../components/common/Badge';
import { COMPANY_HOLIDAYS } from '../../data/mockData';

export const EmployeeDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    getTodayAttendance,
    getWeeklyAttendance,
    checkIn,
    checkOut,
    leaves,
    payroll,
    notifications
  } = useHRMS();
  const navigate = useNavigate();

  const [liveSeconds, setLiveSeconds] = useState(0);

  const empId = currentUser?.id || 'emp-001';
  const todayAttendance = getTodayAttendance(empId);
  const weeklyAttendance = getWeeklyAttendance(empId);

  // Timer simulation for checked in state
  const isCheckedIn = !!todayAttendance?.checkIn && !todayAttendance?.checkOut;

  useEffect(() => {
    let interval: any = null;
    if (isCheckedIn) {
      interval = setInterval(() => {
        setLiveSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn]);

  const handleCheckIn = () => {
    checkIn(empId);
  };

  const handleCheckOut = () => {
    checkOut(empId);
  };

  // Metrics calculation
  const myLeaves = leaves.filter((l) => l.employeeId === empId);
  const pendingLeaves = myLeaves.filter((l) => l.status === 'Pending').length;
  const latestPayroll = payroll.find((p) => p.employeeId === empId);

  // Days present in August
  const presentDays = 19;
  const attendanceRate = '95.2%';

  // Weekly data for chart visualizer
  const daysOfWeek = ['Mon (17)', 'Tue (18)', 'Wed (19)', 'Thu (20)', 'Fri (21)', 'Sat (22)', 'Sun (23)'];
  const weekRecords = [
    { day: 'Mon', date: 'Aug 17', status: 'present', hours: 9.1, code: 'P' },
    { day: 'Tue', date: 'Aug 18', status: 'present', hours: 8.8, code: 'P' },
    { day: 'Wed', date: 'Aug 19', status: 'present', hours: 9.4, code: 'P' },
    { day: 'Thu', date: 'Aug 20', status: 'present', hours: 8.9, code: 'P' },
    { day: 'Fri', date: 'Today', status: isCheckedIn ? 'present' : 'present', hours: 8.3, code: 'P' },
    { day: 'Sat', date: 'Aug 22', status: 'weekend', hours: 0, code: '—' },
    { day: 'Sun', date: 'Aug 23', status: 'weekend', hours: 0, code: '—' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight font-display">
              Good Morning, {currentUser?.name?.split(' ')[0] || 'Arun'} 👋
            </h1>
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Shift Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Here's what's happening with your workplace and schedule today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/employee/leave')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition-colors cursor-pointer"
          >
            <Plane className="w-3.5 h-3.5" />
            Apply for Leave
          </button>
          <button
            onClick={() => navigate('/employee/payroll')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            Latest Payslip
          </button>
        </div>
      </div>

      {/* Primary Workplace Command Center Card (Check-in/out) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Live Attendance Hero Card */}
        <div className="lg:col-span-2 attendance-gradient rounded-xl p-6 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-white/15 backdrop-blur-md text-white border border-white/20">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-blue-100 tracking-wider uppercase">
                    Today's Attendance
                  </span>
                  <p className="text-xs text-blue-100/90 font-medium">Friday, August 21, 2026</p>
                </div>
              </div>

              {isCheckedIn ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-blue-700 shadow-xs animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  CHECKED IN
                </span>
              ) : todayAttendance?.checkOut ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30">
                  SHIFT COMPLETED
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-gray-900 shadow-xs">
                  NOT CHECKED IN
                </span>
              )}
            </div>

            {/* Time & Duration row */}
            <div className="grid grid-cols-3 gap-4 my-6 bg-white/10 rounded-xl p-4 border border-white/15 backdrop-blur-xs">
              <div>
                <span className="text-[10px] text-blue-100 uppercase tracking-wider font-bold">
                  Check-In
                </span>
                <p className="text-base sm:text-lg font-bold text-white font-mono mt-0.5">
                  {todayAttendance?.checkIn || '--:--'}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-blue-100 uppercase tracking-wider font-bold">
                  Check-Out
                </span>
                <p className="text-base sm:text-lg font-bold text-white font-mono mt-0.5">
                  {todayAttendance?.checkOut || '--:--'}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-blue-100 uppercase tracking-wider font-bold">
                  Shift Duration
                </span>
                <p className="text-base sm:text-lg font-bold text-emerald-200 font-mono mt-0.5">
                  {todayAttendance?.workingHours || '0h 00m'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-white/15">
            <p className="text-xs text-blue-100 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              Standard workday: 09:00 AM – 06:00 PM (8h minimum)
            </p>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {!todayAttendance?.checkIn ? (
                <button
                  onClick={handleCheckIn}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-white hover:bg-gray-50 active:bg-gray-100 text-blue-700 font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Punch Check In
                </button>
              ) : !todayAttendance?.checkOut ? (
                <button
                  onClick={handleCheckOut}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/30 transition-all cursor-pointer"
                >
                  Punch Check Out
                </button>
              ) : (
                <button
                  disabled
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-white/20 text-white/80 font-semibold text-xs cursor-not-allowed"
                >
                  ✓ Attendance Recorded
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Leave Balance Snapshot Card */}
        <div className="stat-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-blue-600" />
                Leave Balances (2026)
              </span>
              <Link to="/employee/leave" className="text-xs text-blue-600 hover:underline font-semibold">
                Manage
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-800">Paid Leave</span>
                  <p className="text-[11px] text-gray-500">14 total quota</p>
                </div>
                <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-display">
                  12 Left
                </span>
              </div>

              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-800">Sick Leave</span>
                  <p className="text-[11px] text-gray-500">8 total quota</p>
                </div>
                <span className="text-sm font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 font-display">
                  7 Left
                </span>
              </div>

              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-800">Casual Leave</span>
                  <p className="text-[11px] text-gray-500">6 total quota</p>
                </div>
                <span className="text-sm font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 font-display">
                  6 Left
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 mt-4 text-center">
            <span className="text-[11px] text-gray-500">
              {pendingLeaves > 0 ? (
                <span className="text-amber-600 font-semibold">
                  ⚠️ {pendingLeaves} leave request currently pending review
                </span>
              ) : (
                'All leave applications processed'
              )}
            </span>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="August Attendance"
          value={`${presentDays} Days`}
          subtitle="95.2% monthly compliance"
          icon={CalendarCheck}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 border-emerald-100"
          trend={{ value: '+2.4%', isPositive: true, label: 'vs July' }}
          onClick={() => navigate('/employee/attendance')}
        />

        <StatCard
          title="Active Leave Status"
          value={pendingLeaves > 0 ? `${pendingLeaves} Pending` : '0 Pending'}
          subtitle="1 Approved recently (Sick Leave)"
          icon={CalendarDays}
          iconColor="text-blue-600"
          iconBg="bg-blue-50 border-blue-100"
          onClick={() => navigate('/employee/leave')}
        />

        <StatCard
          title="Monthly Net Payroll"
          value={`₹${(currentUser?.salary?.netSalary || 67000).toLocaleString('en-IN')}`}
          subtitle="July payout credited on 31st"
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 border-emerald-100"
          onClick={() => navigate('/employee/payroll')}
        />
      </div>

      {/* Interactive Weekly Attendance Visualizer & Upcoming Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Attendance Interactive Visualizer */}
        <div className="lg:col-span-2 stat-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                Weekly Attendance Record
              </h3>
              <p className="text-xs text-gray-500">Mon, Aug 17 – Sun, Aug 23, 2026</p>
            </div>
            <Link
              to="/employee/attendance"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Full History <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {weekRecords.map((item, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border flex flex-col items-center justify-between text-center transition-all ${
                  item.date === 'Today'
                    ? 'border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/20'
                    : item.status === 'weekend'
                    ? 'border-gray-200 bg-gray-50 opacity-60'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span className="text-[11px] font-semibold text-gray-600">{item.day}</span>
                <span className="text-[10px] text-gray-400 mt-0.5">{item.date}</span>

                <div className="my-3">
                  {item.status === 'present' ? (
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200">
                      P
                    </span>
                  ) : item.status === 'leave' ? (
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center border border-blue-200">
                      L
                    </span>
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 font-bold text-xs flex items-center justify-center border border-gray-200">
                      —
                    </span>
                  )}
                </div>

                <span className="text-[11px] font-mono text-gray-600 font-medium">
                  {item.hours > 0 ? `${item.hours}h` : 'Off'}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> P: Present
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> L: Approved Leave
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-400" /> Weekend / Off
              </span>
            </div>
            <span className="font-semibold text-gray-700">Total Week Hours: 44.5h</span>
          </div>
        </div>

        {/* Upcoming Holidays & Events */}
        <div className="stat-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Upcoming Holidays
              </h3>
              <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                2026 Calendar
              </span>
            </div>

            <div className="space-y-3">
              {COMPANY_HOLIDAYS.slice(0, 4).map((hol, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-gray-900">{hol.name}</p>
                    <p className="text-[11px] text-gray-500">{hol.type}</p>
                  </div>
                  <span className="text-xs font-mono font-semibold text-gray-800 bg-white px-2 py-1 rounded-md border border-gray-200">
                    {hol.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 mt-4 flex justify-between items-center text-xs">
            <span className="text-gray-500">Annual Paid Holidays: 14</span>
            <Link to="/employee/leave" className="text-blue-600 font-semibold hover:underline">
              Plan Leaves →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity & Notification Stream */}
      <div className="stat-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            Recent Activity & Notification Stream
          </h3>
          <Link to="/employee/notifications" className="text-xs text-blue-600 font-semibold hover:underline">
            View All
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {notifications.slice(0, 4).map((notif) => (
            <div key={notif.id} className="py-3 flex items-start gap-3">
              <div className="mt-0.5">
                <span
                  className={`w-2 h-2 rounded-full block ${
                    notif.type === 'success'
                      ? 'bg-emerald-500'
                      : notif.type === 'warning'
                      ? 'bg-amber-500'
                      : 'bg-blue-500'
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900">{notif.title}</p>
                <p className="text-xs text-gray-600 mt-0.5">{notif.message}</p>
                <span className="text-[10px] text-gray-400 mt-1 block">
                  {notif.timestamp} {notif.sender && `• by ${notif.sender}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
