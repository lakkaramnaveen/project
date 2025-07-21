import type { FC } from 'react';

type HeaderProps = {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
};

/**
 * Header component with a toggle button to open/close sidebar.
 */
const Header: FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <header className="header">
      <button
        className="sidebar-toggle"
        aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        onClick={toggleSidebar}
        aria-expanded={isSidebarOpen}
      >
        {isSidebarOpen ? '✕' : '☰'}
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
