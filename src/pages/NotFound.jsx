import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export default function NotFound() {
  const { lang } = useParams();
  const { t } = useTranslation();
  const safeLang = lang === 'hr' ? 'hr' : 'en';

  useEffect(() => {
    const robots = document.querySelector('meta[name="robots"]');
    const previous = robots?.getAttribute('content') ?? 'index, follow';
    robots?.setAttribute('content', 'noindex, follow');

    return () => {
      robots?.setAttribute('content', previous);
    };
  }, []);

  return (
    <main style={{ padding: '32px' }}>
      <h1>404 — {safeLang === 'hr' ? t('notFound.title') : 'Page not found'}</h1>
      <Link to={`/${safeLang}`}>↩︎ {safeLang === 'hr' ? t('nav.home') : 'Home'}</Link>
    </main>
  );
}
