import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  CalendarCheck,
  Search,
  Filter,
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Edit2,
  Save,
  X,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { AttendanceStatus, Department } from '../../types';
import { AttendanceBadge } from '../../components/common/Badge';
import { exportToCSV } from '../../components/common/ExportCSV';

export const AdminAttendance: React.FC = () => {
  const { employees, attendance, markManualAttendance, showToast } = useHRMS();

  const [selectedDate, setSelectedDate] = useState('2026-08-21');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterDept, setFilterDept] = useState<string>('All');

  // Manual Edit Modal
  const [editRecord, setEditRecord] = useState<{
    empId: string;
    empName: string;
    status: AttendanceStatus;
    checkIn: string;
    checkOut: string;
    notes: string;
  } | null>(null);

  // Generate roster items for all employees for the selected date
  const roster = employees.map((emp) => {
    const record = attendance.find((a) => a.employeeId === emp.id && a.date === selectedDate);
    return {
      emp,
      record: record || {
        id: `att-temp-${emp.id}`,
        employeeId: emp.id,
        date: selectedDate,
        checkIn: null,
        checkOut: null,
        workingHours: '0h 00m',
        status: 'absent' as AttendanceStatus,
        notes: 'Not recorded'
      }
    };
  });

  const filteredRoster = roster.filter(({ emp, record }) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'All' || record.status === filterStatus;
    const matchesDept = filterDept === 'All' || emp.department === filterDept;

    return matchesSearch && matchesStatus && matchesDept;
  });

  // Summary counts
  const totalStaff = roster.length;
  const presentCount = roster.filter((r) => r.record.status === 'present').length;
  const absentCount = roster.filter((r) => r.record.status === 'absent').length;
  const leaveCount = roster.filter((r) => r.record.status === 'leave').length;
  const halfDayCount = roster.filter((r) => r.record.status === 'half_day').length;

  const complianceRate = totalStaff > 0 ? ((presentCount / totalStaff) * 100).toFixed(1) : '0.0';

  const handleSaveManualAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRecord) return;

    markManualAttendance(
      editRecord.empId,
      selectedDate,
      editRecord.status,
      editRecord.checkIn || undefined,
      editRecord.checkOut || undefined,
      editRecord.notes
    );

    setEditRecord(null);
  };

  const handleExport = () => {
    const data = filteredRoster.map(({ emp, record }) => ({
      Date: selectedDate,
      EmployeeID: emp.empId,
      FullName: emp.name,
      Department: emp.department,
      CheckIn: record.checkIn || 'N/A',
      CheckOut: record.checkOut || 'N/A',
      WorkingHours: record.workingHours,
      Status: record.status,
      Notes: record.notes || ''
    }));
    exportToCSV(`Dayflow-Company-Attendance-${selectedDate}.csv`, data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-display">
            Company Attendance Roster
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time biometric attendance tracker and manual timesheet adjustments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export Day Sheet
          </button>
        </div>
      </div>

      {/* Date selector & KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Selected Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-semibold"
          />
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Present</span>
          <p className="text-2xl font-bold text-emerald-700 font-display mt-1">{presentCount}</p>
          <span className="text-[11px] text-slate-500 font-medium">
            {complianceRate}% attendance
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">On Leave</span>
          <p className="text-2xl font-bold text-indigo-700 font-display mt-1">{leaveCount}</p>
          <span className="text-[11px] text-slate-500 font-medium">Approved leave</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Half Day</span>
          <p className="text-2xl font-bold text-amber-700 font-display mt-1">{halfDayCount}</p>
          <span className="text-[11px] text-slate-500 font-medium">Partial shifts</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Absent</span>
          <p className="text-2xl font-bold text-rose-700 font-display mt-1">{absentCount}</p>
          <span className="text-[11px] text-slate-500 font-medium">Not checked in</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:bg-white"
          >
            <option value="All">All Statuses ({roster.length})</option>
            <option value="present">Present ({presentCount})</option>
            <option value="absent">Absent ({absentCount})</option>
            <option value="leave">Leave ({leaveCount})</option>
            <option value="half_day">Half Day ({halfDayCount})</option>
          </select>

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

      {/* Attendance Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Emp ID</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Punch In</th>
                <th className="py-3.5 px-4">Punch Out</th>
                <th className="py-3.5 px-4">Working Hours</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Notes</th>
                <th className="py-3.5 px-4 text-right">Quick Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredRoster.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-400">
                    No records found for current criteria.
                  </td>
                </tr>
              ) : (
                filteredRoster.map(({ emp, record }) => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 bg-slate-50"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{emp.name}</p>
                          <p className="text-[11px] text-slate-400">{emp.position}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-700">{emp.empId}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {emp.department}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">{record.checkIn || '—'}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">{record.checkOut || '—'}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                      {record.workingHours}
                    </td>
                    <td className="py-3 px-4">
                      <AttendanceBadge status={record.status} />
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">{record.notes || '—'}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() =>
                          setEditRecord({
                            empId: emp.id,
                            empName: emp.name,
                            status: record.status,
                            checkIn: record.checkIn || '09:00 AM',
                            checkOut: record.checkOut || '06:00 PM',
                            notes: record.notes || ''
                          })
                        }
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="Override Timesheet / Status"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Attendance Adjustment Modal */}
      {editRecord && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">
                Override Timesheet: {editRecord.empName}
              </h3>
              <button
                onClick={() => setEditRecord(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveManualAttendance} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Attendance Status</label>
                <select
                  value={editRecord.status}
                  onChange={(e) =>
                    setEditRecord({
                      ...editRecord,
                      status: e.target.value as AttendanceStatus
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="present">Present (Standard Shift)</option>
                  <option value="half_day">Half Day</option>
                  <option value="leave">On Leave</option>
                  <option value="absent">Absent / Unexcused</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Check-In Time</label>
                  <input
                    type="text"
                    placeholder="09:00 AM"
                    value={editRecord.checkIn}
                    onChange={(e) => setEditRecord({ ...editRecord, checkIn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Check-Out Time</label>
                  <input
                    type="text"
                    placeholder="06:00 PM"
                    value={editRecord.checkOut}
                    onChange={(e) => setEditRecord({ ...editRecord, checkOut: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Admin Audit Note</label>
                <input
                  type="text"
                  placeholder="e.g. Manual correction by HR supervisor"
                  value={editRecord.notes}
                  onChange={(e) => setEditRecord({ ...editRecord, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditRecord(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                >
                  Save Timesheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
