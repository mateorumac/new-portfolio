// src/utils/paths.js
//
// Single source of truth for this site's URL convention: every HTML page
// URL is absolute, HTTPS, and ends with a trailing slash
// (https://mateorumac.com/en/, https://mateorumac.com/en/resume/, ...).
// App.jsx (live canonical/OG/hreflang tags) and any script that touches
// sitemap.xml or PDF headers must all agree on these paths.

export const SITE_URL = "https://mateorumac.com";

// True for "/en/resume", "/en/resume/", "/hr/resume///" etc. False for
// "/en", "/en/", "/en/resumeextra". Trailing-slash-agnostic so it keeps
// working regardless of how the URL was typed/loaded.
export function isResumePath(pathname) {
  return pathname.replace(/\/+$/, "").endsWith("/resume");
}

// True only for "/en", "/en/" (and the "/hr" equivalents) — the actual
// locale homepage, as opposed to /resume or an unknown path under that
// locale. Trailing-slash-agnostic like isResumePath.
export function isHomePath(pathname, lang) {
  return pathname.replace(/\/+$/, "") === `/${lang}`;
}

// True for "/en", "/en/resume" and their "/hr" equivalents — the only two
// routes that actually resolve to real content. Anything else (invalid
// locale, unknown subpath) renders <NotFound/> and returns false here.
export function isKnownRoute(pathname) {
  const segments = pathname.replace(/^\/+/, "").split("/").filter(Boolean);
  const lang = segments[0];
  if (lang !== "en" && lang !== "hr") return false;
  const rest = segments.slice(1);
  if (rest.length === 0) return true;
  return rest.length === 1 && rest[0] === "resume";
}

export function pagePath(lang, isResume) {
  return isResume ? `/${lang}/resume/` : `/${lang}/`;
}

export function pageUrl(lang, isResume) {
  return `${SITE_URL}${pagePath(lang, isResume)}`;
}

// Reciprocal hreflang set for either the homepage pair or the resume pair.
export function hreflangEntries(isResume) {
  return [
    { hreflang: "en", href: pageUrl("en", isResume) },
    { hreflang: "hr", href: pageUrl("hr", isResume) },
    { hreflang: "x-default", href: pageUrl("en", isResume) },
  ];
}
