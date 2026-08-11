// src/utils/jsonLd.js
//
// Swaps the page's JSON-LD (script#ld-json-main, defined once in
// index.html) between the homepage's full graph and a focused
// ProfilePage+Person schema for /resume, per the requirement that resume
// pages get their own schema instead of duplicating the whole homepage
// graph. The homepage graph itself is never duplicated here — it's read
// once from the DOM (where index.html/prerendering put it) and restored
// verbatim when navigating back to a locale homepage.
import { SITE_URL, pageUrl } from "./paths";

let cachedHomeJsonLd = null;

function buildResumeJsonLd(lang) {
  const isHr = lang === "hr";
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${pageUrl(lang, true)}#profilepage`,
    url: pageUrl(lang, true),
    inLanguage: lang,
    name: isHr ? "Mateo Rumac | Životopis" : "Mateo Rumac | Resume",
    mainEntity: {
      "@type": "Person",
      "@id": `${SITE_URL}#person`,
      name: "Mateo Rumac",
      url: `${SITE_URL}/`,
      jobTitle: "Full-stack Developer",
      email: "mateo.rumac@gmail.com",
      image: `${SITE_URL}/og-image.png`,
      sameAs: ["https://www.linkedin.com/in/mateo-rumac/"],
      address: {
        "@type": "PostalAddress",
        addressCountry: "Croatia",
        addressLocality: "Pula",
      },
    },
  };
}

export function syncJsonLd(isResume, lang) {
  const script = document.getElementById("ld-json-main");
  if (!script) return;

  if (cachedHomeJsonLd === null) {
    cachedHomeJsonLd = script.textContent;
  }

  if (isResume) {
    script.textContent = JSON.stringify(buildResumeJsonLd(lang), null, 2);
  } else if (script.textContent !== cachedHomeJsonLd) {
    script.textContent = cachedHomeJsonLd;
  }
}
