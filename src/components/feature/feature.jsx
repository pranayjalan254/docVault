import "./feature.css";

const Features = () => {
  return (
    <section id="features" className="features-section">
      <h2>Why DocVault?</h2>
      <div className="features-grid">
        <article className="feature-card">
          <h3>Decentralized</h3>
          <p>
            Certificates are stored securely on the blockchain, ensuring trust
            and transparency.
          </p>
        </article>
        <article className="feature-card">
          <h3>Secured Credentials</h3>
          <p>Only authorized personnel can decrypt certificates</p>
        </article>
        <article className="feature-card">
          <h3>Seamless Integration</h3>
          <p>
            Easy to link with student wallets and issue certificates from
            institutions.
          </p>
        </article>
      </div>
    </section>
  );
};

export default Features;
