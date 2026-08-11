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
import {
  isResumePath,
  isHomePath,
  isKnownRoute,
  pageUrl,
  hreflangEntries,
} from "./utils/paths";
import { syncJsonLd } from "./utils/jsonLd";

import HomePage from "./pages/HomePage";
import Resume from "./pages/Resume";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import CookieConsent from "./components/CookieConsent";

function syncHreflang(isResume) {
  hreflangEntries(isResume).forEach(({ hreflang, href }) => {
    const id = `hreflang-${hreflang}`;
    let link = document.getElementById(id);
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "alternate");
      link.setAttribute("hreflang", hreflang);
      link.id = id;
      document.head.appendChild(link);
    }
    link.setAttribute("href", href);
  });
}

function LangLayout() {
  const { lang } = useParams();
  const location = useLocation();
  // "/:lang" matches any single path segment (e.g. /randomthing, /xx) —
  // without this guard, those would fall through to the nested `index`
  // route and render the homepage. Anything that isn't a real locale
  // renders NotFound instead, and the effect below no-ops for it.
  const isValidLang = lang === "en" || lang === "hr";
  const currentLang = isValidLang ? lang : "en";

  // Only the homepage and /resume have real content here — anything else
  // under a valid locale (/en/whatever) renders <NotFound/> via the nested
  // "*" route below. That page owns its own title/description/OG/robots
  // and must not inherit a homepage-claiming canonical/hreflang/JSON-LD, so
  // this effect leaves the <head> alone for it entirely.
  const isResume = isResumePath(location.pathname);
  const isKnownPage = isHomePath(location.pathname, currentLang) || isResume;

  useEffect(() => {
    if (!isValidLang) return;

    i18n.changeLanguage(currentLang);
    document.documentElement.lang = currentLang;

    if (!isKnownPage) return;

    const isHr = currentLang === "hr";

    const pageTitle = isResume
      ? isHr
        ? "Mateo Rumac | Životopis"
        : "Mateo Rumac | Resume"
      : isHr
      ? "Mateo Rumac | Full-stack Developer i web aplikacije"
      : "Mateo Rumac | Full-stack Developer";

    document.title = pageTitle;

    const description = isResume
      ? isHr
        ? "Životopis Matea Rumca, full-stack developera iz Pule — iskustvo, vještine i CV za preuzimanje na hrvatskom ili engleskom jeziku."
        : "Resume of Mateo Rumac, a full-stack developer based in Pula, Croatia — experience, skills and a downloadable PDF CV in English or Croatian."
      : isHr
      ? "Portfolio full-stack developera Matea Rumca. Razvijam produkcijske web aplikacije koristeći React, Astro, PHP i REST API-je."
      : "Full-stack developer building production web applications with React, Astro, PHP and REST APIs. Explore selected professional work and independent projects.";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", description);
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

    const url = pageUrl(currentLang, isResume);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", url);
    } else {
      const newCanonical = document.createElement("link");
      newCanonical.setAttribute("rel", "canonical");
      newCanonical.setAttribute("href", url);
      document.head.appendChild(newCanonical);
    }

    syncHreflang(isResume);
    syncJsonLd(isResume, currentLang);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", pageTitle);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute("content", description);
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
    if (twitterDesc) {
      twitterDesc.setAttribute("content", description);
    }
  }, [isValidLang, isKnownPage, isResume, currentLang, location.pathname]);

  if (!isValidLang) {
    return (
      <>
        <Navbar />
        <NotFound />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/en/" replace />} />
        <Route path="/:lang" element={<LangLayout />}>
          <Route index element={<HomePage />} />
          <Route path="resume" element={<Resume />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* Nothing to consent to on a page that doesn't exist. */}
      {isKnownRoute(location.pathname) && <CookieConsent />}
    </>
  );
}
