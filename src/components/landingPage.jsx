import Navbar from "./Navbar/navbar";
import Hero from "./Hero/hero";
import Features from "./feature/feature";
import About from "./about/about";
import Footer from "./footer/footer";
import Team from "./team/Team";
function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <About />
      <Team />
      <Footer />
    </>
  );
}

export default LandingPage;
