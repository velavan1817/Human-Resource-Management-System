import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  Calendar,
  CreditCard,
  FileText,
  Users,
  CheckCircle,
  Bell,
  ChevronRight,
  PlusCircle,
  UserCheck,
  ShieldCheck
} from 'lucide-react';

export const EmployeeDashboard: React.FC = () => {
  const {
    isCheckedIn,
    checkInTimeStr,
    toggleCheckIn,
    employees,
    announcements,
    setIsApplyLeaveModalOpen,
    setActiveTab,
    setInspectingEmployeeId
  } = useApp();

  const currentEmp = employees.find(e => e.id === 'EMP-101') || employees[0];
  const teamMembers = employees.filter(e => e.id !== 'EMP-101');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 4 Cards Grid Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.15fr 1fr 1fr',
          gap: 16
        }}
      >
        {/* Card 1: Check-in / Check-out widget */}
        <div className="card checkin-card">
          <div style={{ flex: 1 }}>
            <div className="card-head" style={{ marginBottom: 8 }}>
              <h3>Check-in</h3>
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 12 }}>
              {isCheckedIn ? (
                <span style={{ color: 'var(--success)', fontWeight: 700 }}>
                  Active Session · In at {checkInTimeStr}
                </span>
              ) : (
                "You're not checked in today"
              )}
            </div>
            <button
              className={`btn-checkin ${isCheckedIn ? 'checked-in' : ''}`}
              onClick={toggleCheckIn}
            >
              <Clock size={15} />
              {isCheckedIn ? 'Check Out' : 'Check In'}
            </button>
          </div>

          <div className="ring-wrap">
            <svg width="74" height="74" viewBox="0 0 74 74">
              <circle cx="37" cy="37" r="30" fill="none" stroke="#EEF0F7" strokeWidth="9" />
              <circle cx="37" cy="37" r="30" fill="var(--accent-soft)" />
            </svg>

            <Clock
              color="var(--accent)"
              style={{
                position: 'absolute',
                top: 22,
                left: 22,
                width: 30,
                height: 30
              }}
            />
          </div>
        </div>

        {/* Card 2: Attendance Overview */}
        <div className="card">
          <div className="card-head">
            <h3>Attendance Overview</h3>
            <div className="date-pick" style={{ padding: '4px 10px', fontSize: 11.5 }}>
              This Week
            </div>
          </div>
          <div style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 26, color: 'var(--ink)' }}>
            4<span style={{ fontSize: 15, color: 'var(--ink-faint)', fontWeight: 600 }}> / 5 Days</span>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginBottom: 2 }}>Present</div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: '80%', background: 'var(--success)' }}></div>
          </div>
          <div className="mini-stat">
            <span>
              Late Arrivals<br /><b>1</b>
            </span>
            <span>
              Early Departures<br /><b>0</b>
            </span>
          </div>
        </div>

        {/* Card 3: Leave Balance */}
        <div className="card">
          <div className="card-head">
            <h3>Leave Balance</h3>
            <span className="link" onClick={() => setActiveTab('leave')}>
              View All →
            </span>
          </div>
          <div className="bal-row">
            <div className="bal-top">
              <span>Casual Leave</span>
              <span>
                {currentEmp.casualLeaveBal.used} / {currentEmp.casualLeaveBal.total} days
              </span>
            </div>
            <div className="progress-track" style={{ height: 7 }}>
              <div
                className="progress-fill"
                style={{
                  width: `${(currentEmp.casualLeaveBal.used / currentEmp.casualLeaveBal.total) * 100}%`,
                  background: 'var(--accent)'
                }}
              ></div>
            </div>
          </div>

          <div className="bal-row">
            <div className="bal-top">
              <span>Sick Leave</span>
              <span>
                {currentEmp.sickLeaveBal.used} / {currentEmp.sickLeaveBal.total} days
              </span>
            </div>
            <div className="progress-track" style={{ height: 7 }}>
              <div
                className="progress-fill"
                style={{
                  width: `${(currentEmp.sickLeaveBal.used / currentEmp.sickLeaveBal.total) * 100}%`,
                  background: 'var(--warn)'
                }}
              ></div>
            </div>
          </div>

          <div className="bal-row">
            <div className="bal-top">
              <span>Earned Leave</span>
              <span>
                {currentEmp.earnedLeaveBal.used} / {currentEmp.earnedLeaveBal.total} days
              </span>
            </div>
            <div className="progress-track" style={{ height: 7 }}>
              <div
                className="progress-fill"
                style={{
                  width: `${(currentEmp.earnedLeaveBal.used / currentEmp.earnedLeaveBal.total) * 100}%`,
                  background: 'var(--teal)'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 4: Next Payroll */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-head">
            <h3>Next Payroll</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div className="li-icon" style={{ background: 'var(--accent-soft)', width: 38, height: 38 }}>
              <Calendar color="var(--accent)" />
            </div>
            <div>
              <div className="li-title" style={{ fontSize: 14 }}>May 31, 2026</div>
              <div className="li-sub">Salary for May 2026</div>
            </div>
          </div>

          <button
            className="btn-secondary"
            style={{ marginTop: 'auto', width: '100%', justifyContent: 'center' }}
            onClick={() => setActiveTab('payslips')}
          >
            View Payslip
          </button>
        </div>
      </div>

      {/* Row 2: 4-Columns (Schedule, Notifications, Quick Links, My Team) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.3fr 0.85fr 0.95fr', gap: 16 }}>
        {/* My Schedule */}
        <div className="card">
          <div className="card-head">
            <h3>My Schedule</h3>
            <span style={{ fontSize: 11.5, color: 'var(--ink-soft)', fontWeight: 600 }}>May 2026</span>
          </div>
          <div className="cal-strip">
            <div className="cal-day">
              <div className="dow">Mon</div>
              <div className="dnum">19</div>
            </div>
            <div className="cal-day today">
              <div className="dow">Tue</div>
              <div className="dnum">20</div>
            </div>
            <div className="cal-day">
              <div className="dow">Wed</div>
              <div className="dnum">21</div>
            </div>
            <div className="cal-day">
              <div className="dow">Thu</div>
              <div className="dnum">22</div>
            </div>
            <div className="cal-day">
              <div className="dow">Fri</div>
              <div className="dnum">23</div>
            </div>
          </div>

          <div className="sched-item">
            <div className="sq"></div>
            <div>
              <div className="st">Engineering Team Standup</div>
              <div className="ss">10:00 AM – 10:30 AM · Google Meet</div>
            </div>
          </div>
        </div>

        {/* Recent Notifications & Announcements */}
        <div className="card">
          <div className="card-head">
            <h3>Recent Announcements</h3>
            <span className="link" onClick={() => setActiveTab('announcements')}>
              View All →
            </span>
          </div>

          {announcements.slice(0, 3).map((anc) => (
            <div key={anc.id} className="list-item">
              <div className="li-icon" style={{ background: 'var(--accent-soft)' }}>
                <Bell color="var(--accent)" />
              </div>
              <div style={{ flex: 1 }}>
                <div className="li-title">{anc.title}</div>
                <div className="li-sub">{anc.postedBy} · {anc.timeAgo}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="card">
          <div className="card-head">
            <h3>Quick Links</h3>
          </div>
          <div className="ql-item" onClick={() => setIsApplyLeaveModalOpen(true)}>
            <div className="ql-ic" style={{ background: 'var(--violet-soft)' }}>
              <FileText color="var(--violet)" />
            </div>
            Apply Leave
          </div>
          <div className="ql-item" onClick={() => setActiveTab('attendance')}>
            <div className="ql-ic" style={{ background: 'var(--success-soft)' }}>
              <Clock color="var(--success)" />
            </div>
            View Attendance
          </div>
          <div className="ql-item" onClick={() => setActiveTab('profile')}>
            <div className="ql-ic" style={{ background: 'var(--accent-soft)' }}>
              <Users color="var(--accent)" />
            </div>
            My Profile
          </div>
          <div className="ql-item" onClick={() => setActiveTab('documents')}>
            <div className="ql-ic" style={{ background: 'var(--teal-soft)' }}>
              <ShieldCheck color="var(--teal)" />
            </div>
            Company Policies
          </div>
        </div>

        {/* My Team */}
        <div className="card">
          <div className="card-head">
            <h3>My Team</h3>
            <span className="link" onClick={() => setActiveTab('team')}>
              View Team →
            </span>
          </div>

          {teamMembers.slice(0, 4).map((m) => (
            <div
              key={m.id}
              className="team-item"
              style={{ cursor: 'pointer' }}
              onClick={() => setInspectingEmployeeId(m.id)}
            >
              <div
                className="avatar"
                style={{
                  width: 30,
                  height: 30,
                  fontSize: 10,
                  background: m.avatarGradient || 'linear-gradient(135deg, #1AA6A0, #375DFB)'
                }}
              >
                {m.initials}
              </div>
              <div>
                <div className="li-title" style={{ fontSize: 12.5 }}>{m.name}</div>
                <div className="li-sub" style={{ fontSize: 10.5 }}>{m.designation}</div>
              </div>
              <span
                className="status-dot"
                style={{
                  background:
                    m.status === 'Present'
                      ? 'var(--success)'
                      : m.status === 'On Leave'
                      ? 'var(--warn)'
                      : 'var(--ink-faint)'
                }}
              ></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
