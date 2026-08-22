import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart3, Download, Filter, TrendingUp, Users, Clock, AlertTriangle } from 'lucide-react';

export const ReportsAnalytics: React.FC = () => {
  const { showToast } = useApp();
  const [dateRange, setDateRange] = useState('This Month');
  const [selectedDept, setSelectedDept] = useState('All Departments');

  const depts = [
    { name: 'Backend', count: 48, pct: '19.3%', attendance: '91.8%', overtime: '42h', risk: 'High' },
    { name: 'Frontend', count: 52, pct: '21.0%', attendance: '94.2%', overtime: '28h', risk: 'Low' },
    { name: 'QA', count: 34, pct: '13.7%', attendance: '89.4%', overtime: '18h', risk: 'Medium' },
    { name: 'DevOps', count: 22, pct: '8.8%', attendance: '88.1%', overtime: '34h', risk: 'Medium' },
    { name: 'Product Design', count: 28, pct: '11.3%', attendance: '95.0%', overtime: '12h', risk: 'Low' },
    { name: 'Sales & Support', count: 64, pct: '25.8%', attendance: '96.2%', overtime: '14h', risk: 'Low' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Filter Bar */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Filter size={16} color="var(--ink-soft)" />
          <span style={{ fontSize: 13, fontWeight: 700 }}>Period:</span>
          {['This Week', 'This Month', 'Last 3 Months', 'YTD'].map(p => (
            <button
              key={p}
              onClick={() => setDateRange(p)}
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: '6px 12px',
                borderRadius: 8,
                border: '1px solid',
                borderColor: dateRange === p ? 'var(--accent)' : 'var(--line)',
                background: dateRange === p ? 'var(--accent-soft)' : 'var(--surface)',
                color: dateRange === p ? 'var(--accent)' : 'var(--ink-soft)'
              }}
            >
              {p}
            </button>
          ))}
        </div>

        <button className="btn-primary" onClick={() => showToast('Generating custom analytics PDF export...')}>
          <Download size={15} /> Export Analytics Report
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <div className="kpi">
          <div className="kpi-ic" style={{ background: 'var(--accent-soft)' }}>
            <Users color="var(--accent)" />
          </div>
          <div>
            <div className="label">Total Workforce</div>
            <div className="value">248</div>
            <div className="foot pos">Across 6 Departments</div>
          </div>
        </div>

        <div className="kpi">
          <div className="kpi-ic" style={{ background: 'var(--success-soft)' }}>
            <TrendingUp color="var(--success)" />
          </div>
          <div>
            <div className="label">Average Attendance</div>
            <div className="value">92.4%</div>
            <div className="foot pos">▲ 3.2% vs benchmark</div>
          </div>
        </div>

        <div className="kpi">
          <div className="kpi-ic" style={{ background: 'var(--warn-soft)' }}>
            <Clock color="var(--warn)" />
          </div>
          <div>
            <div className="label">Overtime Hours</div>
            <div className="value">148h</div>
            <div className="foot warn">DevOps + Backend peak</div>
          </div>
        </div>

        <div className="kpi">
          <div className="kpi-ic" style={{ background: 'var(--danger-soft)' }}>
            <AlertTriangle color="var(--danger)" />
          </div>
          <div>
            <div className="label">Absenteeism Rate</div>
            <div className="value">7.3%</div>
            <div className="foot neg">Target &lt; 5.0%</div>
          </div>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="card">
        <div className="card-head">
          <h3>Department Analytics & Capacity Summary</h3>
          <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Data refreshed today</span>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Employee Count</th>
                <th>Workforce Share</th>
                <th>Avg Attendance</th>
                <th>Overtime (Month)</th>
                <th>Workforce Risk</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {depts.map((d, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 700 }}>{d.name}</td>
                  <td>{d.count}</td>
                  <td>{d.pct}</td>
                  <td style={{ fontWeight: 700, color: parseFloat(d.attendance) > 92 ? 'var(--success)' : 'var(--warn)' }}>
                    {d.attendance}
                  </td>
                  <td style={{ fontFamily: 'IBM Plex Mono' }}>{d.overtime}</td>
                  <td>
                    <span
                      className={`badge ${
                        d.risk === 'High' ? 'badge-danger' : d.risk === 'Medium' ? 'badge-warning' : 'badge-success'
                      }`}
                    >
                      {d.risk} Risk
                    </span>
                  </td>
                  <td>
                    <span
                      style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700, cursor: 'pointer' }}
                      onClick={() => showToast(`Opening deep breakdown report for ${d.name}...`)}
                    >
                      View Report →
                    </span>
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
