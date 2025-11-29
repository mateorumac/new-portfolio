import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaLinkedinIn } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import "../styles/Contact.css";
import { FiSend, FiX } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { HiOutlineDocumentText } from "react-icons/hi2";

export default function Contact() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang === "hr" ? "hr" : "en";

  const sectionRef = useRef(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const items = root.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    text: t("Email sent successfully. I’ll get back to you as soon as I can."),
  });

  const validate = (v) => {
    const errs = {};
    if (!v.name.trim()) errs.name = t("Please enter your name");
    if (!v.email.trim()) {
      errs.email = t("Please enter your email");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) {
      errs.email = t("Please enter a valid email address");
    }
    if (!v.message.trim()) errs.message = t("Please enter your message");
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      setSubmitting(true);

      const res = await fetch(
        "https://formsubmit.co/ajax/mateo.rumac@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            message: values.message,
            _subject: "New message from mateorumac.com contact form",
            _captcha: "false",
          }),
        }
      );

      const data = await res.json();
      if (res.ok && (data.success === "true" || data.success === true)) {
        setValues({ name: "", email: "", message: "" });
        setToast({
          open: true,
          text:
            currentLang === "hr"
              ? "Poruka je poslana uspješno. Javit ću se čim stignem."
              : "Email sent successfully. I’ll get back to you as soon as I can.",
        });
        setTimeout(() => setToast((t) => ({ ...t, open: false })), 5200);
      } else {
        throw new Error("Submit failed");
      }
    } catch (_err) {
      setToast({
        open: true,
        text:
          currentLang === "hr"
            ? "Ups, nešto je pošlo po zlu. Pokušaj ponovno ili pošalji email direktno."
            : "Oops, something went wrong. Please try again or email me directly.",
      });
      setTimeout(() => setToast((t) => ({ ...t, open: false })), 5200);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="contact">
      <div className="contact__bg" aria-hidden="true">
        <span className="contact__glow contact__glow--left" />
        <span className="contact__glow contact__glow--right" />
        <span className="contact__flow" />
        <span className="contact__grid" />
      </div>

      <div className="contact__container">
        <h2 className="contact__title" data-reveal="fade-up">
          {t("LET'S TALK")}
        </h2>

        <div className="contact__content">
          <div className="contact__left" data-reveal="slide-left">
            <p className="contact__lead">
              {t("Have a project in mind or just want to say hi?")}
            </p>
            <p className="contact__copy">
              {t(
                "I’m open to new opportunities, collaborations and interesting ideas. Reach out through the form or directly via email or LinkedIn. I reply as soon as I can. My email is"
              )}{" "}
              <a href="mailto:mateo.rumac@gmail.com">mateo.rumac@gmail.com</a>.
            </p>

            <div className="contact__social">
              <a
                className="contact__social-btn"
                href="https://www.linkedin.com/in/mateo-rumac-170a0b304/"
                target="_blank"
                rel="noreferrer noopener"
              >
                <FaLinkedinIn /> {t("LinkedIn")}
              </a>
              <a
                className="contact__social-btn"
                href="mailto:mateo.rumac@gmail.com"
              >
                <MdOutlineMail /> {t("Email")}
              </a>
              <Link
                className="contact__social-btn"
                to={`/${currentLang}/resume`}
                aria-label={t("Resume")}
                title={t("Resume")}
              >
                <HiOutlineDocumentText /> {t("Resume")}
              </Link>
            </div>

            <p className="contact__note">
              {t("Based in Croatia • Remote friendly")}
            </p>
          </div>

          <form
            className="contact__form"
            data-reveal="slide-right"
            onSubmit={handleSubmit}
            noValidate
          >
            <input
              type="text"
              name="_honey"
              style={{ display: "none" }}
              tabIndex={-1}
            />

            <div className="field">
              <label htmlFor="name">{t("Your name")}</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder={t("John Doe")}
                value={values.name}
                onChange={handleChange}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "err-name" : undefined}
                required
              />
              {errors.name && (
                <small
                  id="err-name"
                  className="field__error"
                  role="alert"
                  aria-live="polite"
                >
                  {errors.name}
                </small>
              )}
            </div>

            <div className="field">
              <label htmlFor="email">{t("Email")}</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={values.email}
                onChange={handleChange}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "err-email" : undefined}
                required
              />
              {errors.email && (
                <small
                  id="err-email"
                  className="field__error"
                  role="alert"
                  aria-live="polite"
                >
                  {errors.email}
                </small>
              )}
            </div>

            <div className="field field--full">
              <label htmlFor="message">{t("Message")}</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                placeholder={t("Tell me a bit about your project or idea...")}
                value={values.message}
                onChange={handleChange}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "err-message" : undefined}
                required
              />
              {errors.message && (
                <small
                  id="err-message"
                  className="field__error"
                  role="alert"
                  aria-live="polite"
                >
                  {errors.message}
                </small>
              )}
            </div>

            <div className="form__actions">
              <button
                type="submit"
                className="btn primary"
                disabled={submitting}
              >
                <FiSend aria-hidden="true" />
                {submitting ? t("Sending...") : t("Send")}
              </button>
            </div>
          </form>
        </div>

        <a
          href="#hero"
          className="contact__cue"
          data-reveal="cue"
          aria-label={t("Back to top")}
        />
      </div>

      <p className="contact__footer" data-reveal="fade-up">
        © {new Date().getFullYear()} MATEO RUMAC · {t("All rights reserved")}
      </p>

      <div
        className={`toast ${toast.open ? "show" : ""}`}
        role="status"
        aria-live="polite"
      >
        <span>
          {t("Email sent successfully. I’ll get back to you as soon as I can.")}
        </span>
        <button
          type="button"
          onClick={() => setToast((t) => ({ ...t, open: false }))}
          aria-label={t("Dismiss notification")}
        >
          <FiX />
        </button>
      </div>
    </section>
  );
}
