// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import OnboardingWizard from './components/OnboardingWizard';
import AdminPanel from './components/AdminPanel';
import DataTable from './components/UserDataTable';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Pages with common layout */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/onboarding"
          element={
            <Layout>
              <OnboardingWizard />
            </Layout>
          }
        />
        <Route
          path="/admin"
          element={
            <Layout>
              <AdminPanel />
            </Layout>
          }
        />
        <Route
          path="/users"
          element={
            <Layout>
              <DataTable />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
