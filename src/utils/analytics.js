export const GA_MEASUREMENT_ID = "G-G54L259QS2";

let gaLoaded = false;

export function loadGoogleAnalytics() {
  if (gaLoaded || typeof document === "undefined") return;
  gaLoaded = true;

  window[`ga-disable-${GA_MEASUREMENT_ID}`] = false;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, { cookie_flags: "SameSite=None;Secure" });
}

export function disableGoogleAnalytics() {
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
}
