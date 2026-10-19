import type { Metadata } from "next";
import PortfolioShell from "../components/PortfolioShell";

export const metadata: Metadata = {
  title: "Posts",
  description:
    "Read articles, publications, and technical perspectives by Gagah Athallah Fatha covering business analysis, AI agents, enterprise ERP implementations, and supply chain optimization.",
  alternates: {
    canonical: "/posts",
  },
  openGraph: {
    title: "Posts | Gagah Athallah Fatha",
    description:
      "Read articles, publications, and technical perspectives by Gagah Athallah Fatha covering business analysis, AI agents, enterprise ERP implementations, and supply chain optimization.",
    url: "https://www.gagah.tech/posts",
    images: [
      {
        url: "/ITBlack.png",
        width: 1200,
        height: 630,
        alt: "Posts and Articles by Gagah Athallah Fatha",
      },
    ],
  },
};

export default function PostsPage() {
  return <PortfolioShell initialTab="posts" />;
}
