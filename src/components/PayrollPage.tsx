import React from 'react';
import { useApp } from '../context/AppContext';
import { DollarSign, Download, Lock, CheckCircle, Calendar, ShieldCheck } from 'lucide-react';

export const PayrollPage: React.FC = () => {
  const { role, employees, showToast } = useApp();

  if (role === 'employee') {
    const emp = employees.find(e => e.id === 'EMP-101') || employees[0];
    const { salary } = emp;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Salary Summary Card */}
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
            <div style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Monthly Net Salary (May 2026)
            </div>
            <div style={{ fontFamily: 'Manrope', fontSize: 32, fontWeight: 800, marginTop: 4 }}>
              ₹{salary.net.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: 12, color: '#C9D0E4', marginTop: 4 }}>
              Direct Deposit Scheduled: <b>31 May 2026</b> · HDFC Bank (**** 4892)
            </div>
          </div>

          <button
            className="btn-primary"
            style={{ background: 'linear-gradient(135deg, var(--gold), #F0C878)', color: 'var(--navy)' }}
            onClick={() => showToast('Downloading May 2026 Payslip PDF...')}
          >
            <Download size={15} /> Download Payslip PDF
          </button>
        </div>

        {/* Salary Breakdown Grid */}
        <div className="card">
          <div className="card-head">
            <h3>Salary Structure Breakdown</h3>
            <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}><Lock size={12} style={{ display: 'inline', marginRight: 4 }} /> Confidential</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: 'var(--canvas)', borderRadius: 12, padding: 16, border: '1px solid var(--line)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--success)', marginBottom: 12 }}>Earnings</div>
              <div className="dl-row">
                <span className="dl-name">Basic Salary</span>
                <span className="dl-val">₹{salary.basic.toLocaleString('en-IN')}</span>
              </div>
              <div className="dl-row">
                <span className="dl-name">House Rent Allowance (HRA)</span>
                <span className="dl-val">₹{salary.hra.toLocaleString('en-IN')}</span>
              </div>
              <div className="dl-row">
                <span className="dl-name">Special Allowance</span>
                <span className="dl-val">₹{salary.specialAllowance.toLocaleString('en-IN')}</span>
              </div>
              <div className="dl-row" style={{ borderTop: '1px solid var(--line)', marginTop: 8, paddingTop: 8, fontWeight: 700 }}>
                <span className="dl-name">Total Gross Earnings</span>
                <span className="dl-val">₹{(salary.basic + salary.hra + salary.specialAllowance).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ background: 'var(--canvas)', borderRadius: 12, padding: 16, border: '1px solid var(--line)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--danger)', marginBottom: 12 }}>Deductions</div>
              <div className="dl-row">
                <span className="dl-name">Provident Fund (PF)</span>
                <span className="dl-val">₹6,000</span>
              </div>
              <div className="dl-row">
                <span className="dl-name">Professional Tax</span>
                <span className="dl-val">₹200</span>
              </div>
              <div className="dl-row">
                <span className="dl-name">Income Tax (TDS)</span>
                <span className="dl-val">₹3,800</span>
              </div>
              <div className="dl-row" style={{ borderTop: '1px solid var(--line)', marginTop: 8, paddingTop: 8, fontWeight: 700 }}>
                <span className="dl-name">Total Deductions</span>
                <span className="dl-val">₹{salary.deductions.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // HR Manager View
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* KPI Row for HR Payroll */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <div className="kpi">
          <div className="kpi-ic" style={{ background: 'var(--accent-soft)' }}>
            <DollarSign color="var(--accent)" />
          </div>
          <div>
            <div className="label">Monthly Payroll Commitment</div>
            <div className="value">₹2.48 Cr</div>
            <div className="foot pos">For 248 Employees</div>
          </div>
        </div>

        <div className="kpi">
          <div className="kpi-ic" style={{ background: 'var(--success-soft)' }}>
            <CheckCircle color="var(--success)" />
          </div>
          <div>
            <div className="label">Payroll Cycle Status</div>
            <div className="value" style={{ fontSize: 18, color: 'var(--success)' }}>Ready for Processing</div>
            <div className="foot">Cutoff: 25 May 2026</div>
          </div>
        </div>

        <div className="kpi">
          <div className="kpi-ic" style={{ background: 'var(--warn-soft)' }}>
            <Calendar color="var(--warn)" />
          </div>
          <div>
            <div className="label">Next Disbursement</div>
            <div className="value">31 May</div>
            <div className="foot warn">10 Days Remaining</div>
          </div>
        </div>

        <div className="kpi">
          <div className="kpi-ic" style={{ background: 'var(--violet-soft)' }}>
            <ShieldCheck color="var(--violet)" />
          </div>
          <div>
            <div className="label">Tax Compliance Audit</div>
            <div className="value" style={{ fontSize: 18, color: 'var(--violet)' }}>100% Compliant</div>
            <div className="foot">PF & TDS Filed</div>
          </div>
        </div>
      </div>

      {/* Workforce Payroll Table */}
      <div className="card">
        <div className="card-head">
          <h3>Employee Payroll Master Directory</h3>
          <button className="btn-primary" onClick={() => showToast('Initiated May 2026 Payroll Execution Cycle.')}>
            Process Payroll Cycle
          </button>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Basic</th>
                <th>HRA</th>
                <th>Allowances</th>
                <th>Deductions</th>
                <th>Net Salary</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td style={{ fontWeight: 700 }}>{emp.name}</td>
                  <td>{emp.department}</td>
                  <td style={{ fontFamily: 'IBM Plex Mono' }}>₹{emp.salary.basic.toLocaleString('en-IN')}</td>
                  <td style={{ fontFamily: 'IBM Plex Mono' }}>₹{emp.salary.hra.toLocaleString('en-IN')}</td>
                  <td style={{ fontFamily: 'IBM Plex Mono' }}>₹{emp.salary.specialAllowance.toLocaleString('en-IN')}</td>
                  <td style={{ fontFamily: 'IBM Plex Mono' }}>₹{emp.salary.deductions.toLocaleString('en-IN')}</td>
                  <td style={{ fontFamily: 'IBM Plex Mono', fontWeight: 800, color: 'var(--accent)' }}>
                    ₹{emp.salary.net.toLocaleString('en-IN')}
                  </td>
                  <td>
                    <span className="badge badge-success">Scheduled (31 May)</span>
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
