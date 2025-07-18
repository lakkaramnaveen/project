import React, { useEffect, useState } from 'react';

type User = {
  id: number;
  email: string;
};

const UserDataTable: React.FC = () => {
  // State for user list, loading status, and error messages
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch users from API on component mount
    const fetchUsers = async () => {
      try {
        setError(null);
        setLoading(true);

        const response = await fetch('/api/users');

        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.statusText}`);
        }

        const data: User[] = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p className="user-status" aria-live="polite">Loading users...</p>;
  }

  if (error) {
    return (
      <p className="user-status error" role="alert" aria-live="assertive">
        {error}
      </p>
    );
  }

  if (users.length === 0) {
    return <p className="user-status">No users found.</p>;
  }

  return (
    <section className="user-table-container" aria-label="Registered users table">
      <h2 className="user-heading">Registered Users</h2>
      <table className="user-table" aria-describedby="userTableDesc" role="table">
        <caption id="userTableDesc" className="sr-only">
          List of registered users including their IDs and email addresses
        </caption>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ id, email }) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default UserDataTable;
