import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import TimelineExperience from "../components/TimelineExperience";
import DevTools from "../components/DevTools";
import Easeful from "../components/Easeful";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <TimelineExperience />
      <DevTools />
      <Easeful />
      <Projects />
      <Contact />
    </main>
  );
}
