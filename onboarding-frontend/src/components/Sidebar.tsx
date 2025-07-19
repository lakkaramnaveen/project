import React from 'react';
import { Link } from 'react-router-dom';

type SidebarProps = {
  isOpen: boolean;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
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
