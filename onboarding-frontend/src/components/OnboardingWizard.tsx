// src/components/OnboardingWizard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from '../utils/validators';

type UserData = {
  id?: number;
  email: string;
  password: string;
  aboutMe?: string;
  birthdate?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  step?: number;
};

type ComponentConfig = {
  id: number;
  name: string;
  page: number;
};

// Constants
const TOTAL_STEPS = 3;
const CONFIG_ENDPOINT = '/api/admin/config';
const USER_ENDPOINT = '/api/users';

const OnboardingWizard: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({ email: '', password: '' });
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [userId, setUserId] = useState<number | null>(null);
  const [components, setComponents] = useState<ComponentConfig[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState<boolean>(false);

  const navigate = useNavigate();

  // Fetch component config from admin for dynamic step rendering
  const fetchComponentConfig = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(CONFIG_ENDPOINT);
      if (!response.ok) throw new Error('Failed to load component configuration');
      const data: ComponentConfig[] = await response.json();
      setComponents(data);
    } catch (err: any) {
      setError(err.message || 'Error loading component configuration');
    }
  }, []);

  useEffect(() => {
    if (currentStep > 1) {
      fetchComponentConfig();
    }
  }, [currentStep, fetchComponentConfig]);

  // Validate Step 1 fields
  const validateStep1 = (): string | null => {
    if (!validateEmail(userData.email)) return 'Please enter a valid @gmail.com email address.';
    if (!validatePassword(userData.password)) {
      return 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.';
    }
    return null;
  };

  // Validate dynamic step 2 or 3 based on config
  const validateDynamicStep = (): string | null => {
    const required = components
      .filter(c => c.page === currentStep)
      .map(c => c.name.toLowerCase());

    if (required.includes('about me') && !userData.aboutMe?.trim()) {
      return 'About Me is required.';
    }

    if (required.includes('birthdate')) {
      const date = new Date(userData.birthdate || '');
      if (!userData.birthdate || isNaN(date.getTime()) || date > new Date()) {
        return 'Please provide a valid past birthdate.';
      }
    }

    if (required.includes('address')) {
      const { street, city, state, zip } = userData;
      if (!street?.trim() || !city?.trim() || !state?.trim() || !zip?.trim()) {
        return 'All address fields are required.';
      }
    }

    return null;
  };

  // Handle step 1 form submission
  const handleStep1Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const validationError = validateStep1();
    if (validationError) return setError(validationError);

    setLoading(true);
    try {
      const response = await fetch(USER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, step: 2 }),
      });

      if (!response.ok) throw new Error('Failed to create user');
      const data = await response.json();

      setUserId(data.id);
      setCurrentStep(2);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle step 2 or 3 submit
  const handleStepSubmit = async () => {
    setError(null);
    if (!userId) return setError('Session expired. Please restart the onboarding process.');

    const validationError = validateDynamicStep();
    if (validationError) return setError(validationError);

    setLoading(true);
    try {
      const nextStep = currentStep < TOTAL_STEPS ? currentStep + 1 : TOTAL_STEPS + 1;

      const response = await fetch(`${USER_ENDPOINT}/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, step: nextStep }),
      });

      if (!response.ok) throw new Error('Failed to update user data');

      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(nextStep);
      } else {
        setCompleted(true);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong while saving.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-redirect to home after 3s once onboarding completes
  useEffect(() => {
    if (completed) {
      const timer = setTimeout(() => navigate('/'), 3000);
      return () => clearTimeout(timer);
    }
  }, [completed, navigate]);

  // Render dynamic components based on admin config
  const renderComponents = () => {
    const pageComponents = components.filter(c => c.page === currentStep);

    return pageComponents.map(({ id, name }) => {
      const key = `component-${id}`;
      const normalized = name.toLowerCase();

      switch (normalized) {
        case 'about me':
          return (
            <div key={key} className="onboarding-component">
              <label htmlFor="aboutMe">About Me</label>
              <textarea
                id="aboutMe"
                value={userData.aboutMe || ''}
                onChange={(e) => setUserData(prev => ({ ...prev, aboutMe: e.target.value }))}
                required
              />
            </div>
          );
        case 'birthdate':
          return (
            <div key={key} className="onboarding-component">
              <label htmlFor="birthdate">Birthdate</label>
              <input
                id="birthdate"
                type="date"
                value={userData.birthdate?.substring(0, 10) || ''}
                onChange={(e) => setUserData(prev => ({ ...prev, birthdate: e.target.value }))}
                required
              />
            </div>
          );
        case 'address':
          return (
            <div key={key} className="onboarding-component address-group">
              <label htmlFor="street">Street</label>
              <input
                id="street"
                type="text"
                value={userData.street || ''}
                onChange={(e) => setUserData(prev => ({ ...prev, street: e.target.value }))}
                required
              />
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                value={userData.city || ''}
                onChange={(e) => setUserData(prev => ({ ...prev, city: e.target.value }))}
                required
              />
              <label htmlFor="state">State</label>
              <input
                id="state"
                type="text"
                value={userData.state || ''}
                onChange={(e) => setUserData(prev => ({ ...prev, state: e.target.value }))}
                required
              />
              <label htmlFor="zip">Zip Code</label>
              <input
                id="zip"
                type="text"
                value={userData.zip || ''}
                onChange={(e) => setUserData(prev => ({ ...prev, zip: e.target.value }))}
                required
              />
            </div>
          );
        default:
          return null;
      }
    });
  };

  // UI if onboarding completed
  if (completed) {
    return (
      <div className="page-wrapper">
        <div className="onboarding-container">
          <h1>Thank you!</h1>
          <p>Onboarding complete. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="onboarding-container" role="main" aria-labelledby="onboarding-header">
        <header className="onboarding-header">
          <h1 id="onboarding-header">User Onboarding Wizard</h1>
          <p aria-live="polite">Step {currentStep} of {TOTAL_STEPS}</p>
        </header>

        {currentStep === 1 ? (
          <form onSubmit={handleStep1Submit} noValidate>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={userData.email}
                onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={userData.password}
                onChange={(e) => setUserData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>

            {error && <p className="error-message" role="alert">{error}</p>}

            <button type="submit" disabled={loading} aria-busy={loading}>
              {loading ? 'Saving...' : 'Next'}
            </button>
          </form>
        ) : (
          <section>
            {renderComponents()}
            {error && <p className="error-message" role="alert">{error}</p>}
            <button onClick={handleStepSubmit} disabled={loading} aria-busy={loading}>
              {loading ? 'Saving...' : currentStep < TOTAL_STEPS ? 'Next' : 'Finish'}
            </button>
          </section>
        )}
      </div>
    </div>
  );
};

export default OnboardingWizard;
