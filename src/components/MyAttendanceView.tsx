import React from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Calendar, AlertTriangle, UserCheck } from 'lucide-react';

export const MyAttendanceView: React.FC = () => {
  const { isCheckedIn, checkInTimeStr, toggleCheckIn, attendanceLogs } = useApp();

  // Filter logs for Arjun Mehta only
  const myLogs = attendanceLogs.filter(l => l.employeeName === 'Arjun Mehta');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Interactive Check-in Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--navy), var(--navy-2))',
          borderRadius: 'var(--radius)',
          padding: 24,
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase' }}>
            Daily Workstation Check-in
          </div>
          <h2 style={{ fontFamily: 'Manrope', fontSize: 22, fontWeight: 800, margin: '4px 0' }}>
            {isCheckedIn ? `Checked In at ${checkInTimeStr}` : 'Not Checked In Today'}
          </h2>
          <div style={{ fontSize: 12, color: '#C9D0E4' }}>
            Standard Shift: <b>09:00 AM – 06:00 PM (IST)</b> · Engineering Team
          </div>
        </div>

        <button
          className={`btn-checkin ${isCheckedIn ? 'checked-in' : ''}`}
          onClick={toggleCheckIn}
          style={{ width: 'auto', padding: '12px 24px', fontSize: 14 }}
        >
          <Clock size={16} />
          {isCheckedIn ? 'Check Out Now' : 'Check In Now'}
        </button>
      </div>

      {/* Personal Attendance Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <div className="kpi">
          <div className="kpi-ic" style={{ background: 'var(--success-soft)' }}>
            <UserCheck color="var(--success)" />
          </div>
          <div>
            <div className="label">Monthly Attendance Rate</div>
            <div className="value">96.0%</div>
            <div className="foot pos">24 / 25 Days Present</div>
          </div>
        </div>

        <div className="kpi">
          <div className="kpi-ic" style={{ background: 'var(--accent-soft)' }}>
            <Clock color="var(--accent)" />
          </div>
          <div>
            <div className="label">Avg Daily Hours</div>
            <div className="value">8h 45m</div>
            <div className="foot">Target 8h 00m</div>
          </div>
        </div>

        <div className="kpi">
          <div className="kpi-ic" style={{ background: 'var(--warn-soft)' }}>
            <AlertTriangle color="var(--warn)" />
          </div>
          <div>
            <div className="label">Late Arrivals</div>
            <div className="value">1</div>
            <div className="foot warn">15 May (Traffic Delay)</div>
          </div>
        </div>

        <div className="kpi">
          <div className="kpi-ic" style={{ background: 'var(--violet-soft)' }}>
            <Calendar color="var(--violet)" />
          </div>
          <div>
            <div className="label">Overtime Hours</div>
            <div className="value">6h</div>
            <div className="foot pos">Auth Sprint Overtime</div>
          </div>
        </div>
      </div>

      {/* Personal Attendance Log Table */}
      <div className="card">
        <div className="card-head">
          <h3>My Daily Attendance History (May 2026)</h3>
          <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Showing personal logs</span>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Working Hours</th>
                <th>Overtime</th>
                <th>Status</th>
                <th>Notes / Remarks</th>
              </tr>
            </thead>
            <tbody>
              {myLogs.length > 0 ? (
                myLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontWeight: 700 }}>{log.date}</td>
                    <td style={{ fontFamily: 'IBM Plex Mono', fontSize: 12 }}>{log.checkIn}</td>
                    <td style={{ fontFamily: 'IBM Plex Mono', fontSize: 12 }}>{log.checkOut}</td>
                    <td style={{ fontWeight: 600 }}>8h 30m</td>
                    <td>{log.overtimeHours > 0 ? `${log.overtimeHours}h` : '-'}</td>
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
                    <td style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                      {log.anomalyFlag || 'Normal check-in'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td style={{ fontWeight: 700 }}>20 May 2026</td>
                  <td style={{ fontFamily: 'IBM Plex Mono', fontSize: 12 }}>09:02 AM</td>
                  <td style={{ fontFamily: 'IBM Plex Mono', fontSize: 12 }}>06:15 PM</td>
                  <td style={{ fontWeight: 600 }}>9h 13m</td>
                  <td>-</td>
                  <td><span className="badge badge-success">Present</span></td>
                  <td style={{ fontSize: 12, color: 'var(--ink-soft)' }}>On time check-in</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
