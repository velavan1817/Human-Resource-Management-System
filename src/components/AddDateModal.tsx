import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar } from 'lucide-react';

export const AddDateModal: React.FC = () => {
  const { isAddDateModalOpen, setIsAddDateModalOpen, addImportantDate } = useApp();

  const [title, setTitle] = useState('');
  const [dateStr, setDateStr] = useState('28 May 2026');
  const [daysLeft, setDaysLeft] = useState(6);
  const [category, setCategory] = useState<'Company Events' | 'Payroll' | 'Performance Reviews' | 'Benefits' | 'Holidays' | 'Compliance' | 'Meetings'>('Company Events');
  const [description, setDescription] = useState('');

  if (!isAddDateModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    addImportantDate({
      title,
      date: dateStr,
      daysLeft,
      category,
      description,
      priority: 'Normal'
    });
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsAddDateModalOpen(false)}>
      <div className="modal-card" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-close" onClick={() => setIsAddDateModalOpen(false)}>
          <X size={18} />
        </div>

        <h3 style={{ fontFamily: 'Manrope', fontSize: 18, fontWeight: 800, margin: '0 0 16px' }}>
          Add Important HR Date / Milestone
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Event Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Q2 Performance Review Kickoff"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 8,
                border: '1px solid var(--line)',
                fontSize: 13
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Date</label>
              <input
                type="text"
                required
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
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
              <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Days Remaining</label>
              <input
                type="number"
                required
                value={daysLeft}
                onChange={(e) => setDaysLeft(parseInt(e.target.value) || 0)}
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
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 8,
                border: '1px solid var(--line)',
                fontSize: 13,
                background: '#fff'
              }}
            >
              <option value="Company Events">Company Events</option>
              <option value="Payroll">Payroll</option>
              <option value="Performance Reviews">Performance Reviews</option>
              <option value="Benefits">Benefits</option>
              <option value="Holidays">Holidays</option>
              <option value="Compliance">Compliance</option>
              <option value="Meetings">Meetings</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Description</label>
            <textarea
              required
              rows={3}
              placeholder="Provide details about this milestone..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
            <button className="btn-secondary" type="button" onClick={() => setIsAddDateModalOpen(false)}>
              Cancel
            </button>
            <button className="btn-primary" type="submit">
              Add Milestone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
