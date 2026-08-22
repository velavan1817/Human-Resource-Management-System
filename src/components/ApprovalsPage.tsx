import React from 'react';
import { useApp } from '../context/AppContext';
import { Check, X, Eye, FileText, Clock, FileCheck } from 'lucide-react';

export const ApprovalsPage: React.FC = () => {
  const { pendingApprovals, leaveRequests, setInspectingLeaveId, showToast } = useApp();

  const handleApprove = (id: string, name: string) => {
    showToast(`Approved request for ${name}`);
  };

  const handleReject = (id: string, name: string) => {
    showToast(`Rejected request for ${name}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="card">
        <div className="card-head">
          <h3>
            Pending Approvals Queue
            <small>({pendingApprovals.filter(p => p.status === 'Pending').length} pending)</small>
          </h3>
          <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
            Requires HR Authorization
          </span>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Employee</th>
                <th>Department</th>
                <th>Details</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingApprovals.map((pa) => {
                const isPending = pa.status === 'Pending';

                return (
                  <tr key={pa.id}>
                    <td>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 6,
                          background:
                            pa.type === 'Leave Request'
                              ? 'var(--accent-soft)'
                              : pa.type === 'Overtime Claim'
                              ? 'var(--warn-soft)'
                              : 'var(--teal-soft)',
                          color:
                            pa.type === 'Leave Request'
                              ? 'var(--accent)'
                              : pa.type === 'Overtime Claim'
                              ? 'var(--warn)'
                              : 'var(--teal)'
                        }}
                      >
                        {pa.type}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{pa.employeeName}</td>
                    <td>{pa.department}</td>
                    <td>{pa.details}</td>
                    <td style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{pa.date}</td>
                    <td>
                      <span
                        className={`badge ${
                          pa.status === 'Approved'
                            ? 'badge-success'
                            : pa.status === 'Rejected'
                            ? 'badge-danger'
                            : 'badge-warning'
                        }`}
                      >
                        {pa.status}
                      </span>
                    </td>
                    <td>
                      {isPending ? (
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          {pa.leaveRequestId && (
                            <button
                              className="btn-secondary"
                              style={{ padding: '4px 10px', fontSize: 11 }}
                              onClick={() => setInspectingLeaveId(pa.leaveRequestId!)}
                            >
                              <Eye size={13} /> View Impact
                            </button>
                          )}

                          <button
                            className="btn-primary"
                            style={{
                              background: 'var(--success)',
                              padding: '4px 10px',
                              fontSize: 11,
                              boxShadow: 'none'
                            }}
                            onClick={() => handleApprove(pa.id, pa.employeeName)}
                          >
                            <Check size={13} /> Approve
                          </button>

                          <button
                            className="btn-secondary"
                            style={{
                              color: 'var(--danger)',
                              borderColor: '#F3CFCC',
                              padding: '4px 10px',
                              fontSize: 11
                            }}
                            onClick={() => handleReject(pa.id, pa.employeeName)}
                          >
                            <X size={13} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--ink-faint)', fontWeight: 600 }}>
                          Action Completed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
