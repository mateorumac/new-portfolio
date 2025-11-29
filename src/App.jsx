import { Routes, Route, Navigate, Outlet, useParams } from "react-router-dom";
import { useEffect } from "react";
import i18n from "./i18n";

import HomePage from "./pages/HomePage";
import Resume from "./pages/Resume";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";

function LangLayout() {
  const { lang } = useParams();
  const currentLang = lang === "hr" ? "hr" : "en";

  useEffect(() => {
    i18n.changeLanguage(currentLang);

    document.documentElement.lang = currentLang;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        currentLang === "hr"
          ? "Portfolio frontend developera Matea Rumca. Izrađujem brza, pristupačna i moderno dizajnirana web rješenja s naglaskom na React, UX i performanse."
          : "Portfolio of frontend developer Mateo Rumac. I build fast, accessible and thoughtfully crafted web experiences with a strong focus on React, UX and performance."
      );
    }

    const keywords = document.querySelector('meta[name="keywords"]');
    if (keywords) {
      keywords.setAttribute(
        "content",
        currentLang === "hr"
          ? "frontend developer, web developer, React developer, Pula, Hrvatska, remote, JavaScript, Vite, Next.js, dizajn sučelja, moderne web aplikacije"
          : "frontend developer, web developer, React developer, Croatia, remote, JavaScript, Vite, Next.js, UI design, modern web applications"
      );
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    const url =
      currentLang === "hr"
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

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && metaDesc) {
      ogDesc.setAttribute("content", metaDesc.content);
    }

    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) {
      ogLocale.setAttribute(
        "content",
        currentLang === "hr" ? "hr_HR" : "en_US"
      );
    }
  }, [currentLang]);

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
    </>
  );
}
