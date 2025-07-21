// src/components/Sidebar.tsx
import type { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

type SidebarProps = {
  isOpen: boolean;
};

/**
 * Sidebar component with collapsible behavior.
 * Shows navigation links with icons.
 */
const Sidebar: FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();

  // Define menu items once — easy to maintain and extend
  const menuItems = [
    { to: '/', icon: '🏠', label: 'Home' },
    { to: '/onboarding', icon: '🧭', label: 'Onboarding' },
    { to: '/admin', icon: '🛠', label: 'Admin' },
    { to: '/users', icon: '👥', label: 'Users' },
  ];

  return (
    <aside
      className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}
      aria-label="Primary Navigation"
    >
      <nav>
        <ul>
          {menuItems.map(({ to, icon, label }) => {
            const isActive = location.pathname === to;

            return (
              <li key={to}>
                <Link
                  to={to}
                  className={isActive ? 'active' : ''}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="icon" aria-hidden="true">{icon}</span>
                  {/* Only show label if sidebar is open */}
                  {isOpen && <span className="label">{label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
