import type { Metadata } from "next";
import PortfolioShell from "../components/PortfolioShell";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A visual gallery from the personal portfolio of Gagah Athallah Fatha, showcasing moments, academic journey at ITB, work, and behind-the-scenes experiences.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Gallery | Gagah Athallah Fatha",
    description:
      "A visual gallery from the personal portfolio of Gagah Athallah Fatha, showcasing moments, academic journey at ITB, work, and behind-the-scenes experiences.",
    url: "https://www.gagah.tech/gallery",
    images: [
      {
        url: "/gallery/foto1.webp",
        width: 1200,
        height: 630,
        alt: "Gallery of Gagah Athallah Fatha",
      },
    ],
  },
};

export default function GalleryPage() {
  return <PortfolioShell initialTab="gallery" />;
}
