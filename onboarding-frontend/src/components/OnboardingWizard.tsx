// src/components/OnboardingWizard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from '../utils/validators';

interface UserData {
  id?: number;
  email: string;
  password: string;
  aboutMe?: string;
  birthdate?: string; // ISO date string YYYY-MM-DD format
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  step?: number;
}

interface ComponentConfig {
  id: number;
  name: string;
  page: number;
}

const TOTAL_STEPS = 3;
const CONFIG_ENDPOINT = '/api/admin/config';
const USER_ENDPOINT = '/api/users';

/**
 * OnboardingWizard component manages a multi-step user onboarding flow.
 * Step 1: Email & Password (basic validation & user creation)
 * Steps 2 & 3: Dynamically rendered components configurable by admin API
 */
const OnboardingWizard: React.FC = () => {
  // State for user data, current step, loading status, error messages, etc.
  const [userData, setUserData] = useState<UserData>({ email: '', password: '' });
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [userId, setUserId] = useState<number | null>(null);
  const [components, setComponents] = useState<ComponentConfig[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState<boolean>(false);

  const navigate = useNavigate();

  /**
   * Fetch dynamic step configuration from admin endpoint.
   * Called only on steps > 1.
   */
  const fetchComponentConfig = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(CONFIG_ENDPOINT);
      if (!response.ok) throw new Error('Failed to load onboarding configuration.');
      const data: ComponentConfig[] = await response.json();
      setComponents(data);
    } catch (err: any) {
      setError(err.message || 'Unknown error while loading configuration.');
    }
  }, []);

  // Fetch config when user progresses beyond step 1
  useEffect(() => {
    if (currentStep > 1) {
      fetchComponentConfig();
    }
  }, [currentStep, fetchComponentConfig]);

  /**
   * Validate step 1 user inputs: email and password.
   * Returns error message string or null if valid.
   */
  const validateStep1 = (): string | null => {
    if (!validateEmail(userData.email)) {
      return 'Please enter a valid email address.';
    }
    if (!validatePassword(userData.password)) {
      return 'Password must be at least 8 characters, and include uppercase, lowercase, number, and special character.';
    }
    return null;
  };

  /**
   * Validate dynamic step fields based on loaded component configuration.
   */
  const validateDynamicStep = (): string | null => {
    const requiredComponents = components.filter(c => c.page === currentStep).map(c => c.name.toLowerCase());

    if (requiredComponents.includes('about me') && !userData.aboutMe?.trim()) {
      return 'About Me is required.';
    }

    if (requiredComponents.includes('birthdate')) {
      if (!userData.birthdate) {
        return 'Birthdate is required.';
      }
      const birthDateObj = new Date(userData.birthdate);
      const now = new Date();
      if (isNaN(birthDateObj.getTime()) || birthDateObj >= now) {
        return 'Please enter a valid birthdate in the past.';
      }
    }

    if (requiredComponents.includes('address')) {
      const { street, city, state, zip } = userData;
      if (!street?.trim() || !city?.trim() || !state?.trim() || !zip?.trim()) {
        return 'All address fields are required.';
      }
      if (!/^\d{5}$/.test(zip)) {
        return 'Zip code must be exactly 5 digits.';
      }
    }

    return null;
  };

  /**
   * Handle submission of Step 1 (email + password).
   * Creates new user or fetches existing.
   */
  const handleStep1Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const validationError = validateStep1();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(USER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userData.email, password: userData.password, step: 2 }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setError(responseData.error || 'Email already exists.');
          return;
        }
        throw new Error(responseData.error || 'Failed to create user.');
      }

      setUserId(responseData.id);
      setCurrentStep(2);
    } catch (err: any) {
      setError(err.message || 'Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle submission for dynamic steps (2 and 3).
   * Updates user data via PUT.
   */
  const handleStepSubmit = async () => {
    setError(null);

    if (!userId) {
      setError('Session expired. Please restart the onboarding process.');
      return;
    }

    const validationError = validateDynamicStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const nextStep = currentStep < TOTAL_STEPS ? currentStep + 1 : TOTAL_STEPS + 1;

      const response = await fetch(`${USER_ENDPOINT}/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, step: nextStep }),
      });

      if (!response.ok) {
        const errResp = await response.json();
        throw new Error(errResp.error || 'Failed to update user data.');
      }

      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(nextStep);
      } else {
        setCompleted(true);
      }
    } catch (err: any) {
      setError(err.message || 'Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Redirect after completion with delay
  useEffect(() => {
    if (completed) {
      const timeoutId = setTimeout(() => navigate('/'), 1500);
      return () => clearTimeout(timeoutId);
    }
  }, [completed, navigate]);

  /**
   * Render dynamically configured onboarding components per current step.
   */
  const renderComponents = () => {
    return components
      .filter(c => c.page === currentStep)
      .map(({ id, name }) => {
        const key = `comp-${id}`;
        const normalizedName = name.toLowerCase();

        switch (normalizedName) {
          case 'about me':
            return (
              <div key={key} className="onboarding-component">
                <label htmlFor="aboutMe">About Me</label>
                <textarea
                  id="aboutMe"
                  value={userData.aboutMe || ''}
                  onChange={e => setUserData(prev => ({ ...prev, aboutMe: e.target.value }))}
                  aria-required="true"
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
                  value={userData.birthdate || ''}
                  onChange={e => setUserData(prev => ({ ...prev, birthdate: e.target.value }))}
                  max={new Date().toISOString().split('T')[0]} // Prevent future dates
                  aria-required="true"
                />
              </div>
            );

          case 'address':
            return (
              <fieldset key={key} className="onboarding-component address-group" aria-required="true">
                <legend>Address</legend>
                <label htmlFor="street">Street</label>
                <input
                  id="street"
                  type="text"
                  value={userData.street || ''}
                  onChange={e => setUserData(prev => ({ ...prev, street: e.target.value }))}
                  required
                />

                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  value={userData.city || ''}
                  onChange={e => setUserData(prev => ({ ...prev, city: e.target.value }))}
                  required
                />

                <label htmlFor="state">State</label>
                <input
                  id="state"
                  type="text"
                  value={userData.state || ''}
                  onChange={e => setUserData(prev => ({ ...prev, state: e.target.value }))}
                  required
                />

                <label htmlFor="zip">Zip</label>
                <input
                  id="zip"
                  type="text"
                  value={userData.zip || ''}
                  onChange={e => setUserData(prev => ({ ...prev, zip: e.target.value }))}
                  maxLength={5}
                  pattern="\d{5}"
                  title="Zip code must be exactly 5 digits"
                  required
                />
              </fieldset>
            );

          default:
            return null;
        }
      });
  };

  return (
    <main className="page-wrapper" role="main" aria-live="polite" aria-busy={loading}>
      <div className="onboarding-container">
        <header className="onboarding-header">
          <h1>User Onboarding Wizard</h1>
          <p>
            Step {currentStep} of {TOTAL_STEPS}
          </p>
        </header>

        {completed ? (
          <section aria-live="assertive">
            <h2 tabIndex={-1}>Thank you!</h2>
            <p>Redirecting you shortly...</p>
          </section>
        ) : currentStep === 1 ? (
          <form onSubmit={handleStep1Submit} noValidate aria-describedby="error-message">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={userData.email}
                onChange={e => setUserData(prev => ({ ...prev, email: e.target.value }))}
                required
                autoComplete="email"
                aria-required="true"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={userData.password}
                onChange={e => setUserData(prev => ({ ...prev, password: e.target.value }))}
                required
                autoComplete="new-password"
                aria-required="true"
              />
            </div>

            {error && (
              <p id="error-message" className="error-message" role="alert" aria-live="assertive">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} aria-disabled={loading}>
              {loading ? 'Checking...' : 'Next'}
            </button>
          </form>
        ) : (
          <section aria-describedby="error-message">
            {renderComponents()}

            {error && (
              <p id="error-message" className="error-message" role="alert" aria-live="assertive">
                {error}
              </p>
            )}

            <button onClick={handleStepSubmit} disabled={loading} aria-disabled={loading}>
              {loading ? 'Saving...' : currentStep < TOTAL_STEPS ? 'Next' : 'Finish'}
            </button>
          </section>
        )}
      </div>
    </main>
  );
};

export default OnboardingWizard;
