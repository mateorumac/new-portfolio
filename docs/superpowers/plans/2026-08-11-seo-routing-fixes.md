# SEO/Routing/Redirect Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every canonical/OG/hreflang/JSON-LD/sitemap URL on the four real pages (`/en/`, `/hr/`, `/en/resume/`, `/hr/resume/`) match the trailing-slash convention, make resume pages carry their own metadata instead of the homepage's, remove the client-side `/` → `/en` JS redirect, fix the client router bug that renders the homepage for any unknown single-segment path, and make unknown URLs return a genuine HTTP 404 — all without touching `/tools/` or `/game/`, which are separate deployments this repo does not contain.

**Architecture:** React 19 + Vite SPA (`react-router-dom`), i18n via `react-i18next`, prerendered at build time by `scripts/prerender.js` (boots the built SPA in headless Chrome for each of the 4 routes and freezes the resulting DOM as static `dist/<route>/index.html`). Hosting is **Cloudflare Pages** (confirmed via live response headers: `Server: cloudflare`, automatic 308 slash-normalization on directory index files, no `X-Vercel-*` headers, no `vercel.json`/`_redirects`/`_headers` in the repo). Cloudflare Pages' documented behavior: if no top-level `404.html` exists in the build output, it silently serves `index.html` (200) for any unmatched path — this, combined with a React Router bug where the `:lang` param matches *any* single path segment, is why unknown URLs currently return the homepage with `200`. Fixes are a mix of in-repo React/build changes and two new Cloudflare Pages convention files (`_redirects`, `_headers`) placed in `public/` (copied verbatim into `dist/` by Vite).

**Tech Stack:** React 19, react-router-dom v7, react-i18next, Vite 7, Puppeteer (prerender), Cloudflare Pages.

## Global Constraints

- Trailing-slash convention for every HTML page URL: `https://mateorumac.com/en/`, `/hr/`, `/en/resume/`, `/hr/resume/`. All canonical, OG, hreflang, sitemap, internal-link and JSON-LD URLs must use these exact forms.
- Never modify anything under `/tools/` or `/game/` — those are separate projects/deployments not present in this repo. No new redirect/rewrite/header rule may match `/tools*` or `/game*`.
- No JavaScript redirects for `/` → `/en/`. It must be a server-level (Cloudflare Pages `_redirects`) redirect.
- The `www.mateorumac.com` → `mateorumac.com` redirect is a Cloudflare zone-level concern (Cloudflare's own docs recommend Bulk Redirects / Redirect Rules at the dashboard level, not a Pages `_redirects` entry) — this plan does **not** implement it in code; it is reported as a required dashboard action.
- No redirect chains: every fix must resolve in a single hop.
- No unrelated design/content/animation changes.
- `public/` is Vite's `publicDir` — files placed there are copied verbatim to `dist/` root at build time, which is where Cloudflare Pages reads `_redirects`, `_headers` and `404.html` from.

---

## Confirmed root causes (verified against source + live `mateorumac.com` + local build)

1. **Resume pages canonicalize to the locale homepage.** `src/App.jsx`'s `LangLayout` effect computes `url = isHr ? ".../hr" : ".../en"` unconditionally — it never appends `/resume`, and never adds a trailing slash. Confirmed live: `curl https://mateorumac.com/en/resume/` returns `<link rel="canonical" href="https://mateorumac.com/en">`.
2. **Resume pages copy the homepage's meta/OG/Twitter description.** The same effect sets `metaDesc` content branching only on `isHr`, never on `isResume`. Confirmed live: `/en/resume/`'s `og:description` is word-for-word the homepage's.
3. **No hreflang tags exist anywhere.** Confirmed: none present in any served page's `<head>`.
4. **No server-level redirect config exists in the repo at all** (no `vercel.json`, no `_redirects`, no `_headers`, no `.htaccess`). The site is served by Cloudflare Pages (confirmed via response headers). `/` currently serves the homepage directly at `200` (no redirect to `/en/`); the only "redirect" to `/en` is the client-side `<Navigate to="/en" replace />` in `App.jsx`, i.e. a JS redirect.
5. **Unknown URLs return the homepage with `200`, for two independent reasons, both confirmed:**
   - a) **Client router bug:** `<Route path="/:lang">` matches *any* single path segment as a language. Verified with a local headless-browser check: `https://mateorumac.com/randomthing` and `/xx` render the full homepage (title, `<h1>`, canonical all homepage) because React Router treats `randomthing`/`xx` as `:lang` and falls through to the nested `index` route.
   - b) **No `404.html` in the build output.** Cloudflare Pages' documented default: absent a top-level `404.html`, it assumes an SPA and serves `index.html` with `200` for any unmatched path. This is what makes deeper unknown paths like `/en/deep/unknown` also return `200` (confirmed live and locally) even though the client router correctly renders `<NotFound/>` for those — the *HTTP status* is still wrong because Cloudflare never got a reason to return a real 404.
   - Also confirmed: the existing `<Route path="*" element={<NotFound/>} />` is a *sibling* of the `<LangLayout>` route tree, so it renders without the `<Navbar/>` and without any theme-consistent styling (bare `<main style={{padding:'32px'}}>`), and never updates canonical/OG (so a deep 404 still carries the stale homepage canonical).
6. **`public/sitemap.xml` uses slashless URLs** (`https://mateorumac.com/en`, etc.) in both `<loc>` and `<xhtml:link>` hreflang entries — confirmed by reading the file. The `/game/` entry already uses a trailing slash and must be left untouched.
7. **PDF resumes have no canonical `Link` header** — confirmed via `curl -I` on both PDFs, no `Link` header at all.
8. **Internal `<Link>`/`navigate()` targets for the homepage and resume routes are slashless** in `Navbar.jsx`, `NotFound.jsx`, `Contact.jsx`, and the `<Navigate>` in `App.jsx` (all confirmed via grep). `/tools/` and `/game/` links are already correctly slashed everywhere and must not be touched.
9. **JSON-LD is only defined once, in `index.html`**, and prerendering bakes that exact same full homepage graph (Person/WebSite/VideoGame/WebApplication/SoftwareApplication/ItemList) into the resume pages too, since nothing in the app ever modifies the `<script type="application/ld+json">` tag.

---

## Task 1: Shared path/URL utilities

**Files:**
- Create: `src/utils/paths.js`
- Test: manual (pure functions, exercised by later tasks' build+puppeteer checks; no test runner exists in this repo, see Task 9 for verification approach)

**Interfaces:**
- Produces: `SITE_URL`, `isResumePath(pathname)`, `pagePath(lang, isResume)`, `pageUrl(lang, isResume)`, `hreflangEntries(isResume)` — consumed by Tasks 2, 3, 4.

- [ ] **Step 1: Create the utility module**

```js
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
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/paths.js
git commit -m "seo: add shared trailing-slash URL utilities"
```

---

## Task 2: JSON-LD swap utility (homepage graph vs. resume ProfilePage)

**Files:**
- Create: `src/utils/jsonLd.js`
- Modify: `index.html` (tag the existing JSON-LD `<script>` with an id)

**Interfaces:**
- Consumes: `pageUrl` from `src/utils/paths.js` (Task 1).
- Produces: `syncJsonLd(isResume, lang)` — consumed by Task 3.

- [ ] **Step 1: Give the JSON-LD script tag a stable id**

In `index.html`, change:

```html
    <!-- JSON-LD: Person + Website + projects -->
    <script type="application/ld+json">
```

to:

```html
    <!-- JSON-LD: Person + Website + projects -->
    <script type="application/ld+json" id="ld-json-main">
```

(Only the opening tag changes — the JSON content inside stays exactly as-is; this keeps the homepage's full Person/WebSite/VideoGame/WebApplication/SoftwareApplication/ItemList graph as the single source of truth in one place instead of duplicating it into JS.)

- [ ] **Step 2: Create the swap utility**

```js
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
```

- [ ] **Step 3: Run the build and confirm the id survived and prerendering ran**

Run: `npm run build`
Expected: build succeeds; `grep -o "id=\"ld-json-main\"" dist/en/index.html` prints one match.

- [ ] **Step 4: Commit**

```bash
git add index.html src/utils/jsonLd.js
git commit -m "seo: add JSON-LD swap between homepage graph and resume ProfilePage schema"
```

---

## Task 3: Fix `App.jsx` — routing bug, canonical, hreflang, per-page description/OG/Twitter, JSON-LD wiring

**Files:**
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `isResumePath`, `pageUrl`, `hreflangEntries` (Task 1), `syncJsonLd` (Task 2).
- Produces: no change to `LangLayout`'s external contract — it still reads `useParams().lang` exactly as before, so every other component that calls `useParams().lang` (`Navbar.jsx`, `Contact.jsx`, `Resume.jsx`, `Hero.jsx`, `NotFound.jsx`) keeps working unmodified. Only `LangLayout`'s internal behavior changes.

**Root cause being fixed:** `<Route path="/:lang">` matches *any* single path segment (confirmed: `/randomthing` and `/xx` currently render the full homepage, because React Router treats `randomthing`/`xx` as `:lang` and falls through to the nested `index` route). The fix is a guard inside `LangLayout`: if `lang` isn't literally `"en"` or `"hr"`, render `<NotFound/>` directly instead of `<Outlet/>` — so no child route (`index`/`resume`) ever gets a chance to render for an invalid language segment. This is a much smaller, lower-risk change than replacing `:lang` with static routes (which would require rewriting every `useParams().lang` consumer in the app). A `*` route is also nested inside the valid-lang branch so `/en/whatever` (valid lang, unknown subpath) renders a themed, navbar-having 404 instead of falling all the way out to the bare top-level one.

- [ ] **Step 1: Replace the full file**

```jsx
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
import { isResumePath, pageUrl, hreflangEntries } from "./utils/paths";
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

  useEffect(() => {
    if (!isValidLang) return;

    i18n.changeLanguage(currentLang);

    document.documentElement.lang = currentLang;

    const isHr = currentLang === "hr";
    const isResume = isResumePath(location.pathname);

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
  }, [isValidLang, currentLang, location.pathname]);

  if (!isValidLang) {
    return <NotFound />;
  }

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
        <Route path="/" element={<Navigate to="/en/" replace />} />
        <Route path="/:lang" element={<LangLayout />}>
          <Route index element={<HomePage />} />
          <Route path="resume" element={<Resume />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CookieConsent />
    </>
  );
}
```

- [ ] **Step 2: Run the build**

Run: `npm run build`
Expected: build and prerender succeed (all 4 routes still prerender).

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "fix: stop :lang from matching arbitrary paths; fix canonical/hreflang/OG/JSON-LD per page"
```

---

## Task 4: Fix internal links to use trailing-slash URLs

**Files:**
- Modify: `src/components/Navbar.jsx`
- Modify: `src/components/Contact.jsx`

**Interfaces:**
- Consumes: `isResumePath` from `src/utils/paths.js` (Task 1). `lang` is still read via `useParams()` exactly as before — Task 3 did not change that contract.

**Root cause:** trailing-slash convention change means `location.pathname.endsWith("/resume")` (used twice in `Navbar.jsx`) now needs to match `/en/resume/`, not just `/en/resume` — use the shared `isResumePath` helper instead. Separately, every internal `<Link to>`/`navigate()` target for the homepage and resume routes is slashless and needs a trailing slash (confirmed via grep — `/tools/` and `/game/` `href`s are already correct and must not be touched).

- [ ] **Step 1: Update `Navbar.jsx`'s resume-path checks and internal links**

Add the import (alongside the existing `react-router-dom`/`react-i18next`/icon imports):
```js
import { isResumePath } from "../utils/paths";
```

Replace the two `.endsWith("/resume")` checks:
```js
    const onResume = location.pathname.endsWith("/resume");
```
with:
```js
    const onResume = isResumePath(location.pathname);
```
and:
```js
        } ${location.pathname.endsWith("/resume") ? "navbar--resume" : ""}`}
```
with:
```js
        } ${isResumePath(location.pathname) ? "navbar--resume" : ""}`}
```

Replace the two `scrollToId`'s resume-navigation and both brand/resume `Link`s:
```js
      navigate(`/${currentLang}`, { state: { scrollTo: id } });
```
with:
```js
      navigate(`/${currentLang}/`, { state: { scrollTo: id } });
```

```jsx
          <Link className="brand" to={`/${currentLang}`}>
```
with:
```jsx
          <Link className="brand" to={`/${currentLang}/`}>
```

Both occurrences of:
```jsx
            <Link className="navlink" to={`/${currentLang}/resume`}>
```
and (mobile drawer variant further down):
```jsx
                  to={`/${currentLang}/resume`}
```
become:
```jsx
            <Link className="navlink" to={`/${currentLang}/resume/`}>
```
and:
```jsx
                  to={`/${currentLang}/resume/`}
```

Do **not** touch the `/tools/` or `/game/` `href`s — they already use trailing slashes.

- [ ] **Step 2: Update `Contact.jsx`'s resume link**

Replace:
```jsx
                to={`/${currentLang}/resume`}
```
with:
```jsx
                to={`/${currentLang}/resume/`}
```

- [ ] **Step 3: Run the build**

Run: `npm run build`
Expected: build succeeds with no import errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Navbar.jsx src/components/Contact.jsx
git commit -m "fix: trailing-slash internal links and isResumePath checks"
```

---

## Task 5: Make the 404 page visually consistent and localized

**Files:**
- Modify: `src/pages/NotFound.jsx`
- Create: `src/styles/NotFound.css`
- Modify: `src/locales/hr.json` (add one key)

**Interfaces:**
- Consumes: existing global `.btn`/`.btn.primary` classes from `src/App.css` (already loaded site-wide via `main.jsx`), existing i18n keys `notFound.title` / `nav.home` (already present in `hr.json`). `lang` is still read via `useParams()` — unchanged contract from Task 3.

**Root cause being fixed:** `NotFound.jsx` currently renders `<main style={{padding:'32px'}}>` — no theme colors, no CTA styling. For the `/en/whatever` case it's now nested under `LangLayout` (Task 3) so it already gets the real `<Navbar/>`, but its own content still looks bare, and its home link is slashless. This brings it in line with the rest of the site's visual language (dark/light theme tokens, `.btn.primary`) with no new design system.

- [ ] **Step 1: Rewrite `NotFound.jsx`**

```jsx
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import '../styles/NotFound.css';

export default function NotFound() {
  const { lang } = useParams();
  const { t } = useTranslation();
  const safeLang = lang === 'hr' ? 'hr' : 'en';
  const isHr = safeLang === 'hr';

  useEffect(() => {
    const robots = document.querySelector('meta[name="robots"]');
    const previous = robots?.getAttribute('content') ?? 'index, follow';
    robots?.setAttribute('content', 'noindex, follow');

    return () => {
      robots?.setAttribute('content', previous);
    };
  }, []);

  return (
    <main className="not-found">
      <div className="not-found__inner">
        <p className="not-found__code">404</p>
        <h1 className="not-found__title">
          {isHr ? t('notFound.title') : 'Page not found'}
        </h1>
        <p className="not-found__body">
          {isHr ? t('notFound.body') : "The page you're looking for doesn't exist or may have moved."}
        </p>
        <Link className="btn primary not-found__cta" to={`/${safeLang}/`}>
          ↩︎ {isHr ? t('nav.home') : 'Back home'}
        </Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Add the CSS**

```css
/* src/styles/NotFound.css */
.not-found {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 96px 24px;
  text-align: center;
}

.not-found__inner {
  max-width: 480px;
}

.not-found__code {
  margin: 0 0 8px;
  font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--accent);
}

.not-found__title {
  margin: 0 0 12px;
  font-size: clamp(28px, 4vw, 36px);
  color: var(--text);
}

.not-found__body {
  margin: 0 0 28px;
  color: var(--muted);
}

.not-found__cta {
  justify-content: center;
}
```

- [ ] **Step 3: Add the missing HR body copy key**

In `src/locales/hr.json`, next to the existing `"notFound.title": "Stranica nije pronađena",` line, add:

```json
  "notFound.body": "Stranica koju tražite ne postoji ili je premještena.",
```

- [ ] **Step 4: Run the build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/pages/NotFound.jsx src/styles/NotFound.css src/locales/hr.json
git commit -m "fix: theme-consistent, localized 404 page content"
```

---

## Task 6: Fix `public/sitemap.xml` trailing slashes

**Files:**
- Modify: `public/sitemap.xml`

- [ ] **Step 1: Update the four `<loc>` and all `<xhtml:link>` entries to trailing-slash URLs**

Replace the file's four `<url>` blocks for `en`/`hr`/`en-resume`/`hr-resume` (leave the `<!-- Deployed separately -->` comment and the `/game/` block completely untouched — it already uses a trailing slash) with:

```xml
  <url>
    <loc>https://mateorumac.com/en/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://mateorumac.com/en/"/>
    <xhtml:link rel="alternate" hreflang="hr" href="https://mateorumac.com/hr/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://mateorumac.com/en/"/>
    <lastmod>2026-04-07</lastmod>
    <priority>1.0</priority>
    <changefreq>monthly</changefreq>
  </url>

  <url>
    <loc>https://mateorumac.com/hr/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://mateorumac.com/en/"/>
    <xhtml:link rel="alternate" hreflang="hr" href="https://mateorumac.com/hr/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://mateorumac.com/en/"/>
    <lastmod>2026-04-07</lastmod>
    <priority>1.0</priority>
    <changefreq>monthly</changefreq>
  </url>

  <url>
    <loc>https://mateorumac.com/en/resume/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://mateorumac.com/en/resume/"/>
    <xhtml:link rel="alternate" hreflang="hr" href="https://mateorumac.com/hr/resume/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://mateorumac.com/en/resume/"/>
    <lastmod>2026-04-07</lastmod>
    <priority>0.7</priority>
    <changefreq>monthly</changefreq>
  </url>

  <url>
    <loc>https://mateorumac.com/hr/resume/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://mateorumac.com/en/resume/"/>
    <xhtml:link rel="alternate" hreflang="hr" href="https://mateorumac.com/hr/resume/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://mateorumac.com/en/resume/"/>
    <lastmod>2026-04-07</lastmod>
    <priority>0.7</priority>
    <changefreq>monthly</changefreq>
  </url>
```

- [ ] **Step 2: Verify `scripts/prerender.js`'s `updateSitemapLastmod()` still matches routes after trailing slashes are added**

`updateSitemapLastmod()` derives `route` from each `<loc>` by stripping the host and any trailing `/` (`loc.replace(...).replace(/\/$/, "")`), then compares against `routes = ["/en", "/hr", "/en/resume", "/hr/resume"]`. Since it already strips the trailing slash before comparing, the new trailing-slash `<loc>` values still match — no change needed to `scripts/prerender.js`. Confirm this by running the build (next step) and checking the `<lastmod>` values actually update.

- [ ] **Step 3: Run the build and confirm sitemap lastmod still updates**

Run: `npm run build`
Expected: console prints `Updated sitemap.xml lastmod (home: ..., resume: ...)`; `grep '<loc>' dist/sitemap.xml` shows all four URLs with trailing slashes plus the untouched `/game/` entry.

- [ ] **Step 4: Commit**

```bash
git add public/sitemap.xml
git commit -m "seo: trailing-slash sitemap URLs and hreflang entries"
```

---

## Task 7: Server-level redirects (`public/_redirects`)

**Files:**
- Create: `public/_redirects`

**Root cause being fixed:** No server-level redirect exists for `/` → `/en/`; the only current redirect is the client-side `<Navigate>` (JS redirect), which requirement #4 explicitly forbids. Cloudflare Pages already 308-redirects slashless known routes to their trailing-slash form automatically (confirmed live: `curl -I https://mateorumac.com/en` → `308 Location: /en/`), but that's undocumented implicit behavior; making it explicit here removes any dependence on it and guarantees a single hop.

Do **not** add a `www` rule here — see the Global Constraints note; that's a zone-level Cloudflare feature, not a Pages `_redirects` concern, and is reported separately.

Do **not** add any rule matching `/tools*` or `/game*`.

- [ ] **Step 1: Create the file**

```
# Cloudflare Pages redirects. Rules are checked before static asset
# serving, evaluated top to bottom, first match wins. Every entry here is
# a single 301 hop — no chains.
#
# NOTE: the www.mateorumac.com -> mateorumac.com redirect is intentionally
# NOT handled here. Cloudflare's own guidance is to do host-level
# redirects via zone-level Bulk Redirects / Redirect Rules in the
# dashboard, not via a Pages project's _redirects file. See the final
# report for the exact dashboard action required.
#
# /tools/* and /game/* are separate deployments and are never routed to
# this Pages project in the first place — no rule below may reference them.

/                /en/               301
/en              /en/               301
/hr              /hr/               301
/en/resume       /en/resume/        301
/hr/resume       /hr/resume/        301
```

- [ ] **Step 2: Run the build and confirm the file is copied to `dist/`**

Run: `npm run build`
Expected: `test -f dist/_redirects && cat dist/_redirects` shows the file above verbatim.

- [ ] **Step 3: Commit**

```bash
git add public/_redirects
git commit -m "infra: explicit server-level redirects for apex and slashless routes"
```

---

## Task 8: PDF canonical `Link` headers (`public/_headers`)

**Files:**
- Create: `public/_headers`

**Root cause being fixed:** confirmed via `curl -I` that both CV PDFs are served with no `Link` header. Cloudflare Pages supports a `_headers` convention file (same directory rules as `_redirects`) to attach response headers per path pattern — fully doable in-repo, no dashboard action needed. Per requirement #9, add canonical headers only (no `noindex`, since there's no documented reason to also block indexing these files).

- [ ] **Step 1: Create the file**

```
# Cloudflare Pages custom headers. Canonicalizes each CV PDF to its
# corresponding resume page so search engines consolidate signals onto
# the HTML page rather than indexing the PDF as a separate result.

/Mateo_Rumac_Full_Stack_Developer_CV.pdf
  Link: <https://mateorumac.com/en/resume/>; rel="canonical"

/Mateo_Rumac_Full_Stack_Developer_CV_HR.pdf
  Link: <https://mateorumac.com/hr/resume/>; rel="canonical"
```

- [ ] **Step 2: Run the build and confirm the file is copied to `dist/`**

Run: `npm run build`
Expected: `test -f dist/_headers && cat dist/_headers` shows the file above verbatim.

- [ ] **Step 3: Commit**

```bash
git add public/_headers
git commit -m "infra: canonical Link headers on the CV PDFs"
```

---

## Task 9: Real static `404.html` in the build output

**Files:**
- Modify: `scripts/prerender.js`

**Root cause being fixed:** confirmed (Cloudflare Pages docs + WebSearch): "If your project does not include a top-level `404.html` file, Pages assumes you are deploying a single-page application" and serves `index.html` with `200` for any unmatched path. Adding a top-level `404.html` disables that assumption and makes Cloudflare return a genuine `404` status. The file must still boot the real SPA (so the nested nested `NotFound` route from Task 3 renders with the themed styling from Task 5, and picks up the right language from the URL) — so it's built as a post-build copy of the *already-built* `dist/index.html` (which has the correct hashed asset `<script>`/`<link>` tags for that specific build), with `robots` set to `noindex` statically so non-JS crawlers see the right signal immediately.

- [ ] **Step 1: Add a `writeNotFoundPage()` step to `scripts/prerender.js`**

Add this function (anywhere after `updateSitemapLastmod`, before `main`):

```js
async function writeNotFoundPage() {
  const indexPath = path.join(distDir, "index.html");
  const notFoundPath = path.join(distDir, "404.html");

  const html = await fs.readFile(indexPath, "utf8");

  // Cloudflare Pages returns a genuine HTTP 404 for unmatched paths only
  // when a top-level 404.html exists; without one it silently falls back
  // to serving index.html with 200. This file is a copy of the *built*
  // index.html (so its hashed asset tags are correct for this build) —
  // once loaded, the SPA boots as normal and the app's own router renders
  // the themed <NotFound/> route for whatever path the browser is on.
  // robots is set to noindex here too, for crawlers that don't run JS.
  const notFoundHtml = html.replace(
    '<meta name="robots" content="index, follow" />',
    '<meta name="robots" content="noindex, follow" />'
  );

  await fs.writeFile(notFoundPath, notFoundHtml, "utf8");
  console.log("Wrote dist/404.html (real SPA shell, noindex)");
}
```

- [ ] **Step 2: Call it from `main()`**

Change:
```js
  await updateSitemapLastmod();
}
```
to:
```js
  await updateSitemapLastmod();
  await writeNotFoundPage();
}
```

- [ ] **Step 3: Run the build and confirm `dist/404.html` exists and differs from `dist/index.html` only in the robots meta tag**

Run: `npm run build`
Expected: console prints `Wrote dist/404.html (real SPA shell, noindex)`; `diff dist/index.html dist/404.html` shows exactly one line changed (the `robots` meta tag).

- [ ] **Step 4: Commit**

```bash
git add scripts/prerender.js
git commit -m "infra: emit dist/404.html so Cloudflare Pages returns a real 404 instead of SPA-fallback 200"
```

---

## Task 10: `llms.txt` trailing-slash consistency (minor, in scope as an internal reference link)

**Files:**
- Modify: `public/llms.txt`

- [ ] **Step 1: Update the four page links**

In the `## Main Pages` section, change:
```
- [Homepage (EN)](https://mateorumac.com/en): Main portfolio homepage with project highlights, career timeline, technical skills, and contact section.
- [Homepage (HR)](https://mateorumac.com/hr): Croatian version of the homepage.
- [Resume (EN)](https://mateorumac.com/en/resume): Resume page with summary, experience, selected projects, skills, education, and contact links.
- [Resume (HR)](https://mateorumac.com/hr/resume): Croatian version of the resume page.
```
to:
```
- [Homepage (EN)](https://mateorumac.com/en/): Main portfolio homepage with project highlights, career timeline, technical skills, and contact section.
- [Homepage (HR)](https://mateorumac.com/hr/): Croatian version of the homepage.
- [Resume (EN)](https://mateorumac.com/en/resume/): Resume page with summary, experience, selected projects, skills, education, and contact links.
- [Resume (HR)](https://mateorumac.com/hr/resume/): Croatian version of the resume page.
```

(Leave the `DevTools`/`Nightfall` lines untouched — already trailing-slashed and out of scope.)

- [ ] **Step 2: Commit**

```bash
git add public/llms.txt
git commit -m "docs: trailing-slash URLs in llms.txt for consistency"
```

---

## Task 11: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Clean build**

Run: `npm run build`
Expected: exits 0; console shows all 4 prerender lines, the sitemap lastmod line, and the `Wrote dist/404.html` line.

- [ ] **Step 2: Confirm canonical/hreflang/OG on all 4 prerendered pages**

Run:
```bash
for p in en hr en/resume hr/resume; do
  echo "=== /$p/ ===";
  grep -oE '<link rel="canonical"[^>]*>|<link rel="alternate"[^>]*>|<meta property="og:url"[^>]*>|<meta property="og:description"[^>]*>' "dist/$p/index.html";
done
```
Expected for `/en/`: canonical `https://mateorumac.com/en/`; 3 hreflang links (`en`→`/en/`, `hr`→`/hr/`, `x-default`→`/en/`); `og:url` `https://mateorumac.com/en/`.
Expected for `/en/resume/`: canonical `https://mateorumac.com/en/resume/`; hreflang `en`→`/en/resume/`, `hr`→`/hr/resume/`, `x-default`→`/en/resume/`; `og:url` `https://mateorumac.com/en/resume/`; `og:description` must **not** equal the homepage's (spot-check by eye — it should mention "Resume"/"experience"/"skills", not "Explore selected professional work").
Expected for `/hr/` and `/hr/resume/`: same shape, `/hr/...` URLs.

- [ ] **Step 3: Confirm JSON-LD is focused on resume pages**

Run: `grep -o '"@type": *"ProfilePage"' dist/en/resume/index.html dist/hr/resume/index.html`
Expected: one match per file. Then: `grep -c '"@type": *"VideoGame"' dist/en/resume/index.html`
Expected: `0` (the full homepage graph, including the game/tools entries, must not be duplicated onto resume pages).

Also validate the JSON-LD is syntactically valid:
```bash
node -e "
const fs = require('fs');
for (const f of ['dist/en/index.html','dist/hr/index.html','dist/en/resume/index.html','dist/hr/resume/index.html']) {
  const html = fs.readFileSync(f, 'utf8');
  const m = html.match(/<script type=\"application\/ld\+json\"[^>]*>([\s\S]*?)<\/script>/);
  JSON.parse(m[1]);
  console.log(f, 'OK');
}
"
```
Expected: `OK` for all four files, no `JSON.parse` errors.

- [ ] **Step 4: Confirm the client router no longer treats arbitrary paths as a locale**

Reuse a Puppeteer smoke check (same technique used to confirm the bug during investigation):
```bash
npx vite preview --port 4174 --strictPort &
sleep 2
node -e "
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const base = 'http://localhost:4174';
  for (const p of ['/randomthing', '/xx', '/en/deep/unknown', '/en/resume', '/en/', '/hr/']) {
    const page = await browser.newPage();
    await page.goto(base + p, { waitUntil: 'networkidle0' });
    const info = await page.evaluate(() => ({
      title: document.title,
      h1: document.querySelector('h1')?.textContent,
      hasNavbar: !!document.querySelector('.navbar'),
    }));
    console.log(p, JSON.stringify(info));
    await page.close();
  }
  await browser.close();
})();
"
```
Expected: `/randomthing` and `/xx` now show `h1` starting with `404`, not the homepage `h1`; `/en/deep/unknown` shows `hasNavbar: true` (nested 404 now gets the navbar); `/en/resume` still renders the resume page correctly.
Then stop the preview server (`kill %1` or find/kill its PID as done during investigation).

- [ ] **Step 5: Confirm redirect/header/404 config files landed in `dist/` correctly**

Run:
```bash
cat dist/_redirects
cat dist/_headers
diff dist/index.html dist/404.html
```
Expected: `_redirects` has the 5 rules from Task 7 and nothing referencing `/tools` or `/game`; `_headers` has the 2 PDF `Link` rules from Task 8; the `diff` shows exactly the robots meta line differing.

- [ ] **Step 6: Confirm `/tools` and `/game` references are unchanged**

Run: `git diff --stat main -- src/components/Navbar.jsx src/components/DevTools.jsx src/components/Nightfall.jsx src/pages/Resume.jsx | grep -c tools; true`
Then manually re-grep to confirm all `/tools/` and `/game/` hrefs across the diff are byte-identical to before (the earlier grep in this task's investigation already listed every occurrence — none of them appear in any diff hunk for Tasks 1–10).

- [ ] **Step 7: Sitemap sanity check**

Run: `grep '<loc>' dist/sitemap.xml`
Expected: `https://mateorumac.com/en/`, `https://mateorumac.com/hr/`, `https://mateorumac.com/en/resume/`, `https://mateorumac.com/hr/resume/`, `https://mateorumac.com/game/` — five lines, all trailing-slashed, `/game/` unchanged.

- [ ] **Step 8: Note what verification cannot be done locally**

`_redirects`/`_headers`/`404.html`-driven HTTP status/redirect behavior is a Cloudflare Pages runtime feature — `vite preview` does not interpret these files, so actual `301`/`404` HTTP responses can only be verified after deploying to a Cloudflare Pages preview or production URL. Record this in the final report and give the user the exact `curl -I` commands to run post-deploy (same ones used during investigation).

---

## Deferred to the user (not implementable in this repo)

- **`www.mateorumac.com` → `mateorumac.com` redirect:** must be configured as a Cloudflare zone-level Bulk Redirect or Redirect Rule (Cloudflare dashboard → Rules), not a Pages `_redirects` entry — this is Cloudflare's own documented recommendation for host-level redirects and cannot be expressed correctly from within a single Pages project's build output.
