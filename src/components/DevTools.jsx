import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "../styles/DevTools.css";
import devToolsImage from "../assets/projects/dev-tools-mockup.webp";
import devToolsLogo from "../assets/projects/logo_dev-tools.svg";

export default function DevTools() {
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
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );

    revealEls.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return (
    <section id="devtools" ref={sectionRef} className="devtools">
      <div className="devtools__container">
        <div className="devtools__inner">

          {/* LEFT: OG image */}
          <div className="devtools__visual" data-reveal data-delay="0">
            <div className="devtools__glow-under" aria-hidden="true" />
            <a
              href="/tools/"
              className="devtools__shot"
              target="_blank"
              rel="noopener"
              title="dev-tools by Mateo Rumac"
            >
              <img
                src={devToolsImage}
                alt="dev-tools shown on a laptop screen"
                className="devtools__img"
                loading="lazy"
                decoding="async"
              />
            </a>
          </div>

          {/* RIGHT: content */}
          <div className="devtools__content">

            <div className="devtools__brand" data-reveal data-delay="80">
              <img
                src={devToolsLogo}
                alt="dev-tools"
                className="devtools__logo"
              />
              <span className="devtools__eyebrow">
                {t("FREE TOOLS FOR DEVELOPERS")}
              </span>
            </div>

            <h2 className="devtools__heading" data-reveal data-delay="140">
              dev-tools
            </h2>

            <div className="devtools__body" data-reveal data-delay="200">
              <p className="devtools__hook">
                {t("Small tools for real web work.")}
              </p>
              <p>
                {t("I kept redoing the same five-minute tasks on every project, so I built")}{" "}
                <a
                  href="/tools/"
                  className="devtools__inline-link"
                  target="_blank"
                  rel="noopener"
                  title="dev-tools by Mateo Rumac"
                >
                  dev-tools
                </a>
                {t(
                  ": image conversion, favicon and Open Graph generation, a contrast checker, a launch checklist, even an AI prompt generator."
                )}
              </p>
              <p>
                {t(
                  "Everything runs locally in the tab, nothing gets uploaded. No sign-up, no ads, no tracking. Free to use."
                )}
              </p>
            </div>

            <div className="devtools__cta" data-reveal data-delay="280">
              <a
                href="/tools/"
                className="btn primary"
                target="_blank"
                rel="noopener"
                title="dev-tools by Mateo Rumac"
              >
                {t("Open dev-tools")}
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
