import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import '../styles/NotFound.css';

function setMetaContent(selector, content) {
  document.querySelector(selector)?.setAttribute('content', content);
}

export default function NotFound() {
  const { lang } = useParams();
  const { t } = useTranslation();
  const safeLang = lang === 'hr' ? 'hr' : 'en';
  const isHr = safeLang === 'hr';

  useEffect(() => {
    // This page can render for a locale LangLayout never validated a
    // canonical/OG/JSON-LD set for (see App.jsx), so it owns its own <head>
    // instead of inheriting stale or homepage-claiming metadata. It never
    // sets a canonical, hreflang, or JSON-LD block of its own — a 404 has
    // no canonical URL — it only removes whatever the previous page left
    // behind.
    const title = isHr
      ? 'Mateo Rumac | Stranica nije pronađena'
      : 'Mateo Rumac | Page not found';
    const description = isHr
      ? 'Stranica koju tražite ne postoji ili je premještena.'
      : "The page you're looking for doesn't exist or may have moved.";

    document.title = title;
    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', description);

    document.querySelector('link[rel="canonical"]')?.remove();
    document.querySelector('meta[property="og:url"]')?.remove();
    ['hreflang-en', 'hreflang-hr', 'hreflang-x-default'].forEach((id) =>
      document.getElementById(id)?.remove()
    );

    const robots = document.querySelector('meta[name="robots"]');
    const previous = robots?.getAttribute('content') ?? 'index, follow';
    robots?.setAttribute('content', 'noindex, follow');

    return () => {
      robots?.setAttribute('content', previous);
    };
  }, [isHr]);

  return (
    <main className="not-found">
      <div className="not-found__content">
        <p className="not-found__code" aria-hidden="true">404</p>
        <h1 className="not-found__title">
          {isHr ? t('notFound.title') : 'Page not found'}
        </h1>
        <p className="not-found__body">
          {isHr ? t('notFound.body') : "The page you're looking for doesn't exist or may have moved."}
        </p>
        <Link className="btn primary not-found__cta" to={`/${safeLang}/`}>
          <FiArrowLeft aria-hidden="true" />
          {isHr ? t('nav.home') : 'Back home'}
        </Link>
      </div>

      <footer className="not-found__footer">
        <small className="not-found__footer-bottom">
          © {new Date().getFullYear()} MATEO RUMAC · {t('All rights reserved')}
        </small>
      </footer>
    </main>
  );
}
