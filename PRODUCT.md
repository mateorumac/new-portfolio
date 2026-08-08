# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters and hiring managers reviewing Mateo Rumac's resume while evaluating him for full-stack or web development roles, usually arriving from the portfolio's nav/contact flow or a shared link. Mateo himself also shares this page's link directly (e.g. in outreach messages) as a resume link.

## Product Purpose

The `/resume` page presents Mateo Rumac's resume for reading on the page and downloading as a PDF, in English or Croatian. Success is a recruiter being able to scan it quickly and get a correct, language-matched PDF without friction.

## Positioning

A personal portfolio + resume for a full-stack developer whose frontend work is the strongest, most demonstrable part of the offering (backed by real shipped client and independent projects elsewhere on the same site), not a template-generated resume site.

## Operating Context

- Bilingual site (English/Croatian) via react-i18next; `/en` and `/hr` route prefixes.
- Dark/light theme toggle, persisted via `data-theme` + localStorage, used site-wide.
- The resume's actual content (career timeline, education, skills list) already lives elsewhere in this codebase: `src/components/TimelineExperience.jsx` (BSc Informatics — Juraj Dobrila University of Pula; Full-Stack Web Developer at D&A Smart Solutions, Nov 2024–present) and `src/components/Skills.jsx` (Frontend/Backend/Tools & Delivery groups).
- Two real PDF files already exist and are wired up: `public/Mateo_Rumac_Full_Stack_Developer_CV.pdf` (EN) and `public/Mateo_Rumac_Full_Stack_Developer_CV_HR.pdf` (HR).
- Current implementation embeds the PDF directly in an `<iframe>` — this is the piece being replaced.

## Capabilities and Constraints

- Stack: React 19 + Vite, react-router-dom, react-i18next, react-icons. Plain CSS per component (no CSS framework, no CSS-in-JS). No new large dependencies for this work.
- Must preserve the existing dark/light theme system and the EN/HR i18n system (`hr.json` translation keys), and must not duplicate components per language.
- Must not invent metrics, user counts, years of experience, or claims beyond what the rest of the site already states.
- Two real CV PDFs already exist at the correct public paths (see above) and must stay the actual downloadable/source-of-truth files.

## Brand Commitments

- Name: Mateo Rumac. Existing logo (`src/assets/logo.webp`) used site-wide in the navbar.
- Existing accent system: mint/blue/purple gradient (`--accent`, `--accent-2`, `--accent-hot` CSS custom properties), dark navy base (`--bg`, `--panel`), Space Grotesk for the navbar/display type, system sans elsewhere, monospace only for the Hero's decorative typed-code effect.
- Established editorial/asymmetric layout language across Hero/About/Projects/Skills/Contact (large left-aligned display headings, label+content rows, tag pills, scroll-reveal via `[data-reveal]` + IntersectionObserver, `prefers-reduced-motion` support throughout).

## Evidence on Hand

- Real, already-published career and skills data (see Operating Context) — this page must stay consistent with it, not restate it differently.
- Real PDF resume files for both languages (see Capabilities and Constraints).
- No testimonials, press, case studies, or usage metrics exist for Mateo individually; none should be fabricated for this page.

## Product Principles

1. The resume page must read as a natural extension of this site's own design system, not a bolted-on document viewer or a generic template.
2. Content must stay consistent with what's already stated elsewhere on the site (career, skills, projects) — this page restates, it doesn't invent.
3. A downloadable, language-correct PDF must remain available, but the page itself is a real, native HTML resume, not an iframe wrapper.
4. This page's only job is presenting and enabling download of the resume — no cross-promotion or pitch content beyond the resume itself (confirmed with the user).
5. Explicitly reject AI-generated-feeling scaffolding for this rebuild: no gradient headline text, no eyebrow label over the heading, no matching set of three icon+heading+text feature cards, no stat/metric row.

## Accessibility & Inclusion

Existing site-wide standard applies: full keyboard navigation, visible focus states, `prefers-reduced-motion` support, sufficient contrast in both themes, meaningful accessible names for controls.
