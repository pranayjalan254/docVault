import React from "react";
import "./hero.css";

const Hero = () => {
  return (
    <section id="home" className="hero-section">
      <div className="hero-content">
        <h2>Unlock the Future of Credential Verification</h2>
        <p>Decentralized. Trustless. Seamless.</p>
        <button className="cta-button">Explore Now</button>
      </div>
      <div className="hero-animation">
        <img src="src/assets/hero.webp" alt="Hero Animation" />
      </div>
    </section>
  );
};

export default Hero;
