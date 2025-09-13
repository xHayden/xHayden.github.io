import ProjectModal from "../components/projects/ProjectModal";

const GenericModal = (name, description, benefits, links = []) => {
  return (
    <ProjectModal
      name={name}
      description={description}
      benefits={benefits}
      links={links}
    />
  );
};

export const projects = [
  {
    id: "health-sync",
    name: "Health Sync",
    description: "An interactive health widget visualization tool",
    imageUrl: "/photos/G7C0oBQVez.webp",
    modalContent: GenericModal(
      "Health Sync",
      "An interactive dashboard that visualizes Apple HealthKit data with responsive, adaptable widgets for quick health insights. After working on Ichor, it's main purpose has become a pullup tracker on a Raspberry Pi.",
      [
        "Apple HealthKit integration",
        "Responsive dashboard widgets",
        "Configurable metrics & views",
        "Fast, lightweight UI",
        "Built for extensibility",
      ],
      [{ href: "https://github.com/xHayden/health-sync", label: "GitHub" }]
    ),
  },
  {
    id: "ichor-health",
    name: "Ichor Health",
    description: "A healthcare data workflow orchestration platform",
    imageUrl: "/photos/p00L5i_8Vb.webp",
    modalContent: GenericModal(
      "Ichor Health",
      "A HIPAA-compliant platform for orchestrating healthcare data workflows—bridging EHR middleware, low-code tooling, and real-time dashboards.",
      [
        "No/low-code workflow builder (Joint.js Widgets)",
        "HIPAA-compliant Go microservices",
        "Temporal-managed orchestration",
        "FHIR & health API integrations (Fitbit/Garmin/etc.)",
        "Real-time dashboards via Centrifugo websockets",
      ],
      []
    ),
  },
  {
    id: "maxrewards",
    name: "MaxRewards",
    description: "Implemented the MaxRewards marketing site",
    imageUrl: "/photos/5LxM2uG6qm.webp",
    modalContent: GenericModal(
      "MaxRewards.com",
      "Implemented the production marketing site (Aug 2023 – Jan 2024) using modern web tech and animation libraries, plus an automated credit card comparison tool.",
      [
        "Next.js with SSR",
        "TypeScript + Tailwind",
        "Interactive animations",
        "Performance-minded implementation",
        "Automated card comparison tool",
      ],
      [{ href: "https://www.maxrewards.com", label: "Website" }]
    ),
  },
  {
    id: "physarum-simulation",
    name: "Physarum Simulation",
    description:
      "Slime mold simulation to demonstrate evolutionary pathfinding",
    imageUrl: "/photos/_gQcmcRHO3.webp",
    modalContent: GenericModal(
      "Physarum Simulation",
      "A forked, terrain-aware Physarum polycephalum simulation that explores natural transport networks over real-world heightmaps (GA, FL, CA, NYC, Singapore).",
      [
        "Geographic heightmap rendering",
        "Food-source attraction modeling",
        "A* pathfinding comparison",
        "Interactive visualization",
        "Open-source analysis + paper",
      ],
      [{ href: "https://hayden.gg/physarum/", label: "Demo" }]
    ),
  },
  {
    id: "image-hosting",
    name: "Image Hosting",
    description: "A lightweight image hosting service for img.hayden.gg",
    imageUrl: "/photos/XYeV6wuAKc.webp",
    modalContent: GenericModal(
      "Lightweight Image Hosting",
      "Minimal, fast image hosting that pairs with a macOS screenshot utility to auto-upload and return a markdown-ready URL—perfect for Obsidian notes and quick sharing.",
      [
        "Instant screenshot upload",
        "Markdown URL to clipboard",
        "Simple API + CLI",
        "Self-hosted at img.hayden.gg",
        "Built for speed and reliability",
      ],
      [{ href: "https://img.hayden.gg", label: "img.hayden.gg" }]
    ),
  },
  {
    id: "sweatstake",
    name: "SweatStake",
    description:
      "A fitness app that syncs Apple Health workouts and charges you for missed days",
    imageUrl: "/photos/BR6SNH8MNc.webp",
    modalContent: GenericModal(
      "SweatStake",
      "A motivational fitness app that uses Apple Health workout data to track no-show days and charge a configurable penalty, with streaks and month-by-month views.",
      [
        "Apple Health/HealthKit sync",
        "Customizable penalty + weekly break days",
        "Smart early-morning workout logic",
        "Automatic streak detection & history",
        "Monthly calendar and overview screens",
      ],
      [{ href: "https://github.com/xHayden/sweat-stake", label: "GitHub" }]
    ),
  },
];

export default projects;
