import React, { useState, useEffect, useCallback } from 'react';

// Define user data shape, marking optional fields and step as optional
type UserData = {
  id?: number;
  email: string;
  password: string;
  aboutMe?: string;
  birthdate?: string; // ISO date string (yyyy-mm-dd)
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  step?: number;
};

// Configuration for dynamic onboarding components
type ComponentConfig = {
  id: number;
  name: string;
  page: number;
};

const OnboardingWizard: React.FC = () => {
  // State hooks
  const [userData, setUserData] = useState<UserData>({ email: '', password: '' });
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [components, setComponents] = useState<ComponentConfig[]>([]);

  /**
   * Fetch component config for steps > 1
   * Using useCallback to avoid unnecessary re-creation
   */
  const fetchComponentConfig = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/admin/config');
      if (!response.ok) throw new Error('Failed to load component config');
      const data: ComponentConfig[] = await response.json();
      setComponents(data);
    } catch {
      setError('Failed to load component configuration');
    }
  }, []);

  // Load config on step change (for steps 2 and 3)
  useEffect(() => {
    if (currentStep > 1) {
      fetchComponentConfig();
    }
  }, [currentStep, fetchComponentConfig]);

  /**
   * Validation for Step 1: Email and Password
   * - Email restricted to @gmail.com for demo purposes
   * - Password: min 8 chars, uppercase, lowercase, digit, special char
   */
  const validateStep1 = (): string | null => {
    const emailRegex = /^[^\s@]+@gmail\.com$/i;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

    if (!emailRegex.test(userData.email)) {
      return 'Email must be a valid @gmail.com address';
    }
    if (!passwordRegex.test(userData.password)) {
      return 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character';
    }
    return null;
  };

  /**
   * Validation for Step 2 and 3 dynamic fields based on component config
   */
  const validateStep23 = (): string | null => {
    // Determine required fields for current step
    const requiredComponents = components
      .filter((c) => c.page === currentStep)
      .map((c) => c.name.toLowerCase());

    if (requiredComponents.includes('about me') && !userData.aboutMe?.trim()) {
      return 'About Me is required';
    }
    if (requiredComponents.includes('birthdate')) {
      if (!userData.birthdate) return 'Birthdate is required';
      const birthdate = new Date(userData.birthdate);
      if (isNaN(birthdate.getTime()) || birthdate > new Date()) {
        return 'Birthdate must be a valid date in the past';
      }
    }
    if (requiredComponents.includes('address')) {
      const { street, city, state, zip } = userData;
      if (!street?.trim() || !city?.trim() || !state?.trim() || !zip?.trim()) {
        return 'All address fields are required';
      }
    }
    return null;
  };

  /**
   * Handles form submission of Step 1
   * Creates new user via POST and proceeds to next step on success
   */
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateStep1();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, step: 2 }),
      });
      if (!response.ok) throw new Error('Failed to create user');

      const data = await response.json();
      setUserId(data.id);
      setCurrentStep(2);
    } catch (err: any) {
      setError(err.message || 'Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles form submission for Steps 2 and 3
   * Updates existing user info via PUT, proceeds or finishes onboarding
   */
  const handleStepSubmit = async () => {
    if (!userId) {
      setError('User ID not found. Please restart the onboarding.');
      return;
    }
    setError(null);

    const validationError = validateStep23();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const nextStep = currentStep < 3 ? currentStep + 1 : 4;
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, step: nextStep }),
      });
      if (!response.ok) throw new Error('Failed to update user data');

      if (currentStep < 3) {
        setCurrentStep(nextStep);
      } else {
        alert('Onboarding complete! Thank you.');
      }
    } catch (err: any) {
      setError(err.message || 'Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Render dynamic components for current step based on config
   */
  const renderComponents = () => {
    const currentPageComponents = components.filter((c) => c.page === currentStep);

    return currentPageComponents.map((component) => {
      const key = `component-${component.id}`;
      const nameLower = component.name.toLowerCase();

      switch (nameLower) {
        case 'about me':
          return (
            <div key={key} className="onboarding-component">
              <label htmlFor="aboutMe">About Me:</label>
              <textarea
                id="aboutMe"
                value={userData.aboutMe || ''}
                onChange={(e) => setUserData((prev) => ({ ...prev, aboutMe: e.target.value }))}
                rows={4}
                required
                placeholder="Tell us about yourself"
              />
            </div>
          );

        case 'birthdate':
          return (
            <div key={key} className="onboarding-component">
              <label htmlFor="birthdate">Birthdate:</label>
              <input
                id="birthdate"
                type="date"
                value={userData.birthdate ? userData.birthdate.substring(0, 10) : ''}
                onChange={(e) => setUserData((prev) => ({ ...prev, birthdate: e.target.value }))}
                required
              />
            </div>
          );

        case 'address':
          return (
            <div key={key} className="onboarding-component address-group">
              <label htmlFor="street">Street:</label>
              <input
                id="street"
                type="text"
                value={userData.street || ''}
                onChange={(e) => setUserData((prev) => ({ ...prev, street: e.target.value }))}
                required
                placeholder="123 Main St"
              />

              <label htmlFor="city">City:</label>
              <input
                id="city"
                type="text"
                value={userData.city || ''}
                onChange={(e) => setUserData((prev) => ({ ...prev, city: e.target.value }))}
                required
                placeholder="City"
              />

              <label htmlFor="state">State:</label>
              <input
                id="state"
                type="text"
                value={userData.state || ''}
                onChange={(e) => setUserData((prev) => ({ ...prev, state: e.target.value }))}
                required
                placeholder="State"
              />

              <label htmlFor="zip">Zip:</label>
              <input
                id="zip"
                type="text"
                value={userData.zip || ''}
                onChange={(e) => setUserData((prev) => ({ ...prev, zip: e.target.value }))}
                required
                placeholder="Zip code"
              />
            </div>
          );

        default:
          return null;
      }
    });
  };

  return (
    <div className="page-wrapper">
      <div className="onboarding-container" role="main" aria-labelledby="onboarding-header">
        <header className="onboarding-header">
          <h1 id="onboarding-header">User Onboarding Wizard</h1>
          <p aria-live="polite">Step {currentStep} of 3</p>
        </header>

        {/* Step 1: Email & Password */}
        {currentStep === 1 && (
          <form onSubmit={handleStep1Submit} noValidate>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) => setUserData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="your.email@gmail.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                type="password"
                value={userData.password}
                onChange={(e) => setUserData((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Enter a strong password"
                required
                autoComplete="new-password"
              />
            </div>

            {error && (
              <p className="error-message" role="alert" aria-live="assertive">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} aria-busy={loading}>
              {loading ? 'Saving...' : 'Next'}
            </button>
          </form>
        )}

        {/* Steps 2 & 3: Dynamic fields */}
        {currentStep > 1 && (
          <section aria-label={`Step ${currentStep} form`}>
            {renderComponents()}

            {error && (
              <p className="error-message" role="alert" aria-live="assertive">
                {error}
              </p>
            )}

            <button onClick={handleStepSubmit} disabled={loading} aria-busy={loading}>
              {loading ? 'Saving...' : currentStep < 3 ? 'Next' : 'Finish'}
            </button>
          </section>
        )}
      </div>
    </div>
  );
};

export default OnboardingWizard;
