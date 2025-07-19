import React from 'react';

/**
 * Footer component displaying copyright info.
 */
const Footer: React.FC = () => {
  return (
    <footer className="footer" role="contentinfo">
      <p>&copy; {new Date().getFullYear()} Onboarding App. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
