import React from 'react';

type HeaderProps = {
  toggleSidebar: () => void;
};

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="header">
      <button 
        className="sidebar-toggle"
        aria-label="Toggle sidebar"
        onClick={toggleSidebar}
      >
        &#9776;
      </button>
      <h1>Onboarding App</h1>
      <nav>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/users">Users</a></li>
          <li><a href="/admin">Admin</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
