import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  UserCheck,
  Clock,
  UserX,
  TrendingUp,
  AlertTriangle,
  FileText,
  Calendar,
  UserPlus,
  BarChart3,
  Megaphone,
  ChevronRight
} from 'lucide-react';

export const HRDashboard: React.FC = () => {
  const {
    employees,
    leaveRequests,
    attentionAlerts,
    importantDates,
    setActiveTab,
    setInspectingLeaveId,
    setIsAddDateModalOpen,
    setIsAddAnnouncementModalOpen,
    showToast
  } = useApp();

  const totalEmployees = employees.length > 0 ? 248 : 0;
  const presentToday = 198;
  const onLeaveToday = 32;
  const absentToday = 18;
  const avgAttendance = 92.4;

  const pendingLeaves = leaveRequests.filter(r => r.status === 'Pending');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 5 KPI Metric Cards */}
      <div className="kpi-row">
        <div className="kpi">
          <div className="kpi-ic" style={{ background: 'var(--accent-soft)' }}>
            <Users color="var(--accent)" />
          </div>
          <div>
            <div className="label">Total Employees</div>
            <div className="value">{totalEmployees}</div>
            <div className="foot pos">▲ 12 from last month</div>
          </div>
        </div>

        <div className="kpi">
          <div className="kpi-ic" style={{ background: 'var(--success-soft)' }}>
            <UserCheck color="var(--success)" />
          </div>
          <div>
            <div className="label">Present Today</div>
            <div className="value">{presentToday}</div>
            <div className="foot">79.8% of total</div>
          </div>
        </div>

        <div className="kpi">
          <div className="kpi-ic" style={{ background: 'var(--warn-soft)' }}>
            <Clock color="var(--warn)" />
          </div>
          <div>
            <div className="label">On Leave Today</div>
            <div className="value">{onLeaveToday}</div>
            <div className="foot warn">12.9% of total</div>
          </div>
        </div>

        <div className="kpi">
          <div className="kpi-ic" style={{ background: 'var(--danger-soft)' }}>
            <UserX color="var(--danger)" />
          </div>
          <div>
            <div className="label">Absent Today</div>
            <div className="value">{absentToday}</div>
            <div className="foot neg">7.3% of total</div>
          </div>
        </div>

        <div className="kpi">
          <div className="kpi-ic" style={{ background: 'var(--violet-soft)' }}>
            <TrendingUp color="var(--violet)" />
          </div>
          <div>
            <div className="label">Avg Attendance</div>
            <div className="value">{avgAttendance}%</div>
            <div className="foot pos">▲ 3.6% from last month</div>
          </div>
        </div>
      </div>

      {/* Row 1: 3-Columns (HR Intelligence Alerts, Attendance Donut, Leave Impact) */}
      <div className="row-3col">
        {/* Card 1: HR Intelligence Alerts */}
        <div className="card">
          <div className="card-head">
            <h3>HR Intelligence Alerts</h3>
            <span className="link" onClick={() => setActiveTab('attention_center')}>
              View All →
            </span>
          </div>

          <div className="alert high">
            <div className="alert-ic" style={{ background: '#F3CFCC' }}>
              <AlertTriangle color="var(--danger)" />
            </div>
            <div style={{ flex: 1 }}>
              <div className="alert-title">High Late Arrivals Detected</div>
              <div className="alert-body">6 employees have been late 4+ times in the last 2 weeks.</div>
              <div className="alert-meta">Impact: <b>MEDIUM</b> · 6 Employees</div>
            </div>
            <button
              className="alert-btn hi"
              onClick={() => setActiveTab('attention_center')}
            >
              Investigate
            </button>
          </div>

          <div className="alert med">
            <div className="alert-ic" style={{ background: '#F2DFB2' }}>
              <FileText color="var(--warn)" />
            </div>
            <div style={{ flex: 1 }}>
              <div className="alert-title">Leave Concentration Risk</div>
              <div className="alert-body">4 members of Backend Team are on leave on Monday.</div>
              <div className="alert-meta">Impact: <b>HIGH</b> · Backend Team</div>
            </div>
            <button
              className="alert-btn md"
              onClick={() => {
                const target = leaveRequests.find(r => r.department === 'Backend');
                if (target) setInspectingLeaveId(target.id);
              }}
            >
              View Impact
            </button>
          </div>

          <div className="alert med">
            <div className="alert-ic" style={{ background: '#F2DFB2' }}>
              <TrendingUp color="var(--warn)" />
            </div>
            <div style={{ flex: 1 }}>
              <div className="alert-title">Increasing Absenteeism</div>
              <div className="alert-body">Absenteeism rate increased by 18% in last 3 weeks.</div>
              <div className="alert-meta">Impact: <b>MEDIUM</b> · 9 Employees</div>
            </div>
            <button
              className="alert-btn md"
              onClick={() => setActiveTab('attention_center')}
            >
              Investigate
            </button>
          </div>
        </div>

        {/* Card 2: Attendance Donut Ring */}
        <div className="card">
          <div className="card-head">
            <h3>Attendance Overview</h3>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 12px' }}>
            <svg width="150" height="150" viewBox="0 0 150 150">
              <circle cx="75" cy="75" r="58" fill="none" stroke="#EEF0F7" strokeWidth="20" />
              <circle
                cx="75"
                cy="75"
                r="58"
                fill="none"
                stroke="#12875A"
                strokeWidth="20"
                strokeDasharray="290.9 365"
                transform="rotate(-90 75 75)"
              />
              <circle
                cx="75"
                cy="75"
                r="58"
                fill="none"
                stroke="#D6A94A"
                strokeWidth="20"
                strokeDasharray="47 365"
                strokeDashoffset="-290.9"
                transform="rotate(-90 75 75)"
              />
              <circle
                cx="75"
                cy="75"
                r="58"
                fill="none"
                stroke="#C6403C"
                strokeWidth="20"
                strokeDasharray="26.4 365"
                strokeDashoffset="-337.9"
                transform="rotate(-90 75 75)"
              />
              <circle
                cx="75"
                cy="75"
                r="58"
                fill="none"
                stroke="#9AA1B4"
                strokeWidth="20"
                strokeDasharray="17.5 365"
                strokeDashoffset="-364.3"
                transform="rotate(-90 75 75)"
              />
              <text x="75" y="72" textAnchor="middle" fontFamily="Manrope" fontWeight="800" fontSize="26" fill="#12182B">
                248
              </text>
              <text x="75" y="90" textAnchor="middle" fontFamily="Inter" fontSize="11" fill="#9AA1B4">
                Total
              </text>
            </svg>
          </div>
          <div className="dl-row">
            <span className="dl-dot" style={{ background: '#12875A' }}></span>
            <span className="dl-name">Present</span>
            <span className="dl-val">198</span>
            <span className="dl-pct">(79.8%)</span>
          </div>
          <div className="dl-row">
            <span className="dl-dot" style={{ background: '#D6A94A' }}></span>
            <span className="dl-name">On Leave</span>
            <span className="dl-val">32</span>
            <span className="dl-pct">(12.9%)</span>
          </div>
          <div className="dl-row">
            <span className="dl-dot" style={{ background: '#C6403C' }}></span>
            <span className="dl-name">Absent</span>
            <span className="dl-val">18</span>
            <span className="dl-pct">(7.3%)</span>
          </div>
          <div className="dl-row">
            <span className="dl-dot" style={{ background: '#9AA1B4' }}></span>
            <span className="dl-name">Half Day</span>
            <span className="dl-val">12</span>
            <span className="dl-pct">(4.8%)</span>
          </div>
        </div>

        {/* Card 3: Leave Impact (This Week) */}
        <div className="card">
          <div className="card-head">
            <h3>Leave Impact <small>(This Week)</small></h3>
            <span className="link" onClick={() => setActiveTab('leave_management')}>
              View All →
            </span>
          </div>
          <div className="li-box">
            <Users color="var(--danger)" />
            <div>
              <div className="t">{pendingLeaves.length || 5} Leave Requests need review</div>
              <div className="s">High impact on Backend & Product teams</div>
            </div>
          </div>
          <div className="card-head" style={{ marginBottom: 4 }}>
            <h3 style={{ fontSize: 13 }}>Top Impacted Teams</h3>
          </div>
          <div className="impact-head">
            <span style={{ flex: 1 }}>Team</span>
            <span>Impact Level</span>
          </div>
          <div
            className="impact-row"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              const req = leaveRequests.find(r => r.department === 'Backend');
              if (req) setInspectingLeaveId(req.id);
            }}
          >
            <span className="impact-team">Backend Development</span>
            <span className="impact-tag HIGH">HIGH (62%)</span>
          </div>
          <div className="impact-row">
            <span className="impact-team">Product Design</span>
            <span className="impact-tag MEDIUM">MEDIUM</span>
          </div>
          <div className="impact-row">
            <span className="impact-team">QA Team</span>
            <span className="impact-tag LOW">LOW</span>
          </div>
        </div>
      </div>

      {/* Row 2: 3-Columns (Trends & Insights Line Graph, Upcoming Dates, Quick Actions) */}
      <div className="row-3col-b">
        {/* Card 1: Trends & Insights Line SVG Chart */}
        <div className="card">
          <div className="card-head">
            <h3>Trends & Insights</h3>
            <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Daily Tracking</span>
          </div>
          <div className="legend">
            <span><i style={{ background: '#375DFB' }}></i>Attendance %</span>
            <span><i style={{ background: '#C6403C' }}></i>Absenteeism %</span>
          </div>
          <svg viewBox="0 0 480 220" width="100%" height="190">
            <line x1="0" y1="10" x2="480" y2="10" stroke="#EEF0F7" />
            <line x1="0" y1="55" x2="480" y2="55" stroke="#EEF0F7" />
            <line x1="0" y1="100" x2="480" y2="100" stroke="#EEF0F7" />
            <line x1="0" y1="145" x2="480" y2="145" stroke="#EEF0F7" />
            <line x1="0" y1="190" x2="480" y2="190" stroke="#EEF0F7" />
            <text x="0" y="14" fontSize="10" fill="#9AA1B4">100%</text>
            <text x="0" y="59" fontSize="10" fill="#9AA1B4">80%</text>
            <text x="0" y="104" fontSize="10" fill="#9AA1B4">60%</text>
            <text x="0" y="149" fontSize="10" fill="#9AA1B4">40%</text>
            <text x="0" y="194" fontSize="10" fill="#9AA1B4">20%</text>

            <path
              d="M32,55 L94,58 L156,60 L218,68 L280,60 L342,55 L404,58 L462,52"
              fill="none"
              stroke="#375DFB"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <g fill="#375DFB">
              <circle cx="32" cy="55" r="3.5" />
              <circle cx="94" cy="58" r="3.5" />
              <circle cx="156" cy="60" r="3.5" />
              <circle cx="218" cy="68" r="3.5" />
              <circle cx="280" cy="60" r="3.5" />
              <circle cx="342" cy="55" r="3.5" />
              <circle cx="404" cy="58" r="3.5" />
              <circle cx="462" cy="52" r="3.5" />
            </g>

            <path
              d="M32,168 L94,160 L156,165 L218,158 L280,163 L342,155 L404,162 L462,158"
              fill="none"
              stroke="#C6403C"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <g fill="#C6403C">
              <circle cx="32" cy="168" r="3.5" />
              <circle cx="94" cy="160" r="3.5" />
              <circle cx="156" cy="165" r="3.5" />
              <circle cx="218" cy="158" r="3.5" />
              <circle cx="280" cy="163" r="3.5" />
              <circle cx="342" cy="155" r="3.5" />
              <circle cx="404" cy="162" r="3.5" />
              <circle cx="462" cy="158" r="3.5" />
            </g>

            <text x="20" y="212" fontSize="10.5" fill="#9AA1B4">May 15</text>
            <text x="82" y="212" fontSize="10.5" fill="#9AA1B4">May 16</text>
            <text x="144" y="212" fontSize="10.5" fill="#9AA1B4">May 17</text>
            <text x="206" y="212" fontSize="10.5" fill="#9AA1B4">May 18</text>
            <text x="268" y="212" fontSize="10.5" fill="#9AA1B4">May 19</text>
            <text x="330" y="212" fontSize="10.5" fill="#9AA1B4">May 20</text>
            <text x="440" y="212" fontSize="10.5" fill="#9AA1B4">May 21</text>
          </svg>
        </div>

        {/* Card 2: Upcoming Important Dates */}
        <div className="card">
          <div className="card-head">
            <h3>Upcoming Important Dates</h3>
            <span className="link" onClick={() => setActiveTab('dates')}>
              View Calendar →
            </span>
          </div>

          {importantDates.slice(0, 3).map((item) => (
            <div key={item.id} className="list-item">
              <div
                className="li-icon"
                style={{
                  background:
                    item.category === 'Payroll'
                      ? 'var(--accent-soft)'
                      : item.category === 'Performance Reviews'
                      ? 'var(--success-soft)'
                      : 'var(--violet-soft)'
                }}
              >
                <Calendar
                  color={
                    item.category === 'Payroll'
                      ? 'var(--accent)'
                      : item.category === 'Performance Reviews'
                      ? 'var(--success)'
                      : 'var(--violet)'
                  }
                />
              </div>
              <div style={{ flex: 1 }}>
                <div className="li-title">{item.title}</div>
                <div className="li-sub">
                  {item.date} · <b style={{ color: 'var(--navy)' }}>{item.daysLeft} Days Left</b>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Card 3: Quick Access */}
        <div className="card">
          <div className="card-head">
            <h3>Quick Actions</h3>
          </div>
          <div className="qa-item" onClick={() => setActiveTab('employees')}>
            <div className="qa-ic" style={{ background: 'var(--violet-soft)' }}>
              <UserPlus color="var(--violet)" />
            </div>
            + Add Employee
          </div>
          <div className="qa-item" onClick={() => setActiveTab('approvals')}>
            <div className="qa-ic" style={{ background: 'var(--success-soft)' }}>
              <UserCheck color="var(--success)" />
            </div>
            ✓ Approve Leaves ({pendingLeaves.length})
          </div>
          <div className="qa-item" onClick={() => setActiveTab('reports')}>
            <div className="qa-ic" style={{ background: 'var(--accent-soft)' }}>
              <BarChart3 color="var(--accent)" />
            </div>
            ▤ View Reports
          </div>
          <div className="qa-item" onClick={() => setIsAddAnnouncementModalOpen(true)}>
            <div className="qa-ic" style={{ background: 'var(--warn-soft)' }}>
              <Megaphone color="var(--warn)" />
            </div>
            📢 Send Announcement
          </div>
        </div>
      </div>
    </div>
  );
};
