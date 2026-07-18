import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "../styles/TimelineExperience.css";

export default function TimelineExperience() {
  const { t } = useTranslation();

  const sectionRef = useRef(null);
  const tlRef = useRef(null);
  const railRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const tl = tlRef.current;
    const rail = railRef.current;
    const progress = progressRef.current;
    if (!section || !tl || !rail || !progress) return;

    const items = Array.from(tl.querySelectorAll(".tl__item"));
    const dots = items
      .map((li) => li.querySelector(".tl__dot"))
      .filter(Boolean);

    let hasStartedProgress = false;
    let trackRaf = null;
    let hoverEndTime = 0;

    const getRailMetrics = () => {
      if (!dots.length) return null;
      const wrapTop = tl.getBoundingClientRect().top + window.scrollY;
      const firstRect = dots[0].getBoundingClientRect();
      const lastRect = dots[dots.length - 1].getBoundingClientRect();
      const firstCenter =
        firstRect.top + window.scrollY - wrapTop + firstRect.height / 2;
      const lastCenter =
        lastRect.top + window.scrollY - wrapTop + lastRect.height / 2;
      return {
        railTop: firstCenter,
        railHeight: Math.max(0, lastCenter - firstCenter),
      };
    };

    const layoutRail = () => {
      const m = getRailMetrics();
      if (!m) return;
      rail.style.top = `${m.railTop}px`;
      rail.style.height = `${m.railHeight}px`;
      progress.style.top = `${m.railTop}px`;
      if (hasStartedProgress) {
        progress.style.height = `${m.railHeight}px`;
      } else {
        progress.style.height = "0px";
      }
    };

    const trackLoop = () => {
      layoutRail();
      if (performance.now() < hoverEndTime) {
        trackRaf = requestAnimationFrame(trackLoop);
      } else {
        trackRaf = null;
        layoutRail();
      }
    };

    const startTracking = () => {
      hoverEndTime = performance.now() + 1100;
      if (!trackRaf) trackRaf = requestAnimationFrame(trackLoop);
    };

    const stopTracking = () => {
      hoverEndTime = performance.now() + 1100;
    };

    const cards = Array.from(tl.querySelectorAll(".tl__card"));
    cards.forEach((card) => {
      card.addEventListener("mouseenter", startTracking);
      card.addEventListener("mouseleave", stopTracking);
      card.addEventListener("focusin", startTracking);
      card.addEventListener("focusout", stopTracking);
    });

    const startProgressIfReady = () => {
      if (hasStartedProgress) return;
      const secondItem = items[1];
      if (!secondItem?.classList.contains("is-visible")) return;

      hasStartedProgress = true;
      const m = getRailMetrics();
      if (!m) return;

      const target = m.railHeight;
      const start = performance.now();
      const duration = 550;
      const easeOut = (t) => 1 - Math.pow(1 - t, 3);

      const animateIn = (now) => {
        const t = Math.min((now - start) / duration, 1);
        progress.style.height = `${target * easeOut(t)}px`;
        if (t < 1) requestAnimationFrame(animateIn);
      };
      requestAnimationFrame(animateIn);
    };

    const onScroll = () => {
      const vh = window.innerHeight || 800;

      items.forEach((li) => {
        const r = li.getBoundingClientRect();
        if (r.top < vh * 0.8) li.classList.add("is-visible");
      });

      if (items[0]?.classList.contains("is-visible")) {
        tl.classList.add("tl--active");
      }

      layoutRail();
      startProgressIfReady();
    };

    const onResize = () => {
      layoutRail();
      startProgressIfReady();
    };

    const ro = new ResizeObserver(() => {
      layoutRail();
      startProgressIfReady();
    });
    ro.observe(tl);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );
    io.observe(section);

    requestAnimationFrame(() => {
      layoutRail();
      onScroll();
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (trackRaf) cancelAnimationFrame(trackRaf);
      cards.forEach((card) => {
        card.removeEventListener("mouseenter", startTracking);
        card.removeEventListener("mouseleave", stopTracking);
        card.removeEventListener("focusin", startTracking);
        card.removeEventListener("focusout", stopTracking);
      });
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <section id="career" ref={sectionRef} className="tl" data-reveal="fade-up">
      <div className="tl__container">
        <h2 className="tl__title">{t("CAREER")}</h2>
        <p className="tl__subtitle">
          {t(
            "My academic background and professional journey in web development."
          )}
        </p>

        <div className="tl__wrap" ref={tlRef}>
          <div className="tl__rail" ref={railRef} aria-hidden="true" />
          <div className="tl__progress" ref={progressRef} aria-hidden="true" />

          <ol className="tl__list" role="list">
            <li className="tl__item">
              <div className="tl__railSlot" aria-hidden="true">
                <div className="tl__dot" />
              </div>

              <div className="tl__card" tabIndex="0">
                <header className="tl__head">
                  <div className="tl__headLeft">
                    <span className="tl__icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="M3 8l9-4 9 4-9 4-9-4zM6 10v5a9 9 0 0 0 12 0v-5" />
                      </svg>
                    </span>
                    <h3 className="tl__role">
                      {t("BSc Informatics — Juraj Dobrila University of Pula")}
                    </h3>
                  </div>
                  <span className="tl__pill">
                    {t("Completed 3 years • Thesis published")}
                  </span>
                </header>

                <p className="tl__lead">
                  {t(
                    "Faculty of Informatics. Learned the fundamentals of web development and programming here, from clean code structure to actually solving problems instead of just memorizing theory."
                  )}
                </p>

                <div className="tl__more">
                  <p className="tl__desc">
                    {t("Thesis:")}{" "}
                    <a
                      className="tl__link"
                      href="https://repozitorij.unipu.hr/islandora/object/unipu%3A9707"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <em>
                        {t(
                          "Artificial Intelligence and Frontend Web Development"
                        )}
                      </em>{" "}
                      ({t("2024")}).{" "}
                    </a>
                  </p>
                  <ul className="tl__tags">
                    <li>HTML</li>
                    <li>CSS</li>
                    <li>JavaScript</li>
                    <li>Vue</li>
                    <li>Git</li>
                  </ul>
                </div>
              </div>
            </li>

            <li className="tl__item">
              <div className="tl__railSlot" aria-hidden="true">
                <div className="tl__dot" />
              </div>

              <div className="tl__card" tabIndex="0">
                <header className="tl__head">
                  <div className="tl__headLeft">
                    <span className="tl__icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="M3 7h18v11H3zM8 7V5h8v2" />
                      </svg>
                    </span>
                    <h3 className="tl__role">
                      {t("Full-Stack Web Developer — D&A Smart Solutions")}
                    </h3>
                  </div>
                  <span className="tl__pill">{t("Nov 2024 – Present")}</span>
                </header>

                <p className="tl__lead">
                  {t(
                    "I design, build, and deploy our web applications, with an emphasis on accessible, multilingual UI/UX that actually holds up for real users."
                  )}
                </p>

                <div className="tl__more">
                  <ul className="tl__bullets">
                    <li>
                      {t(
                        "Custom frontends in React, Vite, and Astro, optimized for speed and technical SEO."
                      )}
                    </li>
                    <li>
                      {t(
                        "PHP backends with custom APIs, dynamic reservation logic, and Stripe integrations supporting 3D Secure and manual capture."
                      )}
                    </li>
                    <li>
                      {t(
                        "Deployments through cPanel and Bitbucket, with SSH for server tasks like Composer and dependency updates, and Postman for API testing."
                      )}
                    </li>
                    <li>
                      {t(
                        "Interactive Chart.js dashboards for real-time KPIs like occupancy, revenue, and OTA channels."
                      )}
                    </li>
                    <li>
                      {t(
                        "An internal admin dashboard that automates daily check-outs and next-day arrivals, cutting manual errors and saving the team time."
                      )}
                    </li>
                    <li>
                      {t(
                        "Brand visuals, presentations, and social content, plus analytics tracking and GDPR-compliant cookie consent."
                      )}
                    </li>
                  </ul>
                  <ul className="tl__tags">
                    <li>React</li>
                    <li>Astro</li>
                    <li>Vite</li>
                    <li>PHP</li>
                    <li>Stripe</li>
                    <li>Chart.js</li>
                    <li>Bitbucket</li>
                    <li>cPanel</li>
                  </ul>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
