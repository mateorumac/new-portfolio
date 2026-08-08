import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "../styles/Skills.css";

const SKILL_GROUPS = [
  {
    key: "frontend",
    label: "Frontend",
    items: [
      "JavaScript",
      "React",
      "Astro",
      "Vite",
      "Next.js",
      "HTML5",
      "CSS3",
      "Chart.js",
      "Three.js",
      "Responsive UI",
      "Accessibility",
      "i18n",
    ],
  },
  {
    key: "backend",
    label: "Backend",
    items: [
      "PHP",
      "MySQL",
      "REST API Development",
      "Third-party API Integrations",
      "Authentication & Authorization",
      "Stripe Payments",
      "Webhook Processing",
      "Server-side Validation",
      "Data aggregation",
    ],
  },
  {
    key: "tools",
    label: "Tools & Delivery",
    items: [
      "Git",
      "Bitbucket",
      "Postman",
      "Composer",
      "SSH",
      "cPanel",
      "API debugging",
      "Technical SEO",
      "Production deployment",
      "Email / SMTP",
    ],
  },
];

export default function Skills() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const revealEls = section.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    );

    revealEls.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="skills">
      <div className="skills__container">
        <h2 className="skills__title" data-reveal="fade-up">
          {t("TECHNICAL SKILLS")}
        </h2>
        <p className="skills__note" data-reveal="fade-up" data-delay="100">
          {t(
            "Technologies and tools I use to build and ship production web applications."
          )}
        </p>

        <div className="skills__rows">
          {SKILL_GROUPS.map((group, idx) => (
            <div
              key={group.key}
              className="skills__row"
              data-accent={group.key}
              data-reveal="fade-up"
              data-delay={String(150 + idx * 90)}
            >
              <div className="skills__row-label">
                <span className="skills__row-mark" aria-hidden="true" />
                <h3 className="skills__row-title">{t(group.label)}</h3>
              </div>
              <ul className="skills__row-tags">
                {group.items.map((item) => (
                  <li key={item}>{t(item)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
