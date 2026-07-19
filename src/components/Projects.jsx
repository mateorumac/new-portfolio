import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import propMan from "../assets/projects/propMan.webp";
import dWeb from "../assets/projects/Dandaweb.webp";
import appostalei from "../assets/projects/appostalei.webp";
import rentaboat from "../assets/projects/rent-a-boat.webp";
import mestri from "../assets/projects/mestri-hero.webp";
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
        "A direct booking platform for a property management company, covering the full flow from search to secure reservation in 4 languages. Includes a profit calculator for prospective landlords, plus separate login dashboards for admins and property owners to manage reservations and listings."
      ),
      tech: [
        "React",
        "Booking Engine",
        "Custom Admin Dashboards",
        "Profit Calculator",
        "Multilingual (4 languages)",
      ],
    },
    {
      title: t("D&A Smart Solutions"),
      img: dWeb,
      href: "https://dandaweb.com",
      desc: t(
        "One-page site for the company's web development branch, designed and built end to end by me. A parallax hero with a device mockup leads into social proof, a portfolio carousel, pricing and a contact form, in English and Croatian."
      ),
      tech: [
        "React",
        "Portfolio Carousel",
        "Parallax Hero",
        "Multilingual (2 languages)",
      ],
    },
    {
      title: t("Apposta Lei"),
      img: appostalei,
      href: "https://appostalei.com",
      desc: t(
        "Multilingual website for a hotel cosmetics and equipment distributor, organized around brand and product hubs for hospitality buyers. Includes dedicated sections for amenities and hotel equipment, animated hero areas, product galleries, a showroom page and SEO-structured content, in Croatian, English and Slovenian."
      ),
      tech: [
        "Astro",
        "Product Catalog",
        "Brand Pages",
        "SEO",
        "Multilingual (3 languages)",
      ],
    },
    {
      title: t("Gran Caffe Monaco"),
      img: caffe,
      href: "https://grancaffe.mc",
      desc: t(
        "Restaurant website for a venue in Monaco, with a black and gold, photo-first layout across about, gallery, menu, events and contact pages. Reservations run through a third-party booking widget, in 3 languages."
      ),
      tech: [
        "React",
        "Photo-First Layout",
        "Booking Widget",
        "Multilingual (3 languages)",
      ],
    },
    {
      title: t("Meštri od Broda"),
      img: mestri,
      href: "https://mestriodbroda.hr",
      desc: t(
        "Website for a Trogir-based superyacht painting and refit company, with a project gallery, staggered scroll animations and a contact form for quote requests. Verified Google reviews are featured throughout, in 2 languages."
      ),
      tech: [
        "Astro",
        "Staggered Animations",
        "Project Gallery",
        "Client Reviews",
        "Multilingual (2 languages)",
      ],
    },
    {
      title: t("Rent a Boat Zadar"),
      img: rentaboat,
      href: "https://rentaboatzadareu.com",
      desc: t(
        "Boat rental website for a private charter business in Zadar, with fleet and destination pages in 4 languages. Includes an animated hero, detailed boat pages with galleries and pricing tables, destination content, and a custom inquiry form with a date picker."
      ),
      tech: [
        "Astro",
        "Fleet Showcase",
        "Destination Pages",
        "Custom Inquiry Form",
        "Multilingual (4 languages)",
      ],
    },
    {
      title: t("Hotel Natura"),
      img: hotel,
      href: "https://hotel-natura.com",
      desc: t(
        "Hotel website with an animated hero and amenities gallery. Includes a custom direct booking system with live availability and rates, letting the hotel skip OTA commissions."
      ),
      tech: [
        "React",
        "Direct Booking Engine",
        "Live Availability & Rates",
        "Gallery",
      ],
    },
    {
      title: t("LunaSky Bay"),
      img: sky,
      href: "https://lunasky-bay.com",
      desc: t(
        "Rental site for seaside mobile homes with a video hero and sandy-beach color palette. Property pages include an availability calendar, gallery, amenities list, guest reviews and a quick enquiry form, in 4 languages."
      ),
      tech: [
        "React",
        "Booking Calendar",
        "Guest Reviews",
        "Multilingual (4 languages)",
      ],
    },
    {
      title: t("Taxi Kamidi"),
      img: taxi,
      href: "https://taxi-kamidi.com/en",
      desc: t(
        "Website for a taxi company with smooth-scroll animations. Includes about, services and car fleet sections plus a contact form, in 4 languages."
      ),
      tech: [
        "React",
        "Smooth Scroll",
        "Car Fleet Showcase",
        "Multilingual (4 languages)",
      ],
    },
    {
      title: t("Mind Well"),
      img: mindwell,
      href: "https://mindwell.hr",
      desc: t(
        "Corporate wellness website with a Markdown-based blog, structured service and pricing pages, and an integrated cookie consent banner. SEO-optimized, in 2 languages."
      ),

      tech: [
        "React",
        "Markdown Blog",
        "SEO",
        "Cookie Consent",
        "Multilingual (2 languages)",
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
          {t("Here are some of the projects I designed and built during my full-time role at D&A Smart Solutions.")}
        </p>

        <ul className="work__grid">
          {projects.map((p, idx) => {
            const MediaTag = p.href ? "a" : "div";
            const mediaProps = p.href
              ? { href: p.href, target: "_blank", rel: "noreferrer noopener" }
              : {};

            return (
              <li key={idx} className="work__item" data-reveal="fade-up">
                <article className="work__card">
                  <MediaTag className="work__media" {...mediaProps}>
                    <img src={p.img} alt={p.title} loading="lazy" width="1600" height="900" />
                    <div className="work__tags-overlay">
                      <ul className="work__tech">
                        {p.tech.map((tag) => (
                          <li key={tag}>{t(tag)}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="work__info">
                      <h3 className="work__name">{p.title}</h3>
                      <p className="work__desc">{p.desc}</p>
                    </div>
                  </MediaTag>

                  <div className="work__info--mobile">
                    <h3 className="work__name">{p.title}</h3>
                    <p className="work__desc">{p.desc}</p>
                    <ul className="work__tech">
                      {p.tech.map((tag) => (
                        <li key={tag}>{t(tag)}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
