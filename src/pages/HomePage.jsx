import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import TimelineExperience from "../components/TimelineExperience";
import DevTools from "../components/DevTools";
import Easeful from "../components/Easeful";
import Nightfall from "../components/Nightfall";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <TimelineExperience />
      <DevTools />
      <Easeful />
      <Nightfall />
      <Projects />
      <Contact />
    </main>
  );
}
