import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

const baseUrl = new URL("https://www.gagah.tech");

export const metadata: Metadata = {
  metadataBase: baseUrl,
  title: "Gagah Athallah Fatha - Portfolio",
  description:
    "Gagah Athallah Fatha is a Fullstack Developer, Business Analyst, and Supply Chain Analyst with expertise in web development, business analysis, and supply chain optimization. Currently studying at Bandung Institute of Technology (ITB), he builds innovative solutions including onchain gaming platforms and enterprise ERP systems.",
  manifest: "/manifest.json",
  keywords: [
    "Gagah Athallah Fatha",
    "Fullstack Developer",
    "Business Analyst",
    "Supply Chain Analyst",
    "Portfolio",
    "Web Developer",
    "Next.js",
    "React",
    "TypeScript",
    "Base Realms",
    "ERP System",
    "Bandung Institute of Technology",
    "ITB",
    "Onchain gaming",
    "Supply chain optimization",
  ],
  icons: {
    icon: "/jadi.svg",
    apple: "/jadi.svg",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: baseUrl,
    type: "website",
    title: "Gagah Athallah Fatha - Portfolio",
    description:
      "Portfolio of Gagah Athallah Fatha — Fullstack Developer, Business Analyst, and Supply Chain Analyst specializing in web development, onchain gaming, and supply chain optimization.",
    siteName: "Gagah Athallah Fatha",
    images: [
      {
        url: "/ITBlack.png",
        width: 1200,
        height: 630,
        alt: "Gagah Athallah Fatha - Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gagah Athallah Fatha - Portfolio",
    description:
      "Fullstack Developer, Business Analyst, and Supply Chain Analyst focused on building clear, data-driven systems.",
    images: ["/ITBlack.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
