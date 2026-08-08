// src/pages/Resume.jsx
//
// THESIS: a resume that reads as a real page in this site's own grammar, not
// an embedded document — a full-width masthead and single-column sections
// carry the content instead of a cramped sidebar or a generic template.
// OWN-WORLD: existing dark/light theme tokens, mint/blue/purple accents,
// system sans, tag pills, [data-reveal] fade-up, minimal hairlines.
// STORY: a recruiter reads the masthead, then Summary, Experience,
// Independent Projects, Skills and Education & Languages in one flow.
// FORM: full-width header + single-column sections, revised after a first
// pass cramped the header into a narrow sidebar and dropped real CV content
// (Independent Projects, Languages, full contact details).
// Content below is transcribed from the actual CV PDFs (public/*.pdf), not
// invented or reworded.
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import { FiCode, FiDownload, FiPlay, FiServer, FiTool } from "react-icons/fi";
import { FaLinkedinIn } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { SKILL_GROUPS } from "../data/skillsData";
import "../styles/Resume.css";

export default function Resume() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang === "hr" ? "hr" : "en";
  const groupIcons = {
    frontend: FiCode,
    backend: FiServer,
    tools: FiTool,
  };

  const pdfUrl =
    currentLang === "hr"
      ? "/Mateo_Rumac_Full_Stack_Developer_CV_HR.pdf"
      : "/Mateo_Rumac_Full_Stack_Developer_CV.pdf";
  const fileName =
    currentLang === "hr"
      ? "Mateo_Rumac_Full_Stack_Developer_CV_HR.pdf"
      : "Mateo_Rumac_Full_Stack_Developer_CV.pdf";

  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    root.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main className="resume-page" ref={rootRef}>
      <div className="resume-page__container">
        <header className="resume-page__masthead" data-reveal="fade-up">
          <h1 className="resume-page__name">{t("Mateo Rumac")}</h1>
          <p className="resume-page__title">{t("Full-stack Developer")}</p>

          <div className="resume-page__meta-row">
            <ul className="resume-page__meta">
              <li>{t("Pula, Croatia")}</li>
              <li>
                <a href="mailto:mateo.rumac@gmail.com">
                  mateo.rumac@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/mateo-rumac/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  LinkedIn
                </a>
              </li>
            </ul>

            <a
              href={pdfUrl}
              download={fileName}
              className="btn primary resume-page__download"
            >
              <FiDownload aria-hidden="true" />
              {t("Download PDF")}
            </a>
          </div>
        </header>

        <div className="resume-page__content">
          <section
            className="resume-page__block"
            data-reveal="fade-up"
            data-delay="60"
          >
            <h2 className="resume-page__section-title">
              {t("Professional Summary")}
            </h2>
            <p className="resume-page__summary">
              {t(
                "Full-stack developer with hands-on experience delivering production web applications using React, Astro, Vite, PHP, MySQL and REST APIs. Strongest in frontend development, with practical experience across booking workflows, Stripe payments, analytics dashboards, role-based tools, multilingual interfaces and production deployment. Comfortable owning work from UI implementation and API integration through release and maintenance."
              )}
            </p>
          </section>

          <section
            className="resume-page__block resume-page__block--divided"
            data-reveal="fade-up"
            data-delay="110"
          >
            <h2 className="resume-page__section-title">
              {t("Professional Experience")}
            </h2>
            <article className="resume-page__row">
              <div className="resume-page__row-head">
                <div>
                  <h3>{t("Full-stack Web Developer")}</h3>
                  <p className="resume-page__row-sub">
                    {t("D&A Smart Solutions - Zagreb, Croatia")}
                  </p>
                </div>
                <span className="resume-page__pill">
                  {t("Nov 2024 - Present")}
                </span>
              </div>
              <ul className="resume-page__bullets">
                <li>
                  {t(
                    "Develop and deploy responsive production websites and web applications using React, Astro, Vite, JavaScript and PHP."
                  )}
                </li>
                <li>
                  {t(
                    "Build custom PHP endpoints and integrate REST APIs for availability, pricing, reservation and property-management workflows."
                  )}
                </li>
                <li>
                  {t(
                    "Implement Stripe payment flows with 3D Secure and manual capture, including validation and production troubleshooting."
                  )}
                </li>
                <li>
                  {t(
                    "Create role-based admin and property-owner dashboards, plus Chart.js visualizations for revenue, occupancy and OTA-channel KPIs."
                  )}
                </li>
                <li>
                  {t(
                    "Deliver multilingual, mobile-first interfaces with technical SEO, accessibility considerations and GDPR-aware cookie consent."
                  )}
                </li>
                <li>
                  {t(
                    "Manage releases through Bitbucket, SSH, Composer and cPanel; use Postman for API testing, debugging and verification."
                  )}
                </li>
              </ul>
            </article>
          </section>

          <section
            className="resume-page__block resume-page__block--divided"
            data-reveal="fade-up"
            data-delay="160"
          >
            <h2 className="resume-page__section-title">
              {t("Selected Independent Projects")}
            </h2>
            <div className="resume-page__projects">
              <a
                className="resume-page__project"
                href="/tools/"
                target="_blank"
                rel="noopener"
              >
                <div className="resume-page__row-head">
                  <div>
                    <h3>DevTools</h3>
                    <p className="resume-page__row-sub">
                      {t("Privacy-first browser toolkit")}
                    </p>
                  </div>
                </div>
                <p className="resume-page__pill resume-page__pill--stack">
                  JavaScript, Canvas, File and Blob APIs
                </p>
                <p className="resume-page__row-lead">
                  {t(
                    "Created nine practical tools for image conversion, favicon and Open Graph generation, contrast checking, launch auditing and related workflows. Processing stays locally in the browser with no file uploads."
                  )}
                </p>
                <span className="resume-page__project-link">
                  <FiTool aria-hidden="true" />
                  {t("Open DevTools")}
                </span>
              </a>

              <a
                className="resume-page__project"
                href="/game/"
                target="_blank"
                rel="noopener"
              >
                <div className="resume-page__row-head">
                  <div>
                    <h3>Nightfall</h3>
                    <p className="resume-page__row-sub">
                      {t("Browser arcade flight game")}
                    </p>
                  </div>
                </div>
                <p className="resume-page__pill resume-page__pill--stack">
                  Three.js, JavaScript, WebGL
                </p>
                <p className="resume-page__row-lead">
                  {t(
                    "Built independently without a game engine, featuring endlessly streamed procedural terrain, terrain-aware collision, PBR/bloom rendering, audio transitions, keyboard and touch controls, and reduced-motion support."
                  )}
                </p>
                <span className="resume-page__project-link">
                  <FiPlay aria-hidden="true" />
                  {t("Play Nightfall")}
                </span>
              </a>
            </div>
          </section>

          <section
            className="resume-page__block"
            data-reveal="fade-up"
            data-delay="210"
          >
            <h2 className="resume-page__section-title">
              {t("Technical Skills")}
            </h2>
            <div className="resume-page__skills">
              {SKILL_GROUPS.map((group) => (
                <div
                  key={group.key}
                  className="resume-page__skill-row"
                  data-accent={group.key}
                >
                  <div className="resume-page__skill-label">
                    {(() => {
                      const Icon = groupIcons[group.key];
                      return Icon ? (
                        <span className="resume-page__skill-icon" aria-hidden="true">
                          <Icon />
                        </span>
                      ) : null;
                    })()}
                    <h3>{t(group.label)}</h3>
                  </div>
                  <ul className="resume-page__skill-tags">
                    {group.items.map((item) => (
                      <li key={item}>{t(item)}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section
            className="resume-page__block"
            data-reveal="fade-up"
            data-delay="260"
          >
            <h2 className="resume-page__section-title">
              {t("Education & Languages")}
            </h2>
            <article className="resume-page__row">
              <div className="resume-page__row-head">
                <div>
                  <h3>{t("B.Sc. in Informatics")}</h3>
                  <p className="resume-page__row-sub">
                    {t(
                      "Juraj Dobrila University of Pula, Faculty of Informatics"
                    )}
                  </p>
                </div>
                <span className="resume-page__pill">{t("2019 - 2024")}</span>
              </div>
              <p className="resume-page__thesis">
                {t("Thesis:")}{" "}
                <a
                  href="https://repozitorij.unipu.hr/islandora/object/unipu%3A9707"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <em>
                    {t("Artificial Intelligence and Frontend Web Development")}
                  </em>{" "}
                  ({t("2024")}).
                </a>
              </p>
              <p className="resume-page__row-lead resume-page__languages">
                <strong>{t("Languages:")}</strong>{" "}
                {t("Croatian (native), English (C1), German (B1)")}
              </p>
            </article>
          </section>
        </div>
      </div>

      <footer className="resume-page__footer" data-reveal="fade-up">
        <div className="resume-page__footer-inner">
          <h2 className="resume-page__footer-title">
            {t("Let’s connect and explore future opportunities together")}
          </h2>

          <div className="resume-page__social">
            <a
              className="resume-page__social-btn"
              href="https://www.linkedin.com/in/mateo-rumac/"
              target="_blank"
              rel="noreferrer noopener"
            >
              <FaLinkedinIn aria-hidden="true" />
              {t("LinkedIn")}
            </a>
            <a
              className="resume-page__social-btn"
              href="mailto:mateo.rumac@gmail.com"
            >
              <MdOutlineMail aria-hidden="true" />
              {t("Email")}
            </a>
          </div>

          <small className="resume-page__footer-bottom">
            © {new Date().getFullYear()} MATEO RUMAC ·{" "}
            {t("All rights reserved")}
          </small>
        </div>
      </footer>
    </main>
  );
}
