import React, { useState, useEffect } from 'react';
import '../styles/OnboardingWizard.css'; // import the new CSS

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

const OnboardingWizard: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({ email: '', password: '' });
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [components, setComponents] = useState<ComponentConfig[]>([]);

  useEffect(() => {
    if (currentStep > 1) {
      fetch('/api/admin/config')
        .then(res => res.json())
        .then(data => setComponents(data))
        .catch(() => setError('Failed to load component config'));
    }
  }, [currentStep]);

  const validateStep1 = (): string | null => {
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

    if (!emailRegex.test(userData.email)) {
      return 'Email must be a valid @gmail.com address';
    }
    if (!passwordRegex.test(userData.password)) {
      return 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character';
    }
    return null;
  };

  const validateStep23 = (): string | null => {
    const requiredComponents = components.filter(c => c.page === currentStep).map(c => c.name.toLowerCase());

    if (requiredComponents.includes('about me') && !userData.aboutMe?.trim()) {
      return 'About Me is required';
    }
    if (requiredComponents.includes('birthdate')) {
      const date = new Date(userData.birthdate || '');
      if (isNaN(date.getTime()) || date > new Date()) {
        return 'Birthdate must be a valid date in the past';
      }
    }
    if (requiredComponents.includes('address')) {
      if (!userData.street || !userData.city || !userData.state || !userData.zip) {
        return 'All address fields are required';
      }
    }
    return null;
  };

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
      setError(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleStepSubmit = async () => {
    if (!userId) return;
    setError(null);

    const validationError = validateStep23();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, step: currentStep + 1 }),
      });
      if (!response.ok) throw new Error('Failed to update user');

      if (currentStep < 3) {
        setCurrentStep(prev => prev + 1);
      } else {
        alert('Onboarding complete!');
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderComponents = () => {
    const currentPageComponents = components.filter(c => c.page === currentStep);

    return currentPageComponents.map(component => {
      switch (component.name.toLowerCase()) {
        case 'about me':
          return (
            <div key="aboutMe" className="onboarding-component">
              <label>About Me:</label>
              <textarea
                value={userData.aboutMe || ''}
                onChange={(e) => setUserData({ ...userData, aboutMe: e.target.value })}
                rows={4}
                required
                placeholder="Tell us about yourself"
              />
            </div>
          );
        case 'birthdate':
          return (
            <div key="birthdate" className="onboarding-component">
              <label>Birthdate:</label>
              <input
                type="date"
                value={userData.birthdate ? userData.birthdate.substring(0, 10) : ''}
                onChange={(e) => setUserData({ ...userData, birthdate: e.target.value })}
                required
              />
            </div>
          );
        case 'address':
          return (
            <div key="address" className="onboarding-component">
              <label>Street:</label>
              <input
                type="text"
                value={userData.street || ''}
                onChange={(e) => setUserData({ ...userData, street: e.target.value })}
                required
                placeholder="123 Main St"
              />
              <label>City:</label>
              <input
                type="text"
                value={userData.city || ''}
                onChange={(e) => setUserData({ ...userData, city: e.target.value })}
                required
                placeholder="City"
              />
              <label>State:</label>
              <input
                type="text"
                value={userData.state || ''}
                onChange={(e) => setUserData({ ...userData, state: e.target.value })}
                required
                placeholder="State"
              />
              <label>Zip:</label>
              <input
                type="text"
                value={userData.zip || ''}
                onChange={(e) => setUserData({ ...userData, zip: e.target.value })}
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
    <div className="onboarding-container">
      <div className="onboarding-header">
        <h1>User Onboarding Wizard</h1>
        <p>Step {currentStep} of 3</p>
      </div>

      {currentStep === 1 && (
        <form onSubmit={handleStep1Submit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              required
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              placeholder="your.email@gmail.com"
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              required
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              placeholder="Enter a strong password"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Next'}
          </button>
        </form>
      )}

      {currentStep > 1 && (
        <>
          {renderComponents()}
          {error && <p className="error-message">{error}</p>}
          <button onClick={handleStepSubmit} disabled={loading}>
            {loading ? 'Saving...' : currentStep < 3 ? 'Next' : 'Finish'}
          </button>
        </>
      )}
    </div>
  );
};

export default OnboardingWizard;
