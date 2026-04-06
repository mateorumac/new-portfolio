import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import TimelineExperience from "../components/TimelineExperience";
import Easeful from "../components/Easeful";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <TimelineExperience />
      <Easeful />
      <Projects />
      <Contact />
    </main>
  );
}
