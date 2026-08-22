import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Filter, Mail, MapPin, X } from 'lucide-react';

export const EmployeeDirectory: React.FC = () => {
  const { employees, inspectingEmployeeId, setInspectingEmployeeId } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const filteredEmployees = employees.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || e.department.toUpperCase() === deptFilter.toUpperCase();
    return matchesSearch && matchesDept;
  });

  const selectedEmp = employees.find(e => e.id === inspectingEmployeeId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Filter Bar */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div className="search" style={{ maxWidth: 360 }}>
          <Search />
          <input
            type="text"
            placeholder="Search by name, role, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={15} color="var(--ink-soft)" />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-soft)' }}>Department:</span>
          {['ALL', 'BACKEND', 'PRODUCT DESIGN', 'QA', 'DEVOPS', 'HUMAN RESOURCES'].map((dept) => (
            <button
              key={dept}
              onClick={() => setDeptFilter(dept)}
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: '6px 12px',
                borderRadius: 8,
                border: '1px solid',
                borderColor: deptFilter === dept ? 'var(--accent)' : 'var(--line)',
                background: deptFilter === dept ? 'var(--accent-soft)' : 'var(--surface)',
                color: deptFilter === dept ? 'var(--accent)' : 'var(--ink-soft)'
              }}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            className="card"
            style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
            onClick={() => setInspectingEmployeeId(emp.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <div
                className="avatar"
                style={{
                  width: 44,
                  height: 44,
                  fontSize: 14,
                  background: emp.avatarGradient || 'linear-gradient(135deg, #375DFB, #6D5EF0)'
                }}
              >
                {emp.initials}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)' }}>{emp.name}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 1 }}>{emp.designation}</div>
                <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, marginTop: 2 }}>
                  {emp.department}
                </div>
              </div>
              <span
                className={`badge ${
                  emp.status === 'Present'
                    ? 'badge-success'
                    : emp.status === 'On Leave'
                    ? 'badge-warning'
                    : 'badge-danger'
                }`}
              >
                {emp.status}
              </span>
            </div>

            <div style={{ fontSize: 12, color: 'var(--ink-soft)', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Mail size={13} color="var(--ink-faint)" /> {emp.email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={13} color="var(--ink-faint)" /> {emp.location}
              </div>
            </div>

            <div
              style={{
                marginTop: 14,
                paddingTop: 10,
                borderTop: '1px solid var(--line)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 11.5
              }}
            >
              <span>Attendance Rate: <b>{emp.attendancePct}%</b></span>
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>View Profile →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Employee Profile Modal */}
      {selectedEmp && (
        <div className="modal-backdrop" onClick={() => setInspectingEmployeeId(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-close" onClick={() => setInspectingEmployeeId(null)}>
              <X size={18} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div
                className="avatar"
                style={{
                  width: 56,
                  height: 56,
                  fontSize: 18,
                  background: selectedEmp.avatarGradient || 'linear-gradient(135deg, #375DFB, #6D5EF0)'
                }}
              >
                {selectedEmp.initials}
              </div>
              <div>
                <h2 style={{ fontFamily: 'Manrope', fontSize: 20, fontWeight: 800, margin: 0 }}>
                  {selectedEmp.name}
                </h2>
                <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 2 }}>
                  {selectedEmp.designation} · <b>{selectedEmp.department}</b>
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-faint)', marginTop: 2 }}>
                  Employee ID: {selectedEmp.id} · Joined {selectedEmp.joiningDate}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
              <div style={{ background: 'var(--canvas)', borderRadius: 12, padding: 14, border: '1px solid var(--line)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>Personal & Contact</div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                  Email: <b>{selectedEmp.email}</b><br />
                  Phone: <b>{selectedEmp.phone}</b><br />
                  Location: <b>{selectedEmp.location}</b>
                </div>
              </div>

              <div style={{ background: 'var(--canvas)', borderRadius: 12, padding: 14, border: '1px solid var(--line)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>Workload & Skills</div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                  Workload Status: <b style={{ color: selectedEmp.workloadScore === 'High' ? 'var(--danger)' : 'var(--success)' }}>{selectedEmp.workloadScore}</b><br />
                  Skills: {selectedEmp.skills.join(', ')}
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Leave Balances</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, textAlign: 'center' }}>
                <div style={{ background: 'var(--accent-soft)', padding: 10, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700 }}>Casual Leave</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)', marginTop: 2 }}>
                    {selectedEmp.casualLeaveBal.used} / {selectedEmp.casualLeaveBal.total}
                  </div>
                </div>
                <div style={{ background: 'var(--warn-soft)', padding: 10, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: 'var(--warn)', fontWeight: 700 }}>Sick Leave</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)', marginTop: 2 }}>
                    {selectedEmp.sickLeaveBal.used} / {selectedEmp.sickLeaveBal.total}
                  </div>
                </div>
                <div style={{ background: 'var(--teal-soft)', padding: 10, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 700 }}>Earned Leave</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)', marginTop: 2 }}>
                    {selectedEmp.earnedLeaveBal.used} / {selectedEmp.earnedLeaveBal.total}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setInspectingEmployeeId(null)}>
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
