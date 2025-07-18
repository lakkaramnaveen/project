import React, { useEffect, useState } from 'react';

type ComponentConfig = {
  id?: number;
  name: string;
  page: number;
};

const AdminPanel: React.FC = () => {
  const [components, setComponents] = useState<ComponentConfig[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/config')
      .then((res) => res.json())
      .then((data) => {
        setComponents(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load configuration');
        setLoading(false);
      });
  }, []);

  const handlePageChange = (index: number, newPage: number) => {
    const updated = [...components];
    updated[index].page = newPage;
    setComponents(updated);
  };

  const saveChanges = async () => {
    try {
      const response = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ components }),
      });
      if (!response.ok) throw new Error('Failed to save config');
      await response.json();
      alert('Config saved!');
    } catch {
      alert('Failed to save config');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="page-wrapper">
    <div className="admin-panel">
      <h2>Admin Panel: Configure Onboarding Steps</h2>
      <ul>
        {components.map((comp, idx) => (
          <li key={comp.name} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <strong style={{ flex: '1' }}>{comp.name}</strong>
            <label htmlFor={`page-select-${idx}`} style={{ fontWeight: '600' }}>Page:</label>
            <select
              id={`page-select-${idx}`}
              value={comp.page}
              onChange={(e) => handlePageChange(idx, parseInt(e.target.value, 10))}
              style={{
                borderRadius: '4px',
                border: '1px solid #444',
                padding: '0.3rem 0.5rem',
                backgroundColor: '#242424',
                color: 'white',
                minWidth: '60px',
                cursor: 'pointer',
              }}
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </li>
        ))}
      </ul>
      <button onClick={saveChanges}>Save</button>
    </div>
    </div>
  );
};

export default AdminPanel;
