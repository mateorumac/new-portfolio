import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import propMan from "../assets/projects/propMan.webp";
import dWeb from "../assets/projects/Dandaweb.webp";
import daniva from "../assets/projects/daniva.webp";
import caffe from "../assets/projects/gcaffe.webp";
import taxi from "../assets/projects/kamidi.webp";
import sky from "../assets/projects/lunasky.webp";
import hotel from "../assets/projects/natura.webp";
import mindwell from "../assets/projects/mindwell.webp";
import "../styles/Projects.css";

export default function Projects() {
  const { t } = useTranslation();
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );
    root.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const projects = [
    {
      title: t("D&A Property Management"),
      img: propMan,
      href: "https://danda.hr",
      desc: t(
        "Custom direct booking platform with full flow from date search to secure reservations. Includes a rental profit calculator, multilingual content in 4 languages, responsive design and smooth scrolling with Locomotive. Features a login system for admins and property owners, each with a tailored dashboard for managing daily reservations and properties."
      ),
      tech: [
        "Booking Engine",
        "Multilingual",
        "Responsive",
        "Custom Admin",
        "Profit Calculator",
        "Smooth UX",
      ],
    },
    {
      title: t("D&A Smart Solutions"),
      img: dWeb,
      href: "https://dandaweb.com",
      desc: t(
        "One page website for the company’s web development branch, fully designed and built by myself. Features a parallax hero with device mockup, about and social proof sections, animated CTA, portfolio carousel, pricing and contact form. Responsive on all devices and available in English and Croatian."
      ),
      tech: [
        "One Page",
        "Responsive",
        "Multilingual",
        "Animations",
        "Portfolio Carousel",
        "Parallax Hero",
      ],
    },
    {
      title: t("Hotel Natura"),
      img: hotel,
      href: "https://hotel-natura.com",
      desc: t(
        "Hotel website with animated hero, amenities overview and rich gallery. Includes a custom direct booking system with live availability and rates, avoiding OTA fees and providing a fast, user friendly experience."
      ),
      tech: [
        "Hotel Website",
        "Direct Booking",
        "Gallery",
        "Responsive",
        "Animations",
        "UX Design",
      ],
    },
    {
      title: t("LunaSky Bay"),
      img: sky,
      href: "https://lunasky-bay.com",
      desc: t(
        "Rental site for seaside mobile homes with video hero and sandy beach color palette. Features property showcase pages with availability calendar, rich gallery, amenities list, guest reviews and quick enquiry form. Fully responsive and available in four languages."
      ),
      tech: [
        "Rental Website",
        "Booking Calendar",
        "Multilingual",
        "Gallery",
        "Guest Reviews",
        "Responsive",
      ],
    },
    {
      title: t("Daniva Brow & Beauty"),
      img: daniva,
      href: "https://danivabb.com",
      desc: t(
        "One page website for a beauty salon with parallax effects and smooth animations. Includes about and services sections, gallery, client reviews and contact form with external booking link. Responsive design available in English and Croatian."
      ),
      tech: [
        "One Page",
        "Parallax",
        "Animations",
        "Gallery",
        "Client Reviews",
        "Multilingual",
        "Responsive",
      ],
    },
    {
      title: t("Taxi Kamidi"),
      img: taxi,
      href: "https://taxi-kamidi.com/en",
      desc: t(
        "Website for a taxi company with smooth scrolling and content animations. Includes about and services sections, car fleet showcase and contact form. Responsive design with support for four languages."
      ),
      tech: [
        "Smooth Scroll",
        "Animations",
        "Car Fleet",
        "Services",
        "Multilingual",
        "Responsive",
      ],
    },
    {
      title: t("Gran Caffe Monaco"),
      img: caffe,
      href: "https://grancaffe.mc",
      desc: t(
        "Restaurant website in Monaco with a black and gold theme and a photo-first layout. Includes about, gallery, menu and events pages, contact, and a booking flow via a third party widget. Custom design with refined hover effects and fast mobile performance."
      ),
      tech: [
        "Custom Design",
        "Photo-first",
        "Menu",
        "Events",
        "Booking Widget",
        "Hover Effects",
        "Responsive",
      ],
    },
    {
      title: t("Mind Well"),
      img: mindwell,
      href: "https://mindwell.hr",
      desc: t(
        "Corporate wellness website with a clean, professional layout, multilingual content and a Markdown-based blog. Features optimized SEO, structured service and pricing pages, and an integrated cookie notice."
      ),

      tech: [
        "Corporate Website",
        "Markdown Blog",
        "SEO Optimized",
        "Multilingual",
        "Responsive",
        "Custom Components",
        "Cookie Notice",
      ],
    },
  ];

  return (
    <section id="projects" ref={rootRef} className="work">
      <div className="work__bg" aria-hidden="true" />

      <div className="work__container">
        <h2 className="work__title" data-reveal="fade-up">
          {t("SELECTED WORK")}
        </h2>

        <p className="work__note" data-reveal="fade-up" data-delay="100">
          {t(
            "Here are some of the projects I designed and built end-to-end."
          )}
        </p>
        <p className="work__disclaimer" data-reveal="fade-up" data-delay="150">
          {t(
            "These projects were created during my full-time role at D&A Smart Solutions."
          )}
        </p>

        <ul className="work__grid">
          {projects.map((p, idx) => (
            <li key={idx} className="work__item" data-reveal="fade-up">
              <article className="work__card">
                <div className="work__media">
                  <img src={p.img} alt={p.title} loading="lazy" />
                  <div className="work__info">
                    <h3 className="work__name">{p.title}</h3>
                    <p className="work__desc">{p.desc}</p>

                    <ul className="work__tech">
                      {p.tech.map((tag) => (
                        <li key={tag}>{t(tag)}</li>
                      ))}
                    </ul>

                    {p.href && (
                      <div className="work__actions">
                        <a
                          className="btn primary"
                          href={p.href}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          {t("Visit site")}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="work__info--mobile">
                  <h3 className="work__name">{p.title}</h3>
                  <p className="work__desc">{p.desc}</p>
                  <ul className="work__tech">
                    {p.tech.map((tag) => (
                      <li key={tag}>{t(tag)}</li>
                    ))}
                  </ul>

                  {p.href && (
                    <div className="work__actions">
                      <a
                        className="btn primary"
                        href={p.href}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {t("Visit site")}
                      </a>
                    </div>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
