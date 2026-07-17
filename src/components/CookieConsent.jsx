import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TbCookie } from "react-icons/tb";
import { loadGoogleAnalytics, disableGoogleAnalytics } from "../utils/analytics";
import "../styles/CookieConsent.css";

const STORAGE_KEY = "mateorumac-analytics-consent";

export default function CookieConsent() {
  const { t } = useTranslation();
  const [consent, setConsent] = useState(
    () => localStorage.getItem(STORAGE_KEY) || null
  );
  const [bannerMounted, setBannerMounted] = useState(false);
  const [bannerClosing, setBannerClosing] = useState(false);

  useEffect(() => {
    if (consent === "accepted") {
      loadGoogleAnalytics();
    } else if (consent === "declined") {
      disableGoogleAnalytics();
    }
  }, [consent]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== STORAGE_KEY) return;
      setConsent(e.newValue);
      if (e.newValue) closeBanner();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (consent !== null) return;

    const interactionEvents = ["pointerdown", "keydown", "scroll", "touchstart"];
    const revealOnInteraction = () => {
      interactionEvents.forEach((event) =>
        window.removeEventListener(event, revealOnInteraction)
      );
      openBanner();
    };

    interactionEvents.forEach((event) =>
      window.addEventListener(event, revealOnInteraction, { passive: true })
    );

    return () =>
      interactionEvents.forEach((event) =>
        window.removeEventListener(event, revealOnInteraction)
      );
  }, [consent]);

  const openBanner = () => {
    setBannerClosing(false);
    setBannerMounted(true);
  };

  const closeBanner = () => {
    setBannerClosing(true);
    window.setTimeout(() => {
      setBannerMounted(false);
      setBannerClosing(false);
    }, 400);
  };

  const choose = (value) => {
    localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
    closeBanner();
  };

  return (
    <>
      <button
        type="button"
        className={`cookie-settings-btn ${
          bannerMounted ? "cookie-settings-btn--hidden" : ""
        }`}
        onClick={openBanner}
        aria-hidden={bannerMounted}
        tabIndex={bannerMounted ? -1 : 0}
        aria-label={t("Cookie preferences")}
        title={t("Cookie preferences")}
      >
        <TbCookie aria-hidden="true" />
      </button>

      {bannerMounted && (
        <div
          className="cookie-banner"
          role="dialog"
          aria-live="polite"
          aria-label={t("Cookie preferences")}
        >
          <div
            className={`cookie-banner__inner ${
              bannerClosing ? "cookie-banner__inner--closing" : ""
            }`}
          >
            <h2 className="cookie-banner__title">{t("Cookies")}</h2>
            <p className="cookie-banner__text">
              {t(
                "I use Google Analytics to see which pages and projects visitors are interested in. Purely optional, and you can turn it off anytime with the icon in the corner."
              )}
            </p>
            <div className="cookie-banner__actions">
              <button
                type="button"
                className="btn ghost cookie-banner__btn"
                onClick={() => choose("declined")}
              >
                {t("Decline")}
              </button>
              <button
                type="button"
                className="btn primary cookie-banner__btn"
                onClick={() => choose("accepted")}
              >
                {t("Accept")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
