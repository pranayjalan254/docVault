import React from "react";
import "./feature.css";

const Features = () => {
  return (
    <section id="features" className="features-section">
      <h2>Why DocVault?</h2>
      <div className="features-grid">
        <div className="feature-card">
          <h3>Decentralized</h3>
          <p>
            Certificates are stored securely on the blockchain, ensuring trust
            and transparency.
          </p>
        </div>
        <div className="feature-card">
          <h3>Trustless Verification</h3>
          <p>Verify credentials without relying on a centralized authority.</p>
        </div>
        <div className="feature-card">
          <h3>Seamless Integration</h3>
          <p>
            Easy to link with student wallets and issue certificates from
            institutions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;
