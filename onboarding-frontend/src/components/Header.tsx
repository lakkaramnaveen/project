import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="header">
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
