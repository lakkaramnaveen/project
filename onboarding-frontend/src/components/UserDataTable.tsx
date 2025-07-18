import React, { useEffect, useState } from 'react';

type User = {
  id: number;
  email: string;
  password?: string;
};

const UserDataTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch users');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="user-data-table" style={{ maxWidth: 800, margin: '2rem auto', color: '#fff' }}>
      <h2>User Data Table</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#1a1a1a' }}>
          <tr>
            <th style={{ border: '1px solid #444', padding: '0.5rem' }}>ID</th>
            <th style={{ border: '1px solid #444', padding: '0.5rem' }}>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={{ borderBottom: '1px solid #444' }}>
              <td style={{ border: '1px solid #444', padding: '0.5rem' }}>{u.id}</td>
              <td style={{ border: '1px solid #444', padding: '0.5rem' }}>{u.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserDataTable;
