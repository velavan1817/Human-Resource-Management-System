import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HRAttentionAlert } from '../types';
import {
  Zap,
  AlertTriangle,
  Clock,
  Users,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Filter,
  Layers
} from 'lucide-react';

export const HRAttentionCenter: React.FC = () => {
  const {
    attentionAlerts,
    riskHeatmap,
    leaveRequests,
    setInspectingLeaveId,
    resolveAlert,
    showToast
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filteredAlerts = categoryFilter === 'ALL'
    ? attentionAlerts
    : attentionAlerts.filter(a => a.category.toUpperCase().includes(categoryFilter.toUpperCase()));

  const handleInvestigateAlert = (alert: HRAttentionAlert) => {
    if (alert.category === 'Availability' || alert.title.includes('Backend')) {
      const pendingBackendReq = leaveRequests.find(r => r.department === 'Backend' && r.status === 'Pending');
      if (pendingBackendReq) {
        setInspectingLeaveId(pendingBackendReq.id);
      } else {
        showToast(`Investigating ${alert.title}. Opening backend capacity audit.`);
      }
    } else {
      showToast(`Initiated investigation for: ${alert.title}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--navy), var(--navy-2))',
          borderRadius: 'var(--radius)',
          padding: '24px 28px',
          color: '#ffffff',
          boxShadow: 'var(--shadow)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(214, 169, 74, 0.2)',
              color: 'var(--gold)',
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 800,
              marginBottom: 12,
              border: '1px solid rgba(214, 169, 74, 0.4)'
            }}
          >
            <Zap size={14} /> DAYFLOW PROACTIVE HR INTELLIGENCE LAYER
          </div>
          <h2 style={{ fontFamily: 'Manrope', fontSize: 24, fontWeight: 800, margin: '0 0 8px' }}>
            HR Attention Center
          </h2>
          <p style={{ color: '#C9D0E4', fontSize: 13.5, margin: 0, maxWidth: 800, lineHeight: 1.5 }}>
            Traditional HRMS tells HR what happened. DAYFLOW automatically correlates attendance, leave velocity, overtime spikes, and team availability to pinpoint issues requiring strategic HR intervention before operational impact occurs.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={15} color="var(--ink-soft)" />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-soft)' }}>Category Filter:</span>
          {['ALL', 'AVAILABILITY', 'ATTENDANCE PATTERN', 'LEAVE CONCENTRATION', 'OVERTIME'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: '6px 14px',
                borderRadius: 9,
                border: '1px solid',
                borderColor: categoryFilter === cat ? 'var(--accent)' : 'var(--line)',
                background: categoryFilter === cat ? 'var(--accent-soft)' : 'var(--surface)',
                color: categoryFilter === cat ? 'var(--accent)' : 'var(--ink-soft)',
                transition: 'all 0.15s ease'
              }}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-faint)', fontWeight: 600 }}>
          Showing {filteredAlerts.length} Active Intelligence Signals
        </div>
      </div>

      {/* Active Attention Alerts Section */}
      <div className="card">
        <div className="card-head">
          <h3>
            Active Attention Signals
            <small>({filteredAlerts.length} requiring review)</small>
          </h3>
          <span style={{ fontSize: 12, color: 'var(--ink-soft)', fontWeight: 600 }}>Sorted by Severity</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filteredAlerts.map(alert => {
            const isHigh = alert.priority === 'HIGH';
            const isMed = alert.priority === 'MEDIUM';

            return (
              <div
                key={alert.id}
                style={{
                  background: isHigh ? 'var(--danger-soft)' : isMed ? 'var(--warn-soft)' : 'var(--accent-soft)',
                  border: '1px solid',
                  borderColor: isHigh ? '#F3CFCC' : isMed ? '#F2DFB2' : '#D3DEFF',
                  borderRadius: 14,
                  padding: 18,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        background: isHigh ? 'var(--danger)' : isMed ? 'var(--warn)' : 'var(--accent)',
                        color: '#ffffff',
                        fontSize: 10,
                        fontWeight: 800,
                        padding: '3px 9px',
                        borderRadius: 6,
                        letterSpacing: 0.5
                      }}
                    >
                      {alert.priority} PRIORITY
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase' }}>
                      {alert.category}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>• {alert.createdAt}</span>
                  </div>

                  <button
                    onClick={() => resolveAlert(alert.id)}
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: 'var(--ink-soft)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <CheckCircle2 size={14} color="var(--success)" /> Mark Resolved
                  </button>
                </div>

                <div>
                  <h4 style={{ fontFamily: 'Manrope', fontSize: 16, fontWeight: 800, margin: '0 0 4px', color: 'var(--ink)' }}>
                    {alert.title}
                  </h4>
                  <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '0 0 10px', lineHeight: 1.4 }}>
                    {alert.summary}
                  </p>
                </div>

                {/* Evidence & Impact Boxes */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
                  <div
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid rgba(0,0,0,0.06)',
                      borderRadius: 10,
                      padding: 12,
                      fontSize: 12.5
                    }}
                  >
                    <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <AlertTriangle size={14} color={isHigh ? 'var(--danger)' : 'var(--warn)'} /> Evidence Detected:
                    </div>
                    <div style={{ color: 'var(--ink-soft)', lineHeight: 1.4 }}>
                      {alert.evidenceText}
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid rgba(0,0,0,0.06)',
                      borderRadius: 10,
                      padding: 12,
                      fontSize: 12.5
                    }}
                  >
                    <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <TrendingUp size={14} color="var(--accent)" /> Recommended HR Action:
                    </div>
                    <div style={{ color: 'var(--ink-soft)', lineHeight: 1.4 }}>
                      {alert.recommendedAction}
                    </div>
                  </div>
                </div>

                {/* Action Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 6 }}>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-faint)', fontWeight: 600 }}>
                    Affected Scope: <b>{alert.department} Department</b> ({alert.affectedCount} employees involved)
                  </div>
                  <button
                    className={`alert-btn ${isHigh ? 'hi' : isMed ? 'md' : 'lo'}`}
                    onClick={() => handleInvestigateAlert(alert)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    Investigate Pattern <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Workforce Risk Heatmap Matrix */}
      <div className="card">
        <div className="card-head">
          <div>
            <h3 style={{ fontSize: 16 }}>Workforce Risk Heatmap</h3>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
              Predictive availability matrix across departments for proactive staffing planning.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, fontSize: 11.5, fontWeight: 700 }}>
            <span style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }}></span> Low Risk
            </span>
            <span style={{ color: 'var(--warn)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--warn)' }}></span> Medium Risk
            </span>
            <span style={{ color: 'var(--danger)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)' }}></span> High Risk
            </span>
          </div>
        </div>

        <div className="heatmap-grid">
          <div className="heatmap-header" style={{ textAlign: 'left', paddingLeft: 12 }}>Department</div>
          <div className="heatmap-header">This Week (May 15-21)</div>
          <div className="heatmap-header">Next Week (May 22-28)</div>
          <div className="heatmap-header">2 Weeks Out (May 29+)</div>

          {riskHeatmap.map((item, idx) => (
            <React.Fragment key={idx}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 700,
                  fontSize: 13,
                  paddingLeft: 12,
                  color: 'var(--ink)',
                  borderBottom: '1px solid var(--line)'
                }}
              >
                {item.department}
              </div>

              <div className={`heatmap-cell ${item.thisWeek}`}>
                <span>{item.thisWeek.toUpperCase()} RISK</span>
              </div>

              <div className={`heatmap-cell ${item.nextWeek}`}>
                <span>{item.nextWeek.toUpperCase()} RISK</span>
                {item.nextWeek === 'High' && <span style={{ fontSize: 9.5, fontWeight: 600 }}>Leaves Overlap</span>}
              </div>

              <div className={`heatmap-cell ${item.twoWeeksOut}`}>
                <span>{item.twoWeeksOut.toUpperCase()} RISK</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="ai-disclaimer" style={{ marginTop: 18 }}>
          <ShieldCheck size={16} />
          <span><b>Responsible AI Guarantee:</b> Patterns reflect calculated scheduling conflicts and historical velocity. The system does NOT auto-judge employees or auto-reject time-off requests.</span>
        </div>
      </div>
    </div>
  );
};
