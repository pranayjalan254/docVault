import "./hero.css";

const HeroSection = ({ title }) => {
  return (
    <div className="hero-section-stud">
      <h1>{title}</h1>
      <p>Your secure platform for managing certificates.</p>
      <button>Verify and Retrieve Certificates</button>
    </div>
  );
};

export default HeroSection;
