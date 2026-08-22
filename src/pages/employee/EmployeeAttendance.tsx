import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  CalendarCheck,
  Clock,
  Calendar as CalendarIcon,
  Download,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHRMS } from '../../context/HRMSContext';
import { AttendanceBadge } from '../../components/common/Badge';
import { exportToCSV } from '../../components/common/ExportCSV';

export const EmployeeAttendance: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    getTodayAttendance,
    getMonthAttendance,
    checkIn,
    checkOut,
    attendance
  } = useHRMS();

  const [selectedMonth, setSelectedMonth] = useState(8); // August
  const [selectedYear, setSelectedYear] = useState(2026);
  const [viewMode, setViewMode] = useState<'calendar' | 'table'>('calendar');
  const [searchTerm, setSearchTerm] = useState('');

  const empId = currentUser?.id || 'emp-001';
  const todayAttendance = getTodayAttendance(empId);
  const isCheckedIn = !!todayAttendance?.checkIn && !todayAttendance?.checkOut;

  const monthRecords = getMonthAttendance(empId, selectedYear, selectedMonth);

  // Filtered for table view
  const filteredRecords = monthRecords.filter(
    (r) =>
      r.date.includes(searchTerm) ||
      r.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.checkIn && r.checkIn.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Statistics calculation for the month
  const totalDays = 21; // up to today
  const presentCount = monthRecords.filter((r) => r.status === 'present').length;
  const leaveCount = monthRecords.filter((r) => r.status === 'leave').length;
  const halfDayCount = monthRecords.filter((r) => r.status === 'half_day').length;
  const absentCount = monthRecords.filter((r) => r.status === 'absent').length;

  const handleExport = () => {
    const rows = monthRecords.map((r) => ({
      Date: r.date,
      EmployeeID: currentUser?.empId || 'EMP001',
      EmployeeName: currentUser?.name || 'Arun Kumar',
      CheckIn: r.checkIn || 'N/A',
      CheckOut: r.checkOut || 'N/A',
      WorkingHours: r.workingHours,
      Status: r.status
    }));
    exportToCSV(`Dayflow-Attendance-${currentUser?.empId || 'EMP001'}-${selectedYear}-08.csv`, rows);
  };

  // Calendar Day Generation (August 2026: Aug 1 is Saturday)
  const daysInMonth = 31;
  const firstDayOfMonth = new Date(2026, 7, 1).getDay(); // Saturday = 6

  const calendarCells = [];
  // Empty padding for days before Aug 1
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day);
  }

  const getRecordForDay = (day: number) => {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const dateStr = `2026-08-${dayStr}`;
    return monthRecords.find((r) => r.date === dateStr);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-display">
            Attendance Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time biometric punch log, working hours, and monthly compliance calendar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Table Log
            </button>
          </div>

          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Today's Punch & Status Live Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Today's Status (Aug 21, 2026)
                </span>
                <AttendanceBadge status={todayAttendance?.status || 'present'} />
              </div>
              <div className="flex flex-wrap items-baseline gap-4 mt-2">
                <div>
                  <span className="text-[11px] text-slate-400">Punch In:</span>{' '}
                  <span className="text-sm font-bold text-slate-900 font-mono">
                    {todayAttendance?.checkIn || '--:--'}
                  </span>
                </div>
                <span className="text-slate-300">|</span>
                <div>
                  <span className="text-[11px] text-slate-400">Punch Out:</span>{' '}
                  <span className="text-sm font-bold text-slate-900 font-mono">
                    {todayAttendance?.checkOut || '--:--'}
                  </span>
                </div>
                <span className="text-slate-300">|</span>
                <div>
                  <span className="text-[11px] text-slate-400">Working Hours:</span>{' '}
                  <span className="text-sm font-bold text-emerald-700 font-mono">
                    {todayAttendance?.workingHours || '0h 00m'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!todayAttendance?.checkIn ? (
              <button
                onClick={() => checkIn(empId)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              >
                Punch Check In
              </button>
            ) : !todayAttendance?.checkOut ? (
              <button
                onClick={() => checkOut(empId)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all cursor-pointer"
              >
                Punch Check Out
              </button>
            ) : (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
                ✓ Shift Completed & Recorded
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Month Analytics Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Present Days</span>
          <p className="text-2xl font-bold text-slate-900 font-display mt-1">{presentCount}</p>
          <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">95.2% compliance</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Approved Leaves</span>
          <p className="text-2xl font-bold text-indigo-900 font-display mt-1">{leaveCount}</p>
          <span className="text-[11px] text-indigo-600 font-medium mt-0.5 block">1 Sick Leave on Aug 12</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Half Days</span>
          <p className="text-2xl font-bold text-amber-900 font-display mt-1">{halfDayCount}</p>
          <span className="text-[11px] text-amber-600 font-medium mt-0.5 block">0 recorded</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Absent / Unexcused</span>
          <p className="text-2xl font-bold text-rose-900 font-display mt-1">{absentCount}</p>
          <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">0 unauthorized</span>
        </div>
      </div>

      {/* Main View: Calendar or Table */}
      {viewMode === 'calendar' ? (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-base">August 2026 Attendance Calendar</h3>
            </div>

            {/* Legend */}
            <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Present
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Leave
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Half Day
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Weekend
              </span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dow, idx) => (
              <div key={idx} className="text-center font-bold text-xs text-slate-400 py-2">
                {dow}
              </div>
            ))}

            {calendarCells.map((day, idx) => {
              if (!day) {
                return <div key={idx} className="min-h-20 bg-slate-50/50 rounded-xl border border-dashed border-slate-100" />;
              }

              const record = getRecordForDay(day);
              const isFuture = day > 21;
              const isToday = day === 21;
              const dayOfWeek = new Date(2026, 7, day).getDay();
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

              return (
                <div
                  key={idx}
                  className={`min-h-20 sm:min-h-24 p-2 sm:p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                    isToday
                      ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                      : isFuture
                      ? 'border-slate-100 bg-slate-50/40 opacity-50'
                      : isWeekend
                      ? 'border-slate-200 bg-slate-50/80 text-slate-400'
                      : record?.status === 'present'
                      ? 'border-emerald-200 bg-emerald-50/30'
                      : record?.status === 'leave'
                      ? 'border-indigo-200 bg-indigo-50/50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isToday ? 'text-indigo-600' : 'text-slate-700'
                      }`}
                    >
                      {day}
                    </span>
                    {isToday && (
                      <span className="text-[9px] font-bold text-indigo-700 bg-indigo-100 px-1 py-0.2 rounded">
                        Today
                      </span>
                    )}
                  </div>

                  <div className="my-1">
                    {isWeekend ? (
                      <span className="text-[10px] text-slate-400 font-medium">Off</span>
                    ) : record?.status === 'present' ? (
                      <div>
                        <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                          Present
                        </span>
                        <p className="text-[9px] font-mono text-slate-500 mt-1 hidden sm:block">
                          {record.workingHours}
                        </p>
                      </div>
                    ) : record?.status === 'leave' ? (
                      <span className="inline-block text-[10px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">
                        Sick Leave
                      </span>
                    ) : isFuture ? (
                      <span className="text-[10px] text-slate-400">Scheduled</span>
                    ) : (
                      <span className="text-[10px] text-slate-400">-</span>
                    )}
                  </div>

                  <div className="text-[9px] font-mono text-slate-400">
                    {record?.checkIn ? record.checkIn.split(' ')[0] : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search date or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredRecords.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Punch In</th>
                  <th className="py-3.5 px-4">Punch Out</th>
                  <th className="py-3.5 px-4">Working Hours</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">{rec.date}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{rec.checkIn || '—'}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{rec.checkOut || '—'}</td>
                    <td className="py-3 px-4 font-mono text-emerald-700 font-semibold">
                      {rec.workingHours}
                    </td>
                    <td className="py-3 px-4">
                      <AttendanceBadge status={rec.status} />
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">{rec.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
