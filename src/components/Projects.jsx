import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiChevronDown } from "react-icons/fi";
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

// Featured: the professional projects given the most visual weight.
const featuredProjects = [
  {
    title: "D&A Property Management",
    img: propMan,
    href: "https://danda.hr",
    desc: "A direct booking platform for a property management company, covering the full flow from search to secure reservation in 4 languages. Includes a profit calculator for prospective landlords, plus separate login dashboards for admins and property owners to manage reservations and listings.",
    tech: [
      "React",
      "Booking Engine",
      "Custom Admin Dashboards",
      "Profit Calculator",
      "Multilingual (4 languages)",
    ],
  },
  {
    title: "D&A Smart Solutions",
    img: dWeb,
    href: "https://dandaweb.com",
    desc: "One-page site for the company's web development branch, designed and built end to end by me. A parallax hero with a device mockup leads into social proof, a portfolio carousel, pricing and a contact form, in English and Croatian.",
    tech: [
      "React",
      "Portfolio Carousel",
      "Parallax Hero",
      "Multilingual (2 languages)",
    ],
  },
  {
    title: "Apposta Lei",
    img: appostalei,
    href: "https://appostalei.com",
    desc: "Multilingual website for a hotel cosmetics and equipment distributor, organized around brand and product hubs for hospitality buyers. Includes dedicated sections for amenities and hotel equipment, animated hero areas, product galleries, a showroom page and SEO-structured content, in Croatian, English and Slovenian.",
    tech: [
      "Astro",
      "Product Catalog",
      "Brand Pages",
      "SEO",
      "Multilingual (3 languages)",
    ],
  },
  {
    title: "Meštri od Broda",
    img: mestri,
    href: "https://mestriodbroda.hr",
    desc: "Website for a Trogir-based superyacht painting and refit company, with a project gallery, staggered scroll animations and a contact form for quote requests. Verified Google reviews are featured throughout, in 2 languages.",
    tech: [
      "Astro",
      "Staggered Animations",
      "Project Gallery",
      "Client Reviews",
      "Multilingual (2 languages)",
    ],
  },
  {
    title: "Mind Well",
    img: mindwell,
    href: "https://mindwell.hr",
    desc: "Corporate wellness website with a Markdown-based blog, structured service and pricing pages, and an integrated cookie consent banner. SEO-optimized, in 2 languages.",
    tech: [
      "React",
      "Markdown Blog",
      "SEO",
      "Cookie Consent",
      "Multilingual (2 languages)",
    ],
  },
  {
    title: "Gran Caffe Monaco",
    img: caffe,
    href: "https://grancaffe.mc",
    desc: "Restaurant website for a venue in Monaco, with a black and gold, photo-first layout across about, gallery, menu, events and contact pages. Reservations run through a third-party booking widget, in 3 languages.",
    tech: [
      "React",
      "Photo-First Layout",
      "Booking Widget",
      "Multilingual (3 languages)",
    ],
  },
];

// Additional: remaining professional projects, kept but given a smaller,
// collapsible footprint instead of equal billing.
const additionalProjects = [
  {
    title: "Hotel Natura",
    img: hotel,
    href: "https://hotel-natura.com",
    desc: "Hotel website with an animated hero and amenities gallery. Includes a custom direct booking system with live availability and rates, letting the hotel skip OTA commissions.",
    tech: [
      "React",
      "Direct Booking Engine",
      "Live Availability & Rates",
      "Gallery",
    ],
  },
  {
    title: "Rent a Boat Zadar",
    img: rentaboat,
    href: "https://rentaboatzadareu.com",
    desc: "Boat rental website for a private charter business in Zadar, with fleet and destination pages in 4 languages. Includes an animated hero, detailed boat pages with galleries and pricing tables, destination content, and a custom inquiry form with a date picker.",
    tech: [
      "Astro",
      "Fleet Showcase",
      "Destination Pages",
      "Custom Inquiry Form",
      "Multilingual (4 languages)",
    ],
  },
  {
    title: "LunaSky Bay",
    img: sky,
    href: "https://lunasky-bay.com",
    desc: "Rental site for seaside mobile homes with a video hero and sandy-beach color palette. Property pages include an availability calendar, gallery, amenities list, guest reviews and a quick enquiry form, in 4 languages.",
    tech: [
      "React",
      "Booking Calendar",
      "Guest Reviews",
      "Multilingual (4 languages)",
    ],
  },
  {
    title: "Taxi Kamidi",
    img: taxi,
    href: "https://taxi-kamidi.com/en",
    desc: "Website for a taxi company with smooth-scroll animations. Includes about, services and car fleet sections plus a contact form, in 4 languages.",
    tech: [
      "React",
      "Smooth Scroll",
      "Car Fleet Showcase",
      "Multilingual (4 languages)",
    ],
  },
];

function ProjectCard({ p, t }) {
  const MediaTag = p.href ? "a" : "div";
  const mediaProps = p.href
    ? { href: p.href, target: "_blank", rel: "noreferrer noopener" }
    : {};

  return (
    <li className="work__item" data-reveal="fade-up">
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
}

export default function Projects() {
  const { t } = useTranslation();
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const animRef = useRef(null);
  // `expanded` drives aria-expanded/the button label immediately; `mounted`
  // keeps the card list in the DOM for the duration of the closing
  // animation, so collapsing gets the same motion opening does instead of
  // vanishing instantly.
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  // Re-run reveal observation whenever the additional-work list mounts.
  useEffect(() => {
    if (!mounted) return;
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
      { threshold: 0.1 }
    );
    root
      .querySelectorAll("#additional-work [data-reveal]")
      .forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [mounted]);

  useEffect(() => () => animRef.current?.cancel(), []);

  const reducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animatePanel = (opening) => {
    const panel = panelRef.current;
    if (!panel) return;
    animRef.current?.cancel();
    const height = panel.scrollHeight;
    const anim = panel.animate(
      {
        height: opening ? ["0px", `${height}px`] : [`${height}px`, "0px"],
        opacity: opening ? [0, 1] : [1, 0],
      },
      { duration: 340, easing: "cubic-bezier(0.22, 0.8, 0.33, 1)" }
    );
    animRef.current = anim;
    if (!opening) {
      anim.onfinish = () => {
        animRef.current = null;
        setMounted(false);
      };
    } else {
      anim.onfinish = () => {
        animRef.current = null;
      };
    }
  };

  const handleToggle = () => {
    const opening = !expanded;
    setExpanded(opening);

    if (reducedMotion()) {
      setMounted(opening);
      return;
    }

    if (opening) {
      setMounted(true);
      // Wait for the new cards to actually paint before measuring their
      // height, otherwise scrollHeight reads as 0 and there's nothing to
      // animate from.
      requestAnimationFrame(() => requestAnimationFrame(() => animatePanel(true)));
    } else {
      animatePanel(false);
    }
  };

  const localizedProjects = (list) =>
    list.map((p) => ({ ...p, title: t(p.title), desc: t(p.desc) }));

  const featured = localizedProjects(featuredProjects);
  const additional = localizedProjects(additionalProjects);

  return (
    <section id="projects" ref={rootRef} className="work">
      <div className="work__bg" aria-hidden="true" />

      <div className="work__container">
        <h2 className="work__title" data-reveal="fade-up">
          {t("SELECTED WORK")}
        </h2>

        <p className="work__note" data-reveal="fade-up" data-delay="100">
          {t(
            "Selected projects I designed and developed as part of my work at D&A Smart Solutions."
          )}
        </p>

        <ul className="work__grid">
          {featured.map((p, idx) => (
            <ProjectCard key={idx} p={p} t={t} />
          ))}
        </ul>

        <div className="work__more">
          <h3 className="visually-hidden">{t("Additional work")}</h3>

          <div id="additional-work" ref={panelRef}>
            {mounted && (
              <ul className="work__grid">
                {additional.map((p, idx) => (
                  <ProjectCard key={idx} p={p} t={t} />
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            className="work__more-toggle"
            aria-expanded={expanded}
            aria-controls="additional-work"
            onClick={handleToggle}
          >
            <span>
              {expanded ? t("Hide additional work") : t("View additional work")}
            </span>
            <FiChevronDown
              className={`work__more-chevron ${expanded ? "is-open" : ""}`}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
