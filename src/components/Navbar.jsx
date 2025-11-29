import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import "../styles/Navbar.css";

import logo from "../assets/logo-96.webp";

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

  const doScroll = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const navH =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--nav-height"
        )
      ) || 64;
    const top = el.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const scrollToId = (id) => {
    const onResume = location.pathname.endsWith("/resume");
    if (onResume) {
      navigate(`/${currentLang}`, { state: { scrollTo: id } });
    } else {
      doScroll(id);
    }
  };

  const [hidden, setHidden] = useState(false);
  const lastY = useRef(window.scrollY);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const d = y - lastY.current;
      if (y <= 0) setHidden(false);
      else if (d > 6) setHidden(true);
      else if (d < -6) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (location.state?.scrollTo) {
      const id = location.state.scrollTo;
      setTimeout(() => doScroll(id), 60);
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
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
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
      <header className={`navbar ${hidden ? "navbar--hidden" : ""}`}>
        <div className="navbar__inner">
          <Link className="brand" to={`/${currentLang}`}>
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
            <button className="navlink" onClick={() => scrollToId("career")}>
              {t("Career")}
            </button>
            <button className="navlink" onClick={() => scrollToId("projects")}>
              {t("Projects")}
            </button>
            <button className="navlink" onClick={() => scrollToId("contact")}>
              {t("Contact")}
            </button>
            <Link className="navlink" to={`/${currentLang}/resume`}>
              {t("Resume")}
            </Link>
          </nav>

          {/* DESKTOP DESNA STRANA */}
          <div className="nav__right">
            <button
              className="lang-btn"
              onClick={toggleLang}
              aria-label={t("Change language")}
              title={t("Change language")}
            >
              {currentLang.toUpperCase()}
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
            >
              <span className="label">
                {t(theme === "dark" ? "Dark" : "Light")}
              </span>
            </button>
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
            <nav className="nav-drawer__nav">
              <button
                className="navlink nav-drawer__link"
                onClick={() => handleNavClickScroll("about")}
              >
                {t("About")}
              </button>
              <button
                className="navlink nav-drawer__link"
                onClick={() => handleNavClickScroll("career")}
              >
                {t("Career")}
              </button>
              <button
                className="navlink nav-drawer__link"
                onClick={() => handleNavClickScroll("projects")}
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
                to={`/${currentLang}/resume`}
                onClick={closeMenu}
              >
                {t("Resume")}
              </Link>
            </nav>

            <div className="nav-drawer__footer">
              <button
                className="lang-btn nav-drawer__lang"
                onClick={() => {
                  toggleLang();
                  closeMenu();
                }}
                aria-label={t("Change language")}
                title={t("Change language")}
              >
                {currentLang.toUpperCase()}
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
            >
              <span className="theme-toggle__icon" aria-hidden="true" />
              <span className="label">
                {t(theme === "dark" ? "Dark" : "Light")}
              </span>
            </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
