// src/components/Sidebar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><Link to="/">🏠 Home</Link></li>
          <li><Link to="/onboarding">🧭 Onboarding</Link></li>
          <li><Link to="/admin">🛠 Admin</Link></li>
          <li><Link to="/users">👥 Users</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
