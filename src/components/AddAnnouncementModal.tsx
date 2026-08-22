import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Megaphone } from 'lucide-react';

export const AddAnnouncementModal: React.FC = () => {
  const { isAddAnnouncementModalOpen, setIsAddAnnouncementModalOpen, postAnnouncement } = useApp();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Policy' | 'Holiday' | 'Event' | 'General'>('General');
  const [priority, setPriority] = useState<'Important' | 'Normal'>('Normal');

  if (!isAddAnnouncementModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    postAnnouncement({
      title,
      content,
      category,
      priority
    });
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsAddAnnouncementModalOpen(false)}>
      <div className="modal-card" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-close" onClick={() => setIsAddAnnouncementModalOpen(false)}>
          <X size={18} />
        </div>

        <h3 style={{ fontFamily: 'Manrope', fontSize: 18, fontWeight: 800, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Megaphone color="var(--accent)" size={20} /> Publish Broadcast Announcement
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Announcement Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Q2 All-Hands Meeting & Strategic Roadmap"
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
                <option value="General">General</option>
                <option value="Policy">Policy Update</option>
                <option value="Holiday">Holiday Notice</option>
                <option value="Event">Event</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--line)',
                  fontSize: 13,
                  background: '#fff'
                }}
              >
                <option value="Normal">Normal Priority</option>
                <option value="Important">High / Important</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Message Content</label>
            <textarea
              required
              rows={4}
              placeholder="Write the full announcement text to broadcast..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
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
            <button className="btn-secondary" type="button" onClick={() => setIsAddAnnouncementModalOpen(false)}>
              Cancel
            </button>
            <button className="btn-primary" type="submit">
              Publish Announcement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
