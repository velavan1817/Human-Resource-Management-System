import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LeaveType } from '../types';
import { X, Calendar, Sparkles } from 'lucide-react';

export const ApplyLeaveModal: React.FC = () => {
  const { isApplyLeaveModalOpen, setIsApplyLeaveModalOpen, submitNewLeaveRequest, employees } = useApp();

  const currentEmp = employees.find(e => e.id === 'EMP-101') || employees[0];

  const [leaveType, setLeaveType] = useState<LeaveType>('Casual Leave');
  const [startDate, setStartDate] = useState('26 May 2026');
  const [endDate, setEndDate] = useState('27 May 2026');
  const [daysCount, setDaysCount] = useState(2);
  const [reason, setReason] = useState('Personal family commitment');

  if (!isApplyLeaveModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;

    submitNewLeaveRequest({
      employeeId: currentEmp.id,
      employeeName: currentEmp.name,
      role: currentEmp.designation,
      department: currentEmp.department,
      leaveType,
      startDate,
      endDate,
      daysCount,
      reason
    });
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsApplyLeaveModalOpen(false)}>
      <div className="modal-card" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-close" onClick={() => setIsApplyLeaveModalOpen(false)}>
          <X size={18} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 800, background: 'var(--accent-soft)', color: 'var(--accent)', padding: '4px 10px', borderRadius: 8 }}>
            <Sparkles size={13} style={{ display: 'inline', marginRight: 4 }} /> DAYFLOW LEAVE IMPACT SUPPORT
          </span>
        </div>

        <h3 style={{ fontFamily: 'Manrope', fontSize: 18, fontWeight: 800, margin: '0 0 16px' }}>
          Apply for Time-Off / Leave
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Leave Type</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as LeaveType)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 8,
                border: '1px solid var(--line)',
                fontSize: 13,
                background: '#fff'
              }}
            >
              <option value="Casual Leave">Casual Leave (Balance: 8 days)</option>
              <option value="Sick Leave">Sick Leave (Balance: 6 days)</option>
              <option value="Earned Leave">Earned Leave (Balance: 10 days)</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0.8fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Start Date</label>
              <input
                type="text"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--line)',
                  fontSize: 13
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>End Date</label>
              <input
                type="text"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--line)',
                  fontSize: 13
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Days</label>
              <input
                type="number"
                required
                value={daysCount}
                onChange={(e) => setDaysCount(parseInt(e.target.value) || 1)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--line)',
                  fontSize: 13
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Reason for Leave</label>
            <textarea
              required
              rows={3}
              placeholder="State the reason for leave..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 8,
                border: '1px solid var(--line)',
                fontSize: 13,
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ background: 'var(--canvas)', borderRadius: 10, padding: 12, fontSize: 12, color: 'var(--ink-soft)' }}>
            ⚡ <b>Proactive Impact Notice:</b> DAYFLOW automatically analyzes team availability upon submission. HR will evaluate availability before final approval.
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
            <button className="btn-secondary" type="button" onClick={() => setIsApplyLeaveModalOpen(false)}>
              Cancel
            </button>
            <button className="btn-primary" type="submit">
              Submit Leave Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
