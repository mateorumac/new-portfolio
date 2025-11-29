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

    const layoutRail = () => {
      if (!dots.length) return;

      const wrapTop = tl.getBoundingClientRect().top + window.scrollY;
      const firstRect = dots[0].getBoundingClientRect();
      const lastRect = dots[dots.length - 1].getBoundingClientRect();

      const firstCenter =
        firstRect.top + window.scrollY - wrapTop + firstRect.height / 2;
      const lastCenter =
        lastRect.top + window.scrollY - wrapTop + lastRect.height / 2;

      const railTop = firstCenter;
      const railHeight = Math.max(0, lastCenter - firstCenter);

      rail.style.top = `${railTop}px`;
      rail.style.height = `${railHeight}px`;
      progress.style.top = `${railTop}px`;

      if (hasStartedProgress) {
        progress.style.height = `${railHeight}px`;
      } else {
        progress.style.height = "0px";
      }
    };

    const startProgressIfReady = () => {
      if (hasStartedProgress) return;
      const secondItem = items[1];
      if (!secondItem) return;

      if (secondItem.classList.contains("is-visible")) {
        const railH = rail.offsetHeight || 0;
        progress.style.height = `${railH}px`;
        hasStartedProgress = true;
      }
    };

    const onScroll = () => {
      const vh = window.innerHeight || 800;

      items.forEach((li) => {
        const r = li.getBoundingClientRect();
        if (r.top < vh * 0.8) {
          li.classList.add("is-visible");
        }
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
                    "Faculty of Informatics. Foundations of web development and programming principles with focus on clean structure and problem-solving."
                  )}
                </p>

                <div className="tl__more">
                  <p className="tl__desc">
                    {t("Thesis:")}{" "}
                    <a
                      className="tl__link"
                      href="https://repozitorij.unipu.hr/islandora/object/unipu%3A9707"
                      target="_blank"
                      rel="noreferrer"
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
                    "End-to-end design, development and deployment of high-performance, responsive web applications with a strong focus on modern UI/UX, accessibility and multilingual experiences."
                  )}
                </p>

                <div className="tl__more">
                  <ul className="tl__bullets">
                    <li>
                      {t(
                        "Custom React, Vite and Next.js frontends with fast, frictionless UX and technical SEO."
                      )}
                    </li>
                    <li>
                      {t(
                        "Robust PHP backends with scalable custom APIs, dynamic reservation logic and Stripe integrations with 3D Secure and manual capture."
                      )}
                    </li>
                    <li>
                      {t(
                        "DevOps flow with cPanel deployments, Bitbucket Git repos and SSH for server tasks (Composer, Stripe and dependencies). Testing with Postman."
                      )}
                    </li>
                    <li>
                      {t(
                        "Interactive dashboards in Chart.js visualizing real-time KPIs like occupancy, revenue and OTA channels."
                      )}
                    </li>
                    <li>
                      {t(
                        "Internal Admin Dashboard that automates daily check-out and next-day arrivals, removing manual errors and saving operational time."
                      )}
                    </li>
                    <li>
                      {t(
                        "Brand visuals, presentations and social content, plus analytics tracking and GDPR compliance with cookie consent systems."
                      )}
                    </li>
                  </ul>
                  <ul className="tl__tags">
                    <li>React</li>
                    <li>Next.js</li>
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
