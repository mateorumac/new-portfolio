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
                "Hi 👋 I'm Mateo Rumac, a full-stack developer who builds websites, web apps, and AI-powered automations. I like turning an idea into something people can actually click around in, fast, and without the confusing parts."
              )}
            </p>

            <p>
              {t(
                "Most of my work happens in React and Astro on the frontend, PHP and custom APIs on the backend, and automations wherever they save someone time, think booking systems, internal dashboards, that kind of thing. If it needs to work in production, not just in a demo, that's the part I actually enjoy."
              )}
            </p>

            <p>
              {t(
                "Outside of coding, you'll usually find me at the gym, hanging out with friends, or watching football. Lately I've been spending a lot of that curiosity on AI tooling and automation."
              )}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
