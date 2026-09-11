import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};


const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

const betaniaPatmos = localFont({
  src: "./fonts/BetaniaPatmos-Regular.ttf",
  variable: "--font-betania-patmos",
  display: "swap",
});

const baseUrl = new URL("https://www.gagah.tech");
const siteName = "Gagah Athallah Fatha";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteName,
  url: baseUrl.toString(),
  alternateName: "gagah.tech",
  jobTitle: "Business Analyst",
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
    "Gagah Athallah Fatha is a Business Analyst, Supply Chain Analyst, Fullstack Developer, Data Analyst, and AI Engineer with expertise in business analysis, supply chain optimization, web development, data analytics, artificial intelligence, and machine learning. Currently studying at Bandung Institute of Technology (ITB), he builds innovative solutions including onchain gaming platforms and enterprise ERP systems.",
  manifest: "/manifest.json",
  keywords: [
    "Gagah Athallah Fatha",
    "Business Analyst",
    "Supply Chain Analyst",
    "Fullstack Developer",
    "Data Analyst",
    "AI Engineer",
    "Artificial Intelligence",
    "Machine Learning",
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
      "Portfolio of Gagah Athallah Fatha — Business Analyst, Supply Chain Analyst, Fullstack Developer, Data Analyst, and AI Engineer specializing in business analysis, supply chain optimization, web development, AI and data systems, and onchain gaming.",
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
      "Business Analyst, Supply Chain Analyst, Fullstack Developer, Data Analyst, and AI Engineer focused on building clear, data-driven and AI-enabled systems.",
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
    <html lang="en" className={`${plusJakartaSans.variable} ${betaniaPatmos.variable}`}>
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
