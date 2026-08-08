import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import i18n from "./i18n";

import HomePage from "./pages/HomePage";
import Resume from "./pages/Resume";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import CookieConsent from "./components/CookieConsent";

function LangLayout() {
  const { lang } = useParams();
  const location = useLocation();
  const currentLang = lang === "hr" ? "hr" : "en";

  useEffect(() => {
    i18n.changeLanguage(currentLang);

    document.documentElement.lang = currentLang;

    const isHr = currentLang === "hr";
    const isResume = location.pathname.endsWith("/resume");

    const pageTitle = isResume
      ? isHr
        ? "Mateo Rumac | Životopis"
        : "Mateo Rumac | Resume"
      : isHr
      ? "Mateo Rumac | Full-stack Developer i web aplikacije"
      : "Mateo Rumac | Full-stack Developer";

    document.title = pageTitle;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        isHr
          ? "Portfolio full-stack developera Matea Rumca. Razvijam produkcijske web aplikacije koristeći React, Astro, PHP i REST API-je."
          : "Full-stack developer building production web applications with React, Astro, PHP and REST APIs. Explore selected professional work and independent projects."
      );
    }

    const keywords = document.querySelector('meta[name="keywords"]');
    if (keywords) {
      keywords.setAttribute(
        "content",
        isHr
          ? "full-stack developer, frontend developer, web developer, React developer, PHP developer, Pula, Hrvatska, remote, JavaScript, Astro, REST API, moderne web aplikacije"
          : "full-stack developer, frontend developer, web developer, React developer, PHP developer, Croatia, remote, JavaScript, Astro, REST APIs, modern web applications"
      );
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    const url = isHr
      ? "https://mateorumac.com/hr"
      : "https://mateorumac.com/en";

    if (canonical) {
      canonical.setAttribute("href", url);
    } else {
      const newCanonical = document.createElement("link");
      newCanonical.setAttribute("rel", "canonical");
      newCanonical.setAttribute("href", url);
      document.head.appendChild(newCanonical);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", pageTitle);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && metaDesc) {
      ogDesc.setAttribute("content", metaDesc.content);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute("content", url);
    }

    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) {
      ogLocale.setAttribute("content", isHr ? "hr_HR" : "en_US");
    }

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute("content", pageTitle);
    }

    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc && metaDesc) {
      twitterDesc.setAttribute("content", metaDesc.content);
    }
  }, [currentLang, location.pathname]);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/en" replace />} />
        <Route path="/:lang" element={<LangLayout />}>
          <Route index element={<HomePage />} />
          <Route path="resume" element={<Resume />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CookieConsent />
    </>
  );
}
