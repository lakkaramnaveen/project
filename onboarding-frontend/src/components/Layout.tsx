// src/components/Layout.tsx
import React, { useState, useCallback } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

type LayoutProps = {
  children: React.ReactNode;
};

/**
 * Layout component that wraps the application.
 * Manages sidebar open/collapse state and renders Header, Sidebar, Content, and Footer.
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Sidebar open state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Memoized toggle function for performance optimization
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  return (
    <div className="layout" data-sidebar-open={isSidebarOpen}>
      {/* Pass toggle handler to Header to trigger sidebar toggle */}
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className="main-content">
        <Sidebar isOpen={isSidebarOpen} />
        <main className="content" tabIndex={-1}>
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
