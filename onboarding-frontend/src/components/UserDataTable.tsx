import React, { useEffect, useState, useCallback } from 'react';

interface User {
  id: number;
  email: string;
}

const UserDataTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
      }
      const data: User[] = await response.json();

      // Sort users by ascending id before setting state
      data.sort((a, b) => a.id - b.id);
      setUsers(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) {
    return (
      <p className="user-status" aria-live="polite" role="status">
        Loading users...
      </p>
    );
  }

  if (error) {
    return (
      <p className="user-status error" role="alert" aria-live="assertive">
        {error}
      </p>
    );
  }

  if (users.length === 0) {
    return (
      <p className="user-status" aria-live="polite" role="status">
        No users found.
      </p>
    );
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
