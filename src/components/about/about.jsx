import React from "react";
import "./about.css";

const About = () => {
  return (
    <section id="about" className="about-section">
      <h2>About DocVault</h2>
      <p>
        DocVault leverages the Mina Protocol to provide a decentralized,
        trustless, and efficient platform for issuing and verifying
        certificates. It uses Web3Auth for seamless onboarding process for our
        users. LayerZero manages the secure transfer of credentials or ZKPs
        across different blockchains. Tableland securely stores your data
        offchain. Our mission is to revolutionize the way credentials are shared
        and verified.
      </p>
    </section>
  );
};

export default About;
