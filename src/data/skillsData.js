// Shared skills data source. Used by both the Skills section (src/components/Skills.jsx)
// and the Resume page (src/pages/Resume.jsx) so the two never drift apart.
export const SKILL_GROUPS = [
  {
    key: "frontend",
    label: "Frontend",
    items: [
      "JavaScript",
      "React",
      "Astro",
      "Vite",
      "Next.js",
      "HTML5",
      "CSS3",
      "Chart.js",
      "Three.js",
      "Responsive UI",
      "Accessibility",
      "i18n",
    ],
  },
  {
    key: "backend",
    label: "Backend",
    items: [
      "PHP",
      "MySQL",
      "REST API Development",
      "Third-party API Integrations",
      "Authentication & Authorization",
      "Stripe Payments",
      "Webhook Processing",
      "Server-side Validation",
      "Data aggregation",
    ],
  },
  {
    key: "tools",
    label: "Tools & Delivery",
    items: [
      "Git",
      "Bitbucket",
      "Postman",
      "Composer",
      "SSH",
      "cPanel",
      "API debugging",
      "Technical SEO",
      "Production deployment",
      "Email / SMTP",
    ],
  },
];
