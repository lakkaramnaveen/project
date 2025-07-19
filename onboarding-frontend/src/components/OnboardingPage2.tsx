import React, { type ChangeEvent, type FormEvent } from 'react';

/**
 * UserData holds the user input values for onboarding step 2.
 * All fields are optional since some may not be part of the form dynamically.
 */
interface UserData {
  aboutMe?: string;
  birthdate?: string; // ISO string (yyyy-mm-dd)
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}

/**
 * Props for the OnboardingPage2 component.
 * - userData: current values entered by the user
 * - components: which components to render on this page (dynamically configured)
 * - onUserDataChange: callback to update userData state in parent
 * - onSubmit: callback when form is submitted
 * - loading: disables form submit button and shows loading state
 * - error: optional error message to display
 */
interface OnboardingPage2Props {
  userData: UserData;
  components: string[]; // e.g. ['aboutme', 'birthdate', 'address']
  onUserDataChange: (newData: Partial<UserData>) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
}

/**
 * OnboardingPage2 Component - Step 2 of onboarding flow
 * Renders dynamic fields based on components prop,
 * handles controlled inputs and form submission.
 */
const OnboardingPage2: React.FC<OnboardingPage2Props> = ({
  userData,
  components,
  onUserDataChange,
  onSubmit,
  loading,
  error,
}) => {
  /**
   * Handles input and textarea changes.
   * Calls onUserDataChange with updated field value.
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUserDataChange({ [name]: value });
  };

  /**
   * Handles form submission.
   * Prevents default page reload.
   */
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="onboarding-form" noValidate aria-live="polite">
      <h2>Step 2 of 3</h2>

      {/* About Me Section */}
      {components.includes('aboutme') && (
        <div className="onboarding-component">
          <label htmlFor="aboutMe">About Me:</label>
          <textarea
            id="aboutMe"
            name="aboutMe"
            value={userData.aboutMe ?? ''}
            onChange={handleChange}
            rows={5}
            placeholder="Tell us about yourself"
            aria-describedby="aboutMe-help"
          />
          <small id="aboutMe-help" className="sr-only">
            Provide a brief description about yourself.
          </small>
        </div>
      )}

      {/* Birthdate Section */}
      {components.includes('birthdate') && (
        <div className="onboarding-component">
          <label htmlFor="birthdate">Birthdate:</label>
          <input
            type="date"
            id="birthdate"
            name="birthdate"
            value={userData.birthdate ? userData.birthdate.slice(0, 10) : ''}
            onChange={handleChange}
            aria-describedby="birthdate-help"
          />
          <small id="birthdate-help" className="sr-only">
            Enter your birthdate.
          </small>
        </div>
      )}

      {/* Address Section */}
      {components.includes('address') && (
        <>
          <div className="onboarding-component">
            <label htmlFor="street">Street:</label>
            <input
              type="text"
              id="street"
              name="street"
              value={userData.street ?? ''}
              onChange={handleChange}
              placeholder="123 Main St"
              autoComplete="street-address"
            />
          </div>
          <div className="onboarding-component">
            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="city"
              name="city"
              value={userData.city ?? ''}
              onChange={handleChange}
              placeholder="City"
              autoComplete="address-level2"
            />
          </div>
          <div className="onboarding-component">
            <label htmlFor="state">State:</label>
            <input
              type="text"
              id="state"
              name="state"
              value={userData.state ?? ''}
              onChange={handleChange}
              placeholder="State"
              autoComplete="address-level1"
            />
          </div>
          <div className="onboarding-component">
            <label htmlFor="zip">Zip:</label>
            <input
              type="text"
              id="zip"
              name="zip"
              value={userData.zip ?? ''}
              onChange={handleChange}
              placeholder="Zip code"
              autoComplete="postal-code"
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </div>
        </>
      )}

      {/* Display error message if present */}
      {error && (
        <p
          className="error-message"
          role="alert"
          style={{ color: 'red', marginTop: '1rem' }}
          tabIndex={-1}
        >
          {error}
        </p>
      )}

      {/* Submit Button */}
      <button type="submit" disabled={loading} aria-busy={loading}>
        {loading ? 'Saving...' : 'Next'}
      </button>
    </form>
  );
};

export default OnboardingPage2;
