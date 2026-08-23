import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/MealMate.css";

import mealmateMockup from "../assets/projects/mealmate.webp";
import mealmateLogo from "../assets/projects/mealmate-logo.webp";

export default function MealMate() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const detailsRef = useRef(null);
  const panelRef = useRef(null);
  const animRef = useRef(null);
  const [expanded, setExpanded] = useState(false);

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

  // Cancel an in-flight expand/collapse if the section unmounts mid-animation,
  // otherwise its onfinish would touch a detached <details>.
  useEffect(() => () => animRef.current?.cancel(), []);

  const handleToggle = (event) => {
    const details = detailsRef.current;
    const panel = panelRef.current;
    if (!details || !panel) return;

    const opening = !details.open;
    setExpanded(opening);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return; // let the browser do its instant toggle
    }

    event.preventDefault();
    animRef.current?.cancel();

    // Opening: reveal the content first so it can be measured.
    if (opening) details.open = true;

    const height = panel.scrollHeight;
    const anim = panel.animate(
      {
        height: opening ? ["0px", `${height}px`] : [`${height}px`, "0px"],
        opacity: opening ? [0, 1] : [1, 0],
      },
      { duration: 340, easing: "cubic-bezier(0.22, 0.8, 0.33, 1)" }
    );

    animRef.current = anim;
    anim.onfinish = () => {
      animRef.current = null;
      if (!opening) details.open = false;
    };
  };

  const highlights = [
    {
      lead: t("A rules and scoring engine, not a model"),
      rest: t(
        ": hard filters for allergies and dietary restrictions run first, then preference scoring, nutrition balancing and meal-slot sizing decide the rest of the week."
      ),
    },
    {
      lead: t("Cuisine and repeat rules"),
      rest: t(
        " cap how often a cuisine or a specific meal can come back around, so a four-week plan doesn't quietly turn into the same six dinners."
      ),
    },
    {
      lead: t("Stale-plan detection"),
      rest: t(
        " watches a signature built from the household's constraints. Add an allergy or a new household member and the current plan gets flagged instead of quietly staying wrong."
      ),
    },
    {
      lead: t("An offline recipe pipeline"),
      rest: t(
        " pulls recipes from the Spoonacular API, then runs them through normalization, scoring, Croatian machine translation and a translation quality pass before they reach the app."
      ),
    },
    {
      lead: t("The week ends in a grocery list"),
      rest: t(
        ", built by aggregating ingredients across every planned meal, with swaps and custom recipes folded in automatically."
      ),
    },
  ];

  return (
    <section id="mealmate" ref={sectionRef} className="mealmate">
      <div className="mealmate__container">
        <div className="mealmate__inner">

          {/* LEFT: screenshot */}
          <div className="mealmate__visual" data-reveal data-delay="0">
            <div className="mealmate__glow-under" aria-hidden="true" />
            <a
              href="/apps/mealmate/"
              className="mealmate__shot"
              target="_blank"
              rel="noopener"
              title="MealMate household meal planner"
            >
              <img
                src={mealmateMockup}
                alt="MealMate weekly household meal plan shown on a phone screen"
                className="mealmate__img"
                loading="lazy"
                decoding="async"
              />
            </a>
          </div>

          {/* RIGHT: content */}
          <div className="mealmate__content">

            <div className="mealmate__brand" data-reveal data-delay="80">
              <img
                src={mealmateLogo}
                alt="MealMate"
                className="mealmate__logo"
              />
              <span className="mealmate__eyebrow">
                {t("HOUSEHOLD-AWARE MEAL PLANNING")}
              </span>
            </div>

            <h2 className="mealmate__heading" data-reveal data-delay="140">
              MealMate
            </h2>

            <div className="mealmate__body" data-reveal data-delay="200">
              <p className="mealmate__hook">
                {t("A meal plan that actually fits everyone at the table.")}
              </p>
              <p>
                {t("I built")}{" "}
                <a
                  href="/apps/mealmate/"
                  className="mealmate__inline-link"
                  target="_blank"
                  rel="noopener"
                  title="MealMate household meal planner"
                >
                  MealMate
                </a>
                {t(
                  " for my own household: a local-first weekly meal planner that plans for everyone at the table at once, not one person at a time. It works out nutrition targets, filters out allergies and other dietary restrictions, and learns what people actually like from a quick swipe through recipes during onboarding."
                )}
              </p>
            </div>

            <p className="mealmate__callout" data-reveal data-delay="240">
              {t(
                "There's no LLM in the planning loop. The recommendation engine is a set of deterministic rules and scoring, so a dietary constraint either holds or it doesn't, every time."
              )}
            </p>

            <details
              className="mealmate__highlights"
              ref={detailsRef}
              data-expanded={expanded}
              data-reveal
              data-delay="280"
            >
              <summary
                className="mealmate__highlights-summary"
                onClick={handleToggle}
              >
                <span>{t("Under the hood")}</span>
                <svg
                  className="mealmate__highlights-chevron"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <div className="mealmate__highlights-panel" ref={panelRef}>
                <ul className="mealmate__bullets">
                  {highlights.map((item) => (
                    <li key={item.lead}>
                      <strong>{item.lead}</strong>
                      {item.rest}
                    </li>
                  ))}
                </ul>
              </div>
            </details>

            <div className="mealmate__cta" data-reveal data-delay="320">
              <a
                href="/apps/mealmate/"
                className="btn primary"
                target="_blank"
                rel="noopener"
                title="MealMate household meal planner"
              >
                {t("Try MealMate")}
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
