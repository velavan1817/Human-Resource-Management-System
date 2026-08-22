import React from 'react';
import { useApp } from '../context/AppContext';
import { LeaveRequest } from '../types';
import {
  AlertTriangle,
  X,
  Check,
  RotateCcw,
  Users,
  Briefcase,
  Layers,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface Props {
  leaveRequest: LeaveRequest;
  onClose: () => void;
}

export const LeaveImpactAnalyzer: React.FC<Props> = ({ leaveRequest, onClose }) => {
  const { approveLeaveRequest, rejectLeaveRequest, showToast } = useApp();
  const { impact } = leaveRequest;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-close" onClick={onClose}>
          <X size={18} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div
            style={{
              background: 'var(--violet-soft)',
              color: 'var(--violet)',
              padding: '8px 12px',
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Sparkles size={15} /> DAYFLOW Leave Impact Intelligence
          </div>
          <span style={{ fontSize: 12, color: 'var(--ink-faint)', fontWeight: 600 }}>
            Request ID: {leaveRequest.id}
          </span>
        </div>

        <h2 style={{ fontFamily: 'Manrope', fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>
          Organizational Impact Analysis
        </h2>
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '0 0 20px' }}>
          Evaluating capacity, skill gaps, and active project risk prior to leave authorization.
        </p>

        {/* Employee & Request Header Card */}
        <div
          style={{
            background: 'var(--canvas)',
            borderRadius: 14,
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
            border: '1px solid var(--line)'
          }}
        >
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)' }}>
              {leaveRequest.employeeName}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
              {leaveRequest.role} · <b>{leaveRequest.department} Department</b>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>
              {leaveRequest.leaveType} ({leaveRequest.daysCount} Days)
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
              {leaveRequest.startDate} — {leaveRequest.endDate}
            </div>
          </div>
        </div>

        {/* Highlight Alert Box */}
        <div
          className="li-box"
          style={{
            background: impact.workloadImpact === 'HIGH' ? 'var(--danger-soft)' : 'var(--warn-soft)',
            borderColor: impact.workloadImpact === 'HIGH' ? '#F3CFCC' : '#F2DFB2'
          }}
        >
          <AlertTriangle color={impact.workloadImpact === 'HIGH' ? '#C6403C' : '#B5790A'} />
          <div>
            <div className="t">{impact.explanation}</div>
            <div className="s">
              Reason specified by employee: "<i>{leaveRequest.reason}</i>"
            </div>
          </div>
        </div>

        {/* Impact Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 22 }}>
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 12,
              padding: 14,
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontWeight: 600 }}>TEAM AVAILABILITY</div>
            <div
              style={{
                fontFamily: 'Manrope',
                fontSize: 24,
                fontWeight: 800,
                color: impact.teamAvailabilityPct < 70 ? 'var(--danger)' : 'var(--success)',
                marginTop: 4
              }}
            >
              {impact.teamAvailabilityPct}%
            </div>
            <div style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 2 }}>
              Down from {impact.previousAvailabilityPct}%
            </div>
          </div>

          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 12,
              padding: 14,
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontWeight: 600 }}>CRITICAL SKILLS</div>
            <div style={{ fontFamily: 'Manrope', fontSize: 24, fontWeight: 800, color: 'var(--warn)', marginTop: 4 }}>
              {impact.criticalSkillsAffected}
            </div>
            <div style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 2 }}>
              Key competencies affected
            </div>
          </div>

          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 12,
              padding: 14,
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontWeight: 600 }}>ACTIVE PROJECTS</div>
            <div style={{ fontFamily: 'Manrope', fontSize: 24, fontWeight: 800, color: 'var(--accent)', marginTop: 4 }}>
              {impact.activeProjectsCount}
            </div>
            <div style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 2 }}>
              Sprints affected
            </div>
          </div>

          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 12,
              padding: 14,
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontWeight: 600 }}>WORKLOAD IMPACT</div>
            <div style={{ marginTop: 8 }}>
              <span className={`impact-tag ${impact.workloadImpact}`}>
                {impact.workloadImpact}
              </span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 8 }}>
              {impact.teamMembersOnLeave} on leave already
            </div>
          </div>
        </div>

        {/* Affected Details Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          {/* Affected Projects */}
          <div style={{ background: 'var(--canvas)', borderRadius: 12, padding: 14, border: '1px solid var(--line)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Briefcase size={14} color="var(--accent)" /> Active Projects Impacted
            </div>
            {impact.affectedProjects.map((p, i) => (
              <div
                key={i}
                style={{
                  fontSize: 12,
                  padding: '7px 10px',
                  background: 'var(--surface)',
                  borderRadius: 8,
                  marginBottom: 6,
                  border: '1px solid var(--line)',
                  fontWeight: 500
                }}
              >
                • {p}
              </div>
            ))}
          </div>

          {/* Affected Team Members */}
          <div style={{ background: 'var(--canvas)', borderRadius: 12, padding: 14, border: '1px solid var(--line)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Users size={14} color="var(--violet)" /> Team Members Affected
            </div>
            {impact.affectedTeamMembers.length > 0 ? (
              impact.affectedTeamMembers.map((tm, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 12,
                    padding: '7px 10px',
                    background: 'var(--surface)',
                    borderRadius: 8,
                    marginBottom: 6,
                    border: '1px solid var(--line)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{tm.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--ink-faint)' }}>{tm.role}</div>
                  </div>
                  <span className={`impact-tag ${tm.currentWorkload === 'Critical' ? 'HIGH' : 'MEDIUM'}`}>
                    {tm.currentWorkload} Workload
                  </span>
                </div>
              ))
            ) : (
              <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>No immediate bottleneck members.</div>
            )}
          </div>
        </div>

        {/* AI Suggested Actions */}
        <div style={{ background: 'var(--accent-soft)', borderRadius: 14, padding: 16, marginBottom: 20, border: '1px solid #C9D9FF' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Layers size={16} /> Recommended HR Mitigations
          </div>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12.5, color: 'var(--ink)', lineHeight: 1.6 }}>
            {impact.suggestedActions.map((action, i) => (
              <li key={i} style={{ marginBottom: 4 }}>{action}</li>
            ))}
          </ul>
        </div>

        {/* Responsible AI Disclaimer */}
        <div className="ai-disclaimer">
          <ShieldCheck size={16} />
          <span><b>Decision-Support Guardrail:</b> DAYFLOW provides predictive workforce analytics. Final approval or adjustment remains with HR Manager.</span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
          <button
            className="btn-secondary"
            onClick={() => {
              showToast('Requested changes/dates update sent to employee.');
              onClose();
            }}
          >
            <RotateCcw size={15} /> Request Schedule Changes
          </button>
          <button
            className="btn-primary"
            style={{ background: 'var(--danger)', boxShadow: '0 4px 14px rgba(198,64,60,0.3)' }}
            onClick={() => rejectLeaveRequest(leaveRequest.id)}
          >
            <X size={15} /> Reject Request
          </button>
          <button
            className="btn-primary"
            style={{ background: 'var(--success)', boxShadow: '0 4px 14px rgba(18,135,90,0.3)' }}
            onClick={() => approveLeaveRequest(leaveRequest.id)}
          >
            <Check size={15} /> Approve Leave
          </button>
        </div>
      </div>
    </div>
  );
};
