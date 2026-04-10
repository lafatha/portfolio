import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

const baseUrl = new URL("https://www.gagah.tech");
const siteName = "Gagah Athallah Fatha";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteName,
  url: baseUrl.toString(),
  alternateName: "gagah.tech",
  jobTitle: "Fullstack Developer",
  sameAs: [
    "https://www.linkedin.com/in/gagahfatha/",
    "https://github.com/gagahfatha",
    "https://medium.com/@athallahfatha",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  alternateName: "gagah.tech",
  url: baseUrl.toString(),
};

export const metadata: Metadata = {
  metadataBase: baseUrl,
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description:
    "Gagah Athallah Fatha is a Fullstack Developer, Business Analyst, Data Analyst, AI Engineer, and Supply Chain Analyst with expertise in web development, business analysis, data analytics, artificial intelligence, machine learning, and supply chain optimization. Currently studying at Bandung Institute of Technology (ITB), he builds innovative solutions including onchain gaming platforms and enterprise ERP systems.",
  manifest: "/manifest.json",
  keywords: [
    "Gagah Athallah Fatha",
    "Fullstack Developer",
    "Business Analyst",
    "Data Analyst",
    "AI Engineer",
    "Artificial Intelligence",
    "Machine Learning",
    "Supply Chain Analyst",
    "Project Manager",
    "Project Management",
    "Portfolio",
    "Web Developer",
    "Software Engineer",
    "Software Developer",
    "ERP System",
    "Supply Chain Management",
    "Bandung Institute of Technology",
    "Institut Teknologi Bandung",
    "ITB",
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
    title: siteName,
    description:
      "Portfolio of Gagah Athallah Fatha — Fullstack Developer, Business Analyst, Data Analyst, AI Engineer, and Supply Chain Analyst specializing in web development, AI and data systems, onchain gaming, and supply chain optimization.",
    siteName,
    images: [
      {
        url: "/ITBlack.png",
        width: 1200,
        height: 630,
        alt: "Gagah Athallah Fatha",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description:
      "Fullstack Developer, Business Analyst, Data Analyst, AI Engineer, and Supply Chain Analyst focused on building clear, data-driven and AI-enabled systems.",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
