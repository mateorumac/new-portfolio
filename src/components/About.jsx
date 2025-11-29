import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import me from "../assets/MateoRumac.webp";
import "../styles/About.css";

export default function About() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const items = root.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -5% 0px" }
    );

    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="about">
      <div className="about__rail" aria-hidden="true" />

      <div className="about__container">
        <h2 className="about__title" data-reveal="fade-up">
          {t("ABOUT ME")}
        </h2>

        <div className="about__grid">
          <figure className="about__figure" data-reveal="slide-left">
            <span className="about__frame">
              <img
                src={me}
                alt={t("Picture of Mateo Rumac playing basketball")}
                loading="lazy"
                width="540"
                height="540"
              />
            </span>
          </figure>

          <article className="about__card" data-reveal="slide-right">
            <p className="about__lead">
              {t(
                "Hi 👋 I’m Mateo Rumac, a frontend developer focused on building fast, accessible and thoughtfully designed web experiences. I enjoy turning ideas into clean, responsive interfaces that feel intuitive and effortless to use."
              )}
            </p>

            <p>
              {t(
                "Most of my work is in React and modern frontend tooling, with an emphasis on smooth UX, strong performance and maintainable UI architecture. When a project needs it, I also work across the stack, including custom APIs, Stripe integrations and deployments, but my main strength and passion remain on the frontend."
              )}
            </p>

            <p>
              {t(
                "Outside of coding, you will usually find me at the gym, spending time with friends or watching football. I am always learning, improving and exploring new technologies."
              )}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
