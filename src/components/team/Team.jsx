import "./team.css";

const teamMembers = [
  {
    name: "Pranay Jalan",
    position: "Full Stack Developer",
    description:
      "Passionate about building real-world full-stack applications.",
    photo: "./pranay.jpg",
    socialLinks: {
      twitter: "https://x.com/pranaytwts",
      linkedin: "https://www.linkedin.com/in/pranay-jalan254/",
      github: "https://github.com/pranayjalan254",
    },
  },
  {
    name: "Anmol Agrawal",
    position: "Blockchain Developer",
    description:
      "Enthusiatic about blockchain technology and its applications.",
    photo: "./anmol.jpg",
    socialLinks: {
      twitter: "",
      linkedin: "",
      github: "https://github.com/anmolagr39",
    },
  },
  {
    name: "Ansh Nohria",
    position: "Smart Contract Developer",
    description: "Expert in smart contracts and blockchain infrastructure.",
    photo: "./ansh.jpg",
    socialLinks: {
      twitter: "",
      linkedin: "",
      github: "https://github.com/AnshNohria",
    },
  },
];

const Team = () => {
  return (
    <section className="meet-the-team">
      <h2>Meet the Team</h2>
      <div className="team-cards-container">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-card">
            <img src={member.photo} alt={member.name} className="team-photo" />
            <div className="team-info">
              <h3>{member.name}</h3>
              <p className="team-position">{member.position}</p>
              <p className="team-description">{member.description}</p>
              <div className="social-icons">
                <a
                  href={member.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  href={member.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-linkedin"></i>
                </a>
                <a
                  href={member.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-github"></i>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Team;
