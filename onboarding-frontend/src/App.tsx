// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OnboardingWizard from './components/OnboardingWizard';
import AdminPanel from './components/AdminPanel';
import DataTable from './components/UserDataTable';
import './styles/App.css';

/**
 * App Component - Root of the application
 * Defines route structure using React Router
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Main user-facing onboarding flow */}
        <Route path="/" element={<OnboardingWizard />} />

        {/* Admin panel to manage onboarding components */}
        <Route path="/admin" element={<AdminPanel />} />

        {/* Public user data display */}
        <Route path="/users" element={<DataTable />} />
      </Routes>
    </Router>
  );
}

export default App;
