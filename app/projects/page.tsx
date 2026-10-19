import type { Metadata } from "next";
import PortfolioShell from "../components/PortfolioShell";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore enterprise ERP systems, AI & machine learning tools, data analytics platforms, and full-stack software projects built by Gagah Athallah Fatha.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects | Gagah Athallah Fatha",
    description:
      "Explore enterprise ERP systems, AI & machine learning tools, data analytics platforms, and full-stack software projects built by Gagah Athallah Fatha.",
    url: "https://www.gagah.tech/projects",
    images: [
      {
        url: "/ITBlack.png",
        width: 1200,
        height: 630,
        alt: "Projects by Gagah Athallah Fatha",
      },
    ],
  },
};

export default function ProjectsPage() {
  return <PortfolioShell initialTab="portfolio" />;
}
