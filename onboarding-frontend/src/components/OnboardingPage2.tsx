import React, { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

interface UserData {
  aboutMe?: string;
  birthdate?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}

interface OnboardingPage2Props {
  userId: number | string;
  userData: UserData;
  onNext: () => void;
  onBack: () => void;
  onUserUpdate: (updatedUser: any) => void;
}

const OnboardingPage2: React.FC<OnboardingPage2Props> = ({
  userId,
  userData,
  onNext,
  onBack,
  onUserUpdate,
}) => {
  // State for dynamic component list (strings normalized to lowercase no spaces)
  const [components, setComponents] = useState<string[]>([]);
  // Form state initialized from passed userData (trim birthdate to yyyy-mm-dd)
  const [formData, setFormData] = useState<UserData>({
    aboutMe: userData.aboutMe || '',
    birthdate: userData.birthdate ? userData.birthdate.slice(0, 10) : '',
    street: userData.street || '',
    city: userData.city || '',
    state: userData.state || '',
    zip: userData.zip || '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch component config for step 2 and normalize names
  useEffect(() => {
    async function fetchConfig() {
      try {
        setError(null);
        setLoading(true);
        const res = await fetch('/api/admin/config');
        if (!res.ok) throw new Error('Failed to fetch config');
        const configs: { name: string; page: number }[] = await res.json();

        const page2Components = configs
          .filter((c) => c.page === 2)
          .map((c) => c.name.toLowerCase().replace(/\s+/g, ''));

        setComponents(page2Components);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  // Handle form input changes generically
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit updated user data for this step
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Prepare payload with only the active components’ data
    const updateData: Partial<UserData> = {};

    components.forEach((component) => {
      switch (component) {
        case 'aboutme':
          updateData.aboutMe = formData.aboutMe;
          break;
        case 'birthdate':
          updateData.birthdate = formData.birthdate;
          break;
        case 'address':
          updateData.street = formData.street;
          updateData.city = formData.city;
          updateData.state = formData.state;
          updateData.zip = formData.zip;
          break;
      }
    });

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) throw new Error('Failed to update user data');
      const updatedUser = await res.json();
      onUserUpdate(updatedUser);
      onNext();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error)
    return (
      <p role="alert" style={{ color: 'red' }}>
        {error}
      </p>
    );

  return (
    <form onSubmit={handleSubmit} className="onboarding-form" aria-labelledby="step2-header" noValidate>
      <h2 id="step2-header">Step 2 of 3</h2>

      {/* Conditionally render About Me */}
      {components.includes('aboutme') && (
        <div className="onboarding-component">
          <label htmlFor="aboutMe">About Me:</label>
          <textarea
            id="aboutMe"
            name="aboutMe"
            value={formData.aboutMe}
            onChange={handleChange}
            rows={5}
            placeholder="Tell us about yourself"
            aria-describedby="aboutMeHelp"
          />
          <small id="aboutMeHelp" className="sr-only">
            Please provide a short description about yourself.
          </small>
        </div>
      )}

      {/* Conditionally render Birthdate */}
      {components.includes('birthdate') && (
        <div className="onboarding-component">
          <label htmlFor="birthdate">Birthdate:</label>
          <input
            type="date"
            id="birthdate"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
            aria-describedby="birthdateHelp"
          />
          <small id="birthdateHelp" className="sr-only">
            Select your birthdate.
          </small>
        </div>
      )}

      {/* Conditionally render Address fields */}
      {components.includes('address') && (
        <>
          <div className="onboarding-component">
            <label htmlFor="street">Street:</label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="123 Main St"
            />
          </div>
          <div className="onboarding-component">
            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
            />
          </div>
          <div className="onboarding-component">
            <label htmlFor="state">State:</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
            />
          </div>
          <div className="onboarding-component">
            <label htmlFor="zip">Zip:</label>
            <input
              type="text"
              id="zip"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              placeholder="Zip code"
            />
          </div>
        </>
      )}

      <div className="onboarding-buttons" style={{ marginTop: '1rem' }}>
        <button type="button" onClick={onBack}>
          Back
        </button>
        <button type="submit" style={{ marginLeft: '1rem' }}>
          Next
        </button>
      </div>
    </form>
  );
};

export default OnboardingPage2;
