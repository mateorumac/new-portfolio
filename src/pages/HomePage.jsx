import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import TimelineExperience from "../components/TimelineExperience";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <TimelineExperience />
      <Projects />
      <Contact />
    </main>
  );
}
