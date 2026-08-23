import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/Nightfall.css";
import nightfallLaptop from "../assets/projects/nightfall-laptop.webp";
import nightfallMobile from "../assets/projects/nightfall-mobile.webp";
import nightfallLogo from "../assets/projects/nightfall-logo.webp";

export default function Nightfall() {
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

  /**
   * <details> has no native open/close transition — the browser just swaps the
   * content in. So we drive it ourselves: keep the element open for the whole
   * collapse and animate a wrapper's height, only flipping `open` to false once
   * the animation has finished.
   */
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
      lead: t("Infinite procedural terrain"),
      rest: t(
        ": ridged-multifractal noise, domain warping, and slope-based erosion, streamed in incrementally so regenerating the world never causes a frame hitch."
      ),
    },
    {
      lead: t("Physically-informed collision"),
      rest: t(
        " that samples the jet's actual footprint (nose, tail, wingtips) against the mesh, deliberately forgiving so near-misses don't feel cheap."
      ),
    },
    {
      lead: t("Hand-tuned PBR/bloom pipeline"),
      rest: t(
        ": custom sun sprite, slope+elevation texture blending, thresholds balanced so emissive rings glow without blowing out the jet."
      ),
    },
    {
      lead: t("Procedural ring course"),
      rest: t(
        " with flyability rules (no impossible back-to-back turns) that still surprises."
      ),
    },
    {
      lead: t("Full audio engine"),
      rest: t(
        " with crossfading music and crash/pause ducking, plus prefers-reduced-motion, touch controls, and a cinematic autopilot intro."
      ),
    },
  ];

  return (
    <section id="nightfall" ref={sectionRef} className="nightfall">
      <div className="nightfall__container">
        <div className="nightfall__inner">

          {/* LEFT: content — MealMate now sits directly above this section
              with its screenshot on the left, so this one flips sides to
              keep the two from reading as the same layout back to back. */}
          <div className="nightfall__content">

            <div className="nightfall__brand" data-reveal data-delay="0">
              <img
                src={nightfallLogo}
                alt="Nightfall"
                className="nightfall__logo"
              />
              <span className="nightfall__eyebrow">
                {t("BROWSER GAME")}
              </span>
            </div>

            <h2 className="nightfall__heading" data-reveal data-delay="80">
              Nightfall
            </h2>

            <div className="nightfall__body" data-reveal data-delay="140">
              <p>
                {t(
                  "A fast, browser-based arcade flight game built solo with Three.js and vanilla JavaScript, no game engine or framework. You pilot a jet through an endless procedurally-generated landscape at dusk, threading glowing rings for combo multipliers while dodging hazards and terrain. Every mountain range is generated in real time from layered noise and erosion and streamed in without stalling the frame, and it runs smoothly on both desktop and mobile."
                )}
              </p>
            </div>

            <details
              className="nightfall__highlights"
              ref={detailsRef}
              data-expanded={expanded}
              data-reveal
              data-delay="200"
            >
              <summary
                className="nightfall__highlights-summary"
                onClick={handleToggle}
              >
                <span>{t("Under the hood")}</span>
                <svg
                  className="nightfall__highlights-chevron"
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
              {/* Wrapper exists purely to be the animated box: overflow:hidden
                  clips the list as it grows and stops the list's margins from
                  collapsing out of the measured height. */}
              <div className="nightfall__highlights-panel" ref={panelRef}>
                <ul className="nightfall__bullets">
                  {highlights.map((item) => (
                    <li key={item.lead}>
                      <strong>{item.lead}</strong>
                      {item.rest}
                    </li>
                  ))}
                </ul>
              </div>
            </details>

            <div className="nightfall__cta" data-reveal data-delay="260">
              <a
                href="/game/"
                className="btn primary"
                target="_blank"
                rel="noopener"
                title="Nightfall arcade flight game"
              >
                {t("Play Nightfall")}
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

          {/* RIGHT: device mockups — laptop with the phone layered over its
              bottom-right corner */}
          <div className="nightfall__visual" data-reveal data-delay="300">
            <div className="nightfall__glow-under" aria-hidden="true" />
            <a
              href="/game/"
              className="nightfall__devices"
              target="_blank"
              rel="noopener"
              title="Nightfall arcade flight game"
            >
              <img
                src={nightfallLaptop}
                alt="Nightfall arcade flight game running in a desktop browser"
                className="nightfall__laptop"
                width="888"
                height="527"
                loading="lazy"
                decoding="async"
              />
              {/* Same title screen as the laptop, so it adds nothing for a
                  screen reader — decorative here. */}
              <img
                src={nightfallMobile}
                alt=""
                aria-hidden="true"
                className="nightfall__phone"
                width="362"
                height="642"
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
