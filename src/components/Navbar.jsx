import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiTool, FiPlay } from "react-icons/fi";
import { isResumePath, isHomePath } from "../utils/paths";
import "../styles/Navbar.css";

import logo from "../assets/logo.webp";
import flagHr from "../assets/icons/croatia.png";
import flagUs from "../assets/icons/united-states.png";

export default function Navbar() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const currentLang = lang === "hr" ? "hr" : "en";

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = () => setTheme((p) => (p === "dark" ? "light" : "dark"));

  const toggleLang = () => {
    const targetLang = currentLang === "en" ? "hr" : "en";
    const seg = location.pathname.split("/");
    seg[1] = targetLang;
    navigate(seg.join("/") || `/${targetLang}`);
  };

  const navRef = useRef(null);

  const doScroll = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const elTop = el.getBoundingClientRect().top + window.scrollY;
    // Scrolling down hides the navbar (see the scroll listener below), so
    // there's nothing to clear space for in that direction — reserving navH
    // there just leaves a gap above the target. Scrolling up brings the
    // navbar back, so only then does it need to be accounted for.
    const scrollingUp = elTop < window.scrollY;
    const navH = scrollingUp ? navRef.current?.offsetHeight || 64 : 0;
    window.scrollTo({ top: elTop - navH, behavior: "smooth" });
  };

  const scrollToId = (id) => {
    const onResume = isResumePath(location.pathname);
    if (onResume) {
      navigate(`/${currentLang}/`, { state: { scrollTo: id } });
    } else {
      doScroll(id);
    }
  };

  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(window.scrollY > 8);
  const lastY = useRef(window.scrollY);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const d = y - lastY.current;
      if (y <= 0) setHidden(false);
      else if (d > 6) setHidden(true);
      else if (d < -6) setHidden(false);
      lastY.current = y;
      setScrolled(y > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (location.state?.scrollTo) {
      const id = location.state.scrollTo;
      setTimeout(() => doScroll(id), 60);
    } else {
      setScrolled(window.scrollY > 8);
    }
  }, [location]);

  // MOBILE MENU STATE
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => setMenuOpen(false);

  // Zatvori meni na promjenu rute
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  // Zaključaj scroll kad je meni otvoren
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("nav-drawer-open");
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("nav-drawer-open");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("nav-drawer-open");
    };
  }, [menuOpen]);

  // Helper da se na mobile kliku na link i skrola + zatvori meni
  const handleNavClickScroll = (id) => {
    scrollToId(id);
    closeMenu();
  };

  return (
    <>
      <div
        className={`navbar-hover-zone ${hidden ? "is-active" : ""}`}
        onMouseEnter={() => setHidden(false)}
      />
      <header
        ref={navRef}
        className={`navbar ${hidden ? "navbar--hidden" : ""} ${
          scrolled ? "navbar--scrolled" : ""
        } ${!isHomePath(location.pathname, currentLang) ? "navbar--no-hero" : ""}`}
      >
        <div className="navbar__inner">
          <Link className="brand" to={`/${currentLang}/`}>
            {logo ? (
              <img src={logo} alt="Logo" className="brand__logo" />
            ) : null}
            <span className="brand__name">{t("Mateo Rumac")}</span>
          </Link>

          {/* DESKTOP NAVLINKOVI */}
          <nav className="navlinks">
            <button className="navlink" onClick={() => scrollToId("about")}>
              {t("About")}
            </button>
            <button className="navlink" onClick={() => scrollToId("skills")}>
              {t("Skills")}
            </button>
            <button className="navlink" onClick={() => scrollToId("career")}>
              {t("Career")}
            </button>
            <button className="navlink" onClick={() => scrollToId("devtools")}>
              {t("Projects")}
            </button>
            <button className="navlink" onClick={() => scrollToId("contact")}>
              {t("Contact")}
            </button>
            <Link className="navlink" to={`/${currentLang}/resume/`}>
              {t("Resume")}
            </Link>
          </nav>

          {/* DESKTOP DESNA STRANA */}
          <div className="nav__right">
            <a
              className="devtools-btn"
              href="/tools/"
              target="_blank"
              rel="noopener"
              aria-label={t("Open DevTools")}
              title={t("Open DevTools")}
            >
              <FiTool aria-hidden="true" />
              <span>{t("DevTools")}</span>
            </a>

            <a
              className="devtools-btn devtools-btn--ghost"
              href="/game/"
              target="_blank"
              rel="noopener"
              aria-label={t("Play Nightfall")}
              title={t("Play Nightfall")}
            >
              <FiPlay aria-hidden="true" />
              <span>{t("Nightfall")}</span>
            </a>

            <button
              className="lang-btn"
              onClick={toggleLang}
              aria-label={t("Change language")}
              title={t("Change language")}
            >
              <img
                src={currentLang === "hr" ? flagHr : flagUs}
                alt=""
                className="lang-btn__flag"
              />
            </button>

            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? t("Switch to light mode")
                  : t("Switch to dark mode")
              }
              title={
                theme === "dark"
                  ? t("Switch to light mode")
                  : t("Switch to dark mode")
              }
              data-active-theme={theme}
            />
          </div>

          {/* HAMBURGER GUMB (MOBILE) */}
          <button
            className={`nav-toggle ${menuOpen ? "is-active" : ""}`}
            type="button"
            onClick={toggleMenu}
            aria-label={menuOpen ? t("Close menu") : t("Open menu")}
            aria-expanded={menuOpen}
          >
            <span className="nav-toggle__bar" />
            <span className="nav-toggle__bar" />
            <span className="nav-toggle__bar" />
          </button>
        </div>
      </header>

      {/* BACKDROP ZA MOBILE MENI */}
      <div
        className={`nav-drawer__backdrop ${menuOpen ? "is-active" : ""}`}
        onClick={closeMenu}
      />

      <aside className={`nav-drawer ${menuOpen ? "is-open" : ""}`}>
        <div className="nav-drawer__inner">
          <div className="nav-drawer__header">
            <span className="nav-drawer__title">{t("Navigation")}</span>
          </div>

          <div className="nav-drawer__content">
            <div className="nav-drawer__main">
              <nav className="nav-drawer__nav">
                <button
                  className="navlink nav-drawer__link"
                  onClick={() => handleNavClickScroll("about")}
                >
                  {t("About")}
                </button>
                <button
                  className="navlink nav-drawer__link"
                  onClick={() => handleNavClickScroll("skills")}
                >
                  {t("Skills")}
                </button>
                <button
                  className="navlink nav-drawer__link"
                  onClick={() => handleNavClickScroll("career")}
                >
                  {t("Career")}
                </button>
                <button
                  className="navlink nav-drawer__link"
                  onClick={() => handleNavClickScroll("devtools")}
                >
                  {t("Projects")}
                </button>
                <button
                  className="navlink nav-drawer__link"
                  onClick={() => handleNavClickScroll("contact")}
                >
                  {t("Contact")}
                </button>
                <Link
                  className="navlink nav-drawer__link"
                  to={`/${currentLang}/resume/`}
                  onClick={closeMenu}
                >
                  {t("Resume")}
                </Link>
              </nav>

              {/* Drawer only — the desktop header keeps these two as bare
                  buttons. There is room here to say what they are. */}
              <div className="nav-drawer__promo">
                <span className="nav-drawer__promo-label">
                  {t("FREE TOOLS FOR DEVELOPERS")}
                </span>
                <a
                  className="devtools-btn nav-drawer__devtools"
                  href="/tools/"
                  target="_blank"
                  rel="noopener"
                  aria-label={t("Open DevTools")}
                  title={t("Open DevTools")}
                  onClick={closeMenu}
                >
                  <FiTool aria-hidden="true" />
                  <span>{t("DevTools")}</span>
                </a>
              </div>

              <div className="nav-drawer__promo">
                <span className="nav-drawer__promo-label">
                  {t("FREE BROWSER GAME")}
                </span>
                <a
                  className="devtools-btn devtools-btn--ghost nav-drawer__devtools"
                  href="/game/"
                  target="_blank"
                  rel="noopener"
                  aria-label={t("Play Nightfall")}
                  title={t("Play Nightfall")}
                  onClick={closeMenu}
                >
                  <FiPlay aria-hidden="true" />
                  <span>{t("Nightfall")}</span>
                </a>
              </div>
            </div>

            <div className="nav-drawer__footer">
              <div className="nav-drawer__toggles">
                <button
                  className="lang-btn nav-drawer__lang"
                  onClick={() => {
                    toggleLang();
                    closeMenu();
                  }}
                  aria-label={t("Change language")}
                  title={t("Change language")}
                >
                  <img
                    src={currentLang === "hr" ? flagHr : flagUs}
                    alt=""
                    className="lang-btn__flag"
                  />
                </button>

                <button
                  className="theme-toggle nav-drawer__theme"
                  onClick={toggleTheme}
                  aria-label={
                    theme === "dark"
                      ? t("Switch to light mode")
                      : t("Switch to dark mode")
                  }
                  title={
                    theme === "dark"
                      ? t("Switch to light mode")
                      : t("Switch to dark mode")
                  }
                  data-active-theme={theme}
                />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
