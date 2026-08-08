import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { FaLinkedinIn } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { FiDownload } from "react-icons/fi";
import "../styles/Hero.css";

export default function Hero() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang === "hr" ? "hr" : "en";
  const cvHref =
    currentLang === "hr"
      ? "/Mateo_Rumac_Full_Stack_Developer_CV_HR.pdf"
      : "/Mateo_Rumac_Full_Stack_Developer_CV.pdf";
  const cvFileName =
    currentLang === "hr"
      ? "Mateo_Rumac_Full_Stack_Developer_CV_HR.pdf"
      : "Mateo_Rumac_Full_Stack_Developer_CV.pdf";

  const phrases = useMemo(
    () => [
      t('console.log("Hello!");'),
      t("document.write(\"I'm Mateo.\");"),
      t("<p>I build websites, apps</p>"),
      t("<div>and AI automations.</div>"),
      t('alert("full-stack, end to end");'),
      t("<span>let's build something</span>"),
      t("// together."),
    ],

    [t]
  );

  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const [i, setI] = useState(0);
  const [txt, setTxt] = useState(() =>
    prefersReducedMotion ? phrases[0] || "" : ""
  );
  const [del, setDel] = useState(false);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return; // show a static first line, skip the cycle
    if (pause) {
      const p = setTimeout(() => setPause(false), 1100);
      return () => clearTimeout(p);
    }
    const current = phrases[i % phrases.length] || "";
    const nextLen = del ? txt.length - 1 : txt.length + 1;

    if (!del && nextLen === current.length) {
      setTxt(current);
      setDel(true);
      setPause(true);
      return;
    }
    if (del && nextLen < 0) {
      setDel(false);
      setI((n) => (n + 1) % phrases.length);
      return;
    }
    const to = setTimeout(
      () => setTxt(current.slice(0, nextLen)),
      del ? 28 : 55
    );
    return () => clearTimeout(to);
  }, [txt, del, pause, i, phrases, prefersReducedMotion]);

  const railRef = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
      if (railRef.current) railRef.current.style.setProperty("--p", String(p));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in"); // fire slide-up + bar + icons
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="hero" className="hero" aria-label={t("Hero")}>
      <div className="hero__bg" aria-hidden="true">
        <span className="glow glow--right" />
        <span className="flow" />
        <span className="orb orb--mint" />
        <span className="orb orb--blue" />
        <span className="grid" />
      </div>

      <div className="hero__card">
        <span className="hero__dash" />
        <h1 className="hero__headline visually-hidden">
          {t(
            "Full-stack developer building production web applications."
          )}
        </h1>
        <div className="hero__typed" aria-hidden="true">
          <span className="hero__code">{txt}</span>
          <span className="hero__caret" aria-hidden="true">
            |
          </span>
        </div>

        <p className="hero__subtitle">
          {t(
            "I build modern React and Astro interfaces, PHP APIs, booking systems, Stripe integrations and internal tools, from user experience to production deployment."
          )}
        </p>

        <div className="hero__cta">
          <a href="#devtools" className="btn primary">
            {t("View projects")}
          </a>
          <a
            href={cvHref}
            download={cvFileName}
            className="btn ghost"
          >
            <FiDownload aria-hidden="true" />
            {t("Download CV")}
          </a>
        </div>
      </div>

      <a href="#about" className="hero__cue" aria-label={t("Scroll")} />

      <aside
        className="social-rail"
        ref={railRef}
        aria-label={t("Social links")}
      >
        <div className="social-rail__icons">
          <a
            className="social-rail__btn"
            href="https://www.linkedin.com/in/mateo-rumac/"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <FaLinkedinIn />
          </a>
          <a
            className="social-rail__btn"
            href="mailto:mateo.rumac@gmail.com"
            aria-label="Email"
            title="Email"
          >
            <MdOutlineMail />
          </a>
        </div>
        <span className="social-rail__bar" />
      </aside>
    </section>
  );
}
