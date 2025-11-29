import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaLinkedinIn } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import "../styles/Hero.css";

export default function Hero() {
  const { t } = useTranslation();

  const phrases = useMemo(
    () => [
      t('console.log("Hello!");'),
      t('document.write("You’ve arrived.");'),
      t("<p>I’m Mateo, I build cool stuff</p>"),
      t("<div>on the internet.</div>"),
      t('alert("Let’s build");'),
      t("<span>something cool</span>"),
      t("// together."),
    ],

    [t]
  );

  const [i, setI] = useState(0);
  const [txt, setTxt] = useState("");
  const [del, setDel] = useState(false);
  const [pause, setPause] = useState(false);

  useEffect(() => {
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
  }, [txt, del, pause, i, phrases]);

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
        <h1 className="hero__typed">
          <span className="hero__code">{txt}</span>
          <span className="hero__caret" aria-hidden="true">
            |
          </span>
        </h1>

        <p className="hero__subtitle">
          {t("Welcome to my portfolio site. I build cool stuff for the web.")}
        </p>

        <div className="hero__cta">
          <a href="#projects" className="btn primary">
            {t("View Projects")}
          </a>
          <a href="#contact" className="btn ghost">
            {t("Let's Talk")}
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
            href="https://www.linkedin.com/in/mateo-rumac-170a0b304/"
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
