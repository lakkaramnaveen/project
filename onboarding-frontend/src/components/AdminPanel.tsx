import React, { useEffect, useState } from 'react';

type ComponentConfig = {
  id?: number;
  name: string;
  page: number;
};

/**
 * AdminPanel component allows configuring onboarding steps,
 * fetching and updating component configuration from backend.
 */
const AdminPanel: React.FC = () => {
  const [components, setComponents] = useState<ComponentConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Fetch component config when component mounts
  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/admin/config');
        if (!res.ok) {
          throw new Error(`Failed to load config: ${res.status} ${res.statusText}`);
        }
        const data: ComponentConfig[] = await res.json();
        setComponents(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  /**
   * Update the page number of a component by its index.
   * @param index Index of the component in the list
   * @param newPage New page number
   */
  const handlePageChange = (index: number, newPage: number) => {
    setComponents((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], page: newPage };
      return updated;
    });
  };

  /**
   * Save updated components configuration to backend.
   */
  const saveChanges = async () => {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ components }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save config: ${response.status} ${response.statusText}`);
      }

      await response.json();
      alert('Configuration saved successfully!');
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('Unknown error occurred while saving');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading configuration...</p>;

  if (error) return (
    <p role="alert" className="error-message" style={{ color: 'red' }}>
      {error}
    </p>
  );

  return (
    <main className="page-wrapper admin-panel" role="main">
      <h2 tabIndex={-1}>Admin Panel: Configure Onboarding Steps</h2>

      <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem' }}>
        {components.map(({ name, page }, idx) => (
          <li
            key={name}
            style={{
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <strong style={{ flex: 1 }}>{name}</strong>

            <label htmlFor={`page-select-${idx}`} style={{ fontWeight: 600 }}>
              Page:
            </label>

            <select
              id={`page-select-${idx}`}
              value={page}
              onChange={(e) => handlePageChange(idx, Number(e.target.value))}
              style={{
                borderRadius: 4,
                border: '1px solid #444',
                padding: '0.3rem 0.5rem',
                backgroundColor: '#242424',
                color: 'white',
                minWidth: 60,
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
              aria-label={`Select page for component ${name}`}
              disabled={saving}
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </li>
        ))}
      </ul>

      <button
        onClick={saveChanges}
        disabled={saving}
        aria-busy={saving}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          borderRadius: 8,
          border: 'none',
          backgroundColor: saving ? '#6c757d' : '#007bff',
          color: 'white',
          cursor: saving ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s ease-in-out',
        }}
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
    </main>
  );
};

export default AdminPanel;
