// src/pages/Home.tsx
import React from 'react';

/**
 * Home page component - serves as the landing page of the Onboarding App.
 * Provides a brief welcome message and introduction.
 */
const Home: React.FC = () => {
  return (
    <main role="main" className="page-wrapper">
      <h2 tabIndex={-1}>Welcome to the Onboarding App</h2>
      <p>
        This is your starting point for onboarding configuration and management.
      </p>
    </main>
  );
};

export default Home;
