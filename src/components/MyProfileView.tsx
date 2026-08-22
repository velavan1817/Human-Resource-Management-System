import React from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Phone, MapPin, Briefcase, Calendar, Award, Shield, User, Clock, CheckCircle } from 'lucide-react';

export const MyProfileView: React.FC = () => {
  const { employees } = useApp();
  const arjun = employees.find(e => e.id === 'EMP-101') || employees[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Profile Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--navy), var(--navy-2))',
          borderRadius: 'var(--radius)',
          padding: 24,
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: 20
        }}
      >
        <div
          className="avatar"
          style={{
            width: 72,
            height: 72,
            fontSize: 24,
            background: arjun.avatarGradient || 'linear-gradient(135deg, #1AA6A0, #375DFB)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
          }}
        >
          {arjun.initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 style={{ fontFamily: 'Manrope', fontSize: 24, fontWeight: 800, margin: 0 }}>
              {arjun.name}
            </h2>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: 'var(--gold)', fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 12 }}>
              EMPLOYEE ID: {arjun.id}
            </span>
          </div>
          <div style={{ fontSize: 14, color: '#C9D0E4', marginTop: 4 }}>
            {arjun.designation} · <b>{arjun.department} Department</b>
          </div>
          <div style={{ fontSize: 12, color: '#A0ABC0', marginTop: 4, display: 'flex', gap: 16 }}>
            <span><MapPin size={13} style={{ display: 'inline', marginRight: 4 }} /> {arjun.location}</span>
            <span><Calendar size={13} style={{ display: 'inline', marginRight: 4 }} /> Joined {arjun.joiningDate}</span>
          </div>
        </div>
      </div>

      {/* Grid of Profile Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Personal & Contact Details */}
        <div className="card">
          <div className="card-head">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={16} color="var(--accent)" /> Personal & Contact Details
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
            <div className="dl-row">
              <span className="dl-name">Work Email</span>
              <span className="dl-val">{arjun.email}</span>
            </div>
            <div className="dl-row">
              <span className="dl-name">Phone Number</span>
              <span className="dl-val">{arjun.phone}</span>
            </div>
            <div className="dl-row">
              <span className="dl-name">Office Location</span>
              <span className="dl-val">{arjun.location}</span>
            </div>
            <div className="dl-row">
              <span className="dl-name">Employment Type</span>
              <span className="dl-val">Full-Time Permanent</span>
            </div>
            <div className="dl-row">
              <span className="dl-name">Reporting Manager</span>
              <span className="dl-val">Vikram Singh (Lead Architect)</span>
            </div>
          </div>
        </div>

        {/* Workload & Technical Skills */}
        <div className="card">
          <div className="card-head">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Briefcase size={16} color="var(--violet)" /> Skills & Active Workload
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13 }}>
            <div>
              <div className="dl-name" style={{ marginBottom: 6 }}>Technical Core Competencies</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {arjun.skills.map((s, i) => (
                  <span
                    key={i}
                    style={{
                      background: 'var(--accent-soft)',
                      color: 'var(--accent)',
                      fontSize: 11.5,
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: 8
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="dl-row" style={{ marginTop: 6 }}>
              <span className="dl-name">Current Workload Score</span>
              <span className={`impact-tag ${arjun.workloadScore === 'High' ? 'HIGH' : 'LOW'}`}>
                {arjun.workloadScore} Workload
              </span>
            </div>

            <div className="dl-row">
              <span className="dl-name">Active Sprint Commitments</span>
              <span className="dl-val">Payment Gateway & Auth Migration</span>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Balances Summary */}
      <div className="card">
        <div className="card-head">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Award size={16} color="var(--success)" /> My Leave Balances (Year 2026)
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div style={{ background: 'var(--accent-soft)', borderRadius: 12, padding: 16, border: '1px solid #C9D9FF' }}>
            <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700 }}>Casual Leave (CL)</div>
            <div style={{ fontFamily: 'Manrope', fontSize: 24, fontWeight: 800, color: 'var(--ink)', marginTop: 4 }}>
              {arjun.casualLeaveBal.used} / {arjun.casualLeaveBal.total} Days
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 4 }}>
              8 Days Available for booking
            </div>
          </div>

          <div style={{ background: 'var(--warn-soft)', borderRadius: 12, padding: 16, border: '1px solid #F2DFB2' }}>
            <div style={{ fontSize: 12, color: 'var(--warn)', fontWeight: 700 }}>Sick Leave (SL)</div>
            <div style={{ fontFamily: 'Manrope', fontSize: 24, fontWeight: 800, color: 'var(--ink)', marginTop: 4 }}>
              {arjun.sickLeaveBal.used} / {arjun.sickLeaveBal.total} Days
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 4 }}>
              6 Days Available
            </div>
          </div>

          <div style={{ background: 'var(--teal-soft)', borderRadius: 12, padding: 16, border: '1px solid #C5EAE6' }}>
            <div style={{ fontSize: 12, color: 'var(--teal)', fontWeight: 700 }}>Earned Leave (EL)</div>
            <div style={{ fontFamily: 'Manrope', fontSize: 24, fontWeight: 800, color: 'var(--ink)', marginTop: 4 }}>
              {arjun.earnedLeaveBal.used} / {arjun.earnedLeaveBal.total} Days
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 4 }}>
              10 Days Carry Forward
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
