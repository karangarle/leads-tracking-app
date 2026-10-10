import React, { useState } from 'react';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; phone: string; status: string }) => Promise<void>;
  initialData?: { name: string; email: string; phone: string; status: string };
  title: string;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [status, setStatus] = useState(initialData?.status || 'new');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEmail(initialData.email);
      setPhone(initialData.phone);
      setStatus(initialData.status);
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setStatus('new');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) return setError('Name is required');
    if (!email.trim() || !email.includes('@')) return setError('Valid email is required');
    if (!phone.trim()) return setError('Phone is required');

    setLoading(true);
    try {
      await onSubmit({ name, email, phone, status });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '1.75rem', position: 'relative' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.25rem' }}>{title}</h2>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            fontSize: '0.875rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Doe"
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: '#fff'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. jane@company.com"
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: '#fff'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Phone Number *
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +1 (555) 000-1234"
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: '#fff'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: '#fff'
              }}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '6px',
                backgroundColor: 'transparent',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                color: '#fff',
                fontWeight: 500,
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Saving...' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
