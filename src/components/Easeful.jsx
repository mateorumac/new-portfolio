import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "../styles/Easeful.css";
import easefulLogo from "../assets/projects/logo.png";
import easefulMockup from "../assets/projects/easeful-landing.webp";

export default function Easeful() {
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
    <section id="easeful" ref={sectionRef} className="easeful">
      <div className="easeful__container">
        <div className="easeful__inner">

          {/* LEFT: content */}
          <div className="easeful__content">

            <div className="easeful__brand" data-reveal data-delay="0">
              <img
                src={easefulLogo}
                alt="Easeful"
                className="easeful__logo"
              />
              <span className="easeful__eyebrow">
                {t("FINANCIAL DECISION APP")}
              </span>
            </div>

            <h2 className="easeful__heading" data-reveal data-delay="80">
              Easeful
            </h2>

            <div className="easeful__body" data-reveal data-delay="160">
              <p className="easeful__hook">
                {t("What does this decision actually cost me \u2014 in time?")}
              </p>
              <p>
                <a
                  href="https://tryeaseful.com/en"
                  className="easeful__inline-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Easeful financial decision app"
                >
                  Easeful
                </a>
                {t(" is a financial decision app that helps users understand how spending affects their life runway, not just their account balance.")}
              </p>
              <p>
                {t(
                  "Instead of focusing on traditional budgeting, the product translates expenses into time and impact. It is designed to answer a simple question: what does this decision actually cost me?"
                )}
              </p>
            </div>

            <div className="easeful__cta" data-reveal data-delay="260">
              <a
                href="https://app.tryeaseful.com"
                className="btn primary"
                target="_blank"
                rel="noopener noreferrer"
                title="Easeful financial decision app"
              >
                {t("Try Easeful")}
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
              <a
                href="https://tryeaseful.com/en"
                className="btn ghost"
                target="_blank"
                rel="noopener noreferrer"
                title="Easeful financial decision app"
              >
                {t("More about the product")}
              </a>
            </div>
          </div>

          {/* RIGHT: real product screenshot */}
          <div className="easeful__visual" data-reveal data-delay="280">
            <div className="easeful__glow-under" aria-hidden="true" />
            {/* The mockup is the marketing site, so it points there rather
                than at the app itself. */}
            <a
              href="https://tryeaseful.com/en"
              className="easeful__shot"
              target="_blank"
              rel="noopener noreferrer"
              title="Easeful financial decision app"
            >
              <img
                src={easefulMockup}
                alt="Easeful financial decision app screenshot"
                className="easeful__img"
                loading="lazy"
                decoding="async"
              />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
