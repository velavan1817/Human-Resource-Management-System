import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus } from 'lucide-react';

export const ImportantDatesPage: React.FC = () => {
  const { importantDates, setIsAddDateModalOpen } = useApp();
  const [selectedCat, setSelectedCat] = useState('ALL');

  const filteredDates = selectedCat === 'ALL'
    ? importantDates
    : importantDates.filter(d => d.category.toUpperCase() === selectedCat.toUpperCase());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Action Bar */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16 }}>Organizational Calendar & Milestones</h3>
          <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
            Key corporate events, payroll cutoff dates, compliance deadlines & holidays.
          </div>
        </div>

        <button className="btn-primary" onClick={() => setIsAddDateModalOpen(true)}>
          <Plus size={16} /> Add Important Date
        </button>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['ALL', 'PAYROLL', 'COMPANY EVENTS', 'PERFORMANCE REVIEWS', 'BENEFITS', 'HOLIDAYS', 'COMPLIANCE'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            style={{
              fontSize: 12,
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: 8,
              border: '1px solid',
              borderColor: selectedCat === cat ? 'var(--accent)' : 'var(--line)',
              background: selectedCat === cat ? 'var(--accent-soft)' : 'var(--surface)',
              color: selectedCat === cat ? 'var(--accent)' : 'var(--ink-soft)'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {filteredDates.map(item => (
          <div key={item.id} className="card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div
              style={{
                width: 60,
                height: 64,
                borderRadius: 12,
                background: 'var(--navy)',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>
                {item.date.split(' ')[1]}
              </div>
              <div style={{ fontFamily: 'Manrope', fontSize: 20, fontWeight: 800, lineHeight: 1 }}>
                {item.date.split(' ')[0]}
              </div>
              <div style={{ fontSize: 9, color: '#C9D0E4', marginTop: 1 }}>
                {item.date.split(' ')[2]}
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: 'var(--accent-soft)',
                    color: 'var(--accent)',
                    textTransform: 'uppercase'
                  }}
                >
                  {item.category}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--danger)' }}>
                  {item.daysLeft} Days Left
                </span>
              </div>

              <h4 style={{ fontFamily: 'Manrope', fontSize: 16, fontWeight: 800, margin: '4px 0', color: 'var(--ink)' }}>
                {item.title}
              </h4>
              <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', margin: 0, lineHeight: 1.4 }}>
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
