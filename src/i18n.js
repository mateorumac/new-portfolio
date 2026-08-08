import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import hr from './locales/hr.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      hr: { translation: hr }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    // This project's convention is flat keys that are themselves the literal
    // English source text (e.g. "Thesis:", "Languages:"). Without disabling
    // these, i18next's default separators silently break any key containing
    // ":" (parsed as a namespace split) or "." (parsed as a nested path),
    // rendering an empty string instead of the text.
    nsSeparator: false,
    keySeparator: false,
  });

export default i18n;
