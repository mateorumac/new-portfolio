// src/pages/Resume.jsx
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiArrowLeft, FiDownload, FiMail } from "react-icons/fi";
import { FaLinkedinIn } from "react-icons/fa";
import cvEN from "../assets/MR_CV_ENG.pdf";
import cvHR from "../assets/MR_CV_HR.pdf";
import "../styles/Resume.css";

export default function Resume() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang === "hr" ? "hr" : "en";

  const pdfUrl = currentLang === "hr" ? cvHR : cvEN;
  const fileName =
    currentLang === "hr" ? "Mateo_Rumac_CV_HR.pdf" : "Mateo_Rumac_CV_EN.pdf";

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <section className="resume" aria-label={t("Resume")}>
      <div className="resume__container">
        <div className="resume__controls">
          <Link to={`/${currentLang}`} className="resume__btn ghost">
            <FiArrowLeft />
            <span>{t("Back")}</span>
          </Link>

          <div className="resume__spacer" />

          <a href={pdfUrl} download={fileName} className="resume__btn primary">
            <FiDownload />
            <span>{t("Download PDF")}</span>
          </a>
        </div>

        <div className="resume__viewer">
          {isMobile ? (
            <p className="resume__fallback">
              <a href={pdfUrl} target="_blank" rel="noreferrer noopener">
                {t("Open PDF in a new tab")}
              </a>
            </p>
          ) : (
            <iframe
              key={currentLang}
              src={`${pdfUrl}#zoom=110`}
              className="resume__frame"
              title="Resume"
            />
          )}
        </div>
      </div>

      <footer className="resume__miniFooter" aria-label="Footer">
        <div className="resume__miniFooter-divider"></div>

        <h2 className="resume__miniFooter-title">
          {t("Let’s connect and explore future opportunities together")}
        </h2>

        <div className="resume__miniFooter-actions">
          <a
            className="resume__btnFlat"
            href="https://www.linkedin.com/in/mateo-rumac-170a0b304/"
            target="_blank"
            rel="noreferrer noopener"
          >
            <FaLinkedinIn />
            <span>{t("LinkedIn")}</span>
          </a>

          <a className="resume__btnFlat" href="mailto:mateo.rumac@gmail.com">
            <FiMail />
            <span>{t("Email")}</span>
          </a>
        </div>

        <div className="resume__miniFooter-bottom">
          <small>
            © {new Date().getFullYear()} MATEO RUMAC · {t("All rights reserved")}
          </small>
        </div>
      </footer>
    </section>
  );
}
