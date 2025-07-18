import React, { useEffect, useState } from 'react';

type ComponentConfig = {
  id?: number;
  name: string;
  page: number;
};

const AdminPanel: React.FC = () => {
  const [components, setComponents] = useState<ComponentConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Fetch component config on mount
  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/admin/config');
        if (!res.ok) throw new Error(`Failed to load config: ${res.statusText}`);
        const data: ComponentConfig[] = await res.json();
        setComponents(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load configuration');
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  // Update page value for a component by index
  const handlePageChange = (index: number, newPage: number) => {
    setComponents((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], page: newPage };
      return updated;
    });
  };

  // Save updated config to backend
  const saveChanges = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ components }),
      });
      if (!response.ok) throw new Error('Failed to save config');
      await response.json();
      alert('Configuration saved successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to save config');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading configuration...</p>;
  if (error) return <p role="alert" className="error-message">{error}</p>;

  return (
    <div className="page-wrapper">
      <div className="admin-panel">
        <h2>Admin Panel: Configure Onboarding Steps</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {components.map((comp, idx) => (
            <li
              key={comp.name}
              style={{
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <strong style={{ flex: '1' }}>{comp.name}</strong>

              <label htmlFor={`page-select-${idx}`} style={{ fontWeight: '600' }}>
                Page:
              </label>

              <select
                id={`page-select-${idx}`}
                value={comp.page}
                onChange={(e) => handlePageChange(idx, Number(e.target.value))}
                style={{
                  borderRadius: '4px',
                  border: '1px solid #444',
                  padding: '0.3rem 0.5rem',
                  backgroundColor: '#242424',
                  color: 'white',
                  minWidth: '60px',
                  cursor: 'pointer',
                }}
                aria-label={`Select page for component ${comp.name}`}
                disabled={saving}
              >
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </li>
          ))}
        </ul>

        <button onClick={saveChanges} disabled={saving} aria-busy={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
