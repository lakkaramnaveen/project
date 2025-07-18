// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OnboardingWizard from './components/OnboardingWizard';
import AdminPanel from './components/AdminPanel';
import DataTable from './components/UserDataTable';
import './styles/App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OnboardingWizard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/users" element={<DataTable />} />
      </Routes>
    </Router>
  );
}

export default App;
