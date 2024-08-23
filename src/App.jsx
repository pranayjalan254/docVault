import "./App.css";
import Navbar from "./components/Navbar/navbar";
import Hero from "./components/Hero/hero";
import Features from "./components/feature/feature";
import About from "./components/about/about";
import Footer from "./components/footer/footer";
function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <About />
      <Footer />
    </>
  );
}

export default App;
