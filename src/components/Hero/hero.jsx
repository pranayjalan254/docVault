import "./hero.css";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section id="home" className="hero-section">
      <div className="hero-content">
        <h2>Unlock the Future of Credential Management</h2>
        <p>Decentralized. Secured. Seamless.</p>
        <button className="cta-button" onClick={() => navigate("/auth")}>
          Explore Now
        </button>
      </div>
      <div className="hero-animation">
        <img src="/hero.jpg" alt="Hero Animation" />
      </div>
    </section>
  );
};

export default Hero;
