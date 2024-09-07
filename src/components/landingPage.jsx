import Navbar from "./Navbar/navbar";
import Hero from "./Hero/hero";
import Features from "./feature/feature";
import About from "./about/about";
import Footer from "./footer/footer";
import Team from "./team/Team";
import FutureProspects from "./future/Future";
function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <About />
      <Team />
      <FutureProspects />
      <Footer />
    </>
  );
}

export default LandingPage;
