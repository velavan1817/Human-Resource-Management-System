import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, AlertTriangle, CheckCircle, Calendar, Filter, Zap, ArrowUpRight } from 'lucide-react';

export const AttendanceManagement: React.FC = () => {
  const { attendanceLogs, setActiveTab, showToast } = useApp();
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredLogs = statusFilter === 'ALL'
    ? attendanceLogs
    : attendanceLogs.filter(l => l.status.toUpperCase() === statusFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Attendance Insights Banner (Prompt Item #12: Attendance Insights) */}
      <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
        <div className="card-head">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap color="var(--accent)" size={18} /> Proactive Attendance Insights
          </h3>
          <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Powered by DAYFLOW Intelligence</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          <div style={{ background: 'var(--accent-soft)', borderRadius: 12, padding: 14, border: '1px solid #D3DEFF' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>
              Overall Attendance Trend
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 4 }}>
              <b>WHAT:</b> Attendance is 3.2% higher compared to last month.<br />
              <b>WHY:</b> WFH policy clarification reduced Friday absenteeism.<br />
              <b>REVIEW:</b> Maintain flex-hours schedule.
            </div>
          </div>

          <div style={{ background: 'var(--warn-soft)', borderRadius: 12, padding: 14, border: '1px solid #F2DFB2' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--warn)' }}>
              Monday Absenteeism Pattern
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 4 }}>
              <b>WHAT:</b> Monday absenteeism increased by 14% in Engineering.<br />
              <b>WHY:</b> Consecutive sprint deadlines causing burnout.<br />
              <b>REVIEW:</b> Review Engineering sprint workload.
            </div>
          </div>

          <div style={{ background: 'var(--danger-soft)', borderRadius: 12, padding: 14, border: '1px solid #F3CFCC' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--danger)' }}>
              Repeated Late Arrivals
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 4 }}>
              <b>WHAT:</b> 5 employees recorded below 75% attendance.<br />
              <b>WHY:</b> Commute delay patterns on suburban routes.<br />
              <b>REVIEW:</b> Consider flexible check-in windows.
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Logs Table */}
      <div className="card">
        <div className="card-head">
          <h3>Daily Attendance Roster</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter size={14} color="var(--ink-soft)" />
            {['ALL', 'PRESENT', 'LATE', 'ABSENT'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '5px 11px',
                  borderRadius: 8,
                  border: '1px solid',
                  borderColor: statusFilter === st ? 'var(--accent)' : 'var(--line)',
                  background: statusFilter === st ? 'var(--accent-soft)' : 'var(--surface)',
                  color: statusFilter === st ? 'var(--accent)' : 'var(--ink-soft)'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Overtime</th>
                <th>Status</th>
                <th>Anomaly Flag</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => (
                <tr key={log.id}>
                  <td style={{ fontWeight: 700 }}>{log.employeeName}</td>
                  <td>{log.department}</td>
                  <td>{log.date}</td>
                  <td style={{ fontFamily: 'IBM Plex Mono', fontSize: 12 }}>{log.checkIn}</td>
                  <td style={{ fontFamily: 'IBM Plex Mono', fontSize: 12 }}>{log.checkOut}</td>
                  <td style={{ fontWeight: 600 }}>{log.overtimeHours > 0 ? `${log.overtimeHours}h` : '-'}</td>
                  <td>
                    <span
                      className={`badge ${
                        log.status === 'Present'
                          ? 'badge-success'
                          : log.status === 'Late'
                          ? 'badge-warning'
                          : 'badge-danger'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td>
                    {log.anomalyFlag ? (
                      <span style={{ fontSize: 11, color: 'var(--danger)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <AlertTriangle size={13} /> {log.anomalyFlag}
                      </span>
                    ) : (
                      <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>Normal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
