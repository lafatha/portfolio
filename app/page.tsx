import type { Metadata } from "next";
import PortfolioShell from "./components/PortfolioShell";

export const metadata: Metadata = {
  title: {
    absolute: "Gagah Athallah Fatha | Business Analyst & AI Engineer",
  },
  description:
    "Official portfolio and profile of Gagah Athallah Fatha — Business Analyst, Supply Chain Analyst, Data Analyst, and AI Engineer from Institut Teknologi Bandung (ITB).",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Gagah Athallah Fatha | Business Analyst & AI Engineer",
    description:
      "Official portfolio and profile of Gagah Athallah Fatha — Business Analyst, Supply Chain Analyst, Data Analyst, and AI Engineer from Institut Teknologi Bandung (ITB).",
    url: "https://www.gagah.tech",
    images: [
      {
        url: "/ITBlack.png",
        width: 1200,
        height: 630,
        alt: "Gagah Athallah Fatha Portfolio",
      },
    ],
  },
};

export default function Home() {
  return <PortfolioShell initialTab="profile" />;
}
