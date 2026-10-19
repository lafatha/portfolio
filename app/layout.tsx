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
  "@id": "https://www.gagah.tech/#person",
  name: siteName,
  givenName: "Gagah",
  familyName: "Fatha",
  additionalName: "Athallah",
  alternateName: ["Gagah", "Gagah Fatha", "Athallah Fatha", "lafatha", "gagah.tech"],
  url: baseUrl.toString(),
  image: `${baseUrl.origin}/profilepic.webp`,
  jobTitle: [
    "Business Analyst",
    "Supply Chain Analyst",
    "Technology and Transformation Consulting Intern",
    "Data Analyst",
    "AI Engineer",
  ],
  description:
    "Business Analyst and Supply Chain Analyst specialized in enterprise ERP, operations, technology consulting, and AI systems.",
  email: "mailto:athallahfatha@gmail.com",
  sameAs: [
    "https://www.linkedin.com/in/gagahathallahfatha/",
    "https://github.com/lafatha",
    "https://medium.com/@athallahfatha",
    "https://www.youtube.com/@GagahAthallahFatha",
    "https://www.researchgate.net/profile/Gagah-Athallah-Fatha",
  ],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Institut Teknologi Bandung",
    alternateName: "ITB",
    url: "https://www.itb.ac.id",
  },
  knowsAbout: [
    "Supply Chain Optimization",
    "Operations Management",
    "Enterprise Resource Planning (ERP)",
    "Technology Consulting",
    "SAP",
    "Ivalua",
    "Business Analysis",
    "Data Analytics",
    "Artificial Intelligence",
    "Machine Learning",
    "Next.js",
    "TypeScript",
    "Python",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.gagah.tech/#website",
  name: siteName,
  alternateName: ["gagah.tech", "Gagah Portfolio"],
  url: baseUrl.toString(),
  description:
    "Official portfolio and personal website of Gagah Athallah Fatha — Business Analyst, Supply Chain Analyst, Data Analyst, and AI Engineer.",
  publisher: {
    "@id": "https://www.gagah.tech/#person",
  },
  inLanguage: ["en-US", "id-ID"],
};

const profilePageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": "https://www.gagah.tech/#webpage",
  url: baseUrl.toString(),
  name: `${siteName} - Portfolio`,
  isPartOf: {
    "@id": "https://www.gagah.tech/#website",
  },
  mainEntity: {
    "@id": "https://www.gagah.tech/#person",
  },
  inLanguage: "en-US",
};

const siteNavigationSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [
    {
      "@type": "SiteNavigationElement",
      position: 1,
      name: "Profile",
      description: "Profile of Gagah Athallah Fatha, education, experience, and core skills.",
      url: "https://www.gagah.tech/",
    },
    {
      "@type": "SiteNavigationElement",
      position: 2,
      name: "Projects",
      description: "Explore enterprise ERP systems, AI & machine learning tools, and software projects.",
      url: "https://www.gagah.tech/projects",
    },
    {
      "@type": "SiteNavigationElement",
      position: 3,
      name: "Posts",
      description: "Read technical articles and insights on business analysis, AI agents, and ERP.",
      url: "https://www.gagah.tech/posts",
    },
    {
      "@type": "SiteNavigationElement",
      position: 4,
      name: "Gallery",
      description: "Visual gallery of moments, ITB academic journey, and milestones.",
      url: "https://www.gagah.tech/gallery",
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: baseUrl,
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description:
    "Gagah Athallah Fatha is a Business Analyst, Supply Chain Analyst, Data Analyst, and AI Engineer with expertise in business analysis, supply chain optimization, web development, data analytics, artificial intelligence, and machine learning from Institut Teknologi Bandung (ITB).",
  applicationName: "Gagah Athallah Fatha Portfolio",
  authors: [{ name: "Gagah Athallah Fatha", url: baseUrl.toString() }],
  generator: "Next.js",
  keywords: [
    "Gagah Athallah Fatha",
    "Gagah",
    "Gagah Fatha",
    "Athallah Fatha",
    "lafatha",
    "Business Analyst",
    "Supply Chain Analyst",
    "Technology and Transformation Consulting Intern",
    "Technology Consulting",
    "Deloitte Intern",
    "Data Analyst",
    "AI Engineer",
    "Artificial Intelligence",
    "Machine Learning",
    "Enterprise ERP",
    "ERP System",
    "Supply Chain Management",
    "Supply Chain Optimization",
    "Operations Management",
    "SAP",
    "Ivalua",
    "Bandung Institute of Technology",
    "Institut Teknologi Bandung",
    "ITB",
    "SBM ITB",
    "Project Manager",
    "Project Management",
    "Portfolio",
    "Software Engineer",
    "Web Developer",
  ],
  creator: "Gagah Athallah Fatha",
  publisher: "Gagah Athallah Fatha",
  manifest: "/manifest.json",
  icons: {
    icon: "/jadi.svg",
    apple: "/jadi.svg",
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "id-ID": "/",
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    url: baseUrl.toString(),
    type: "profile",
    title: `${siteName} - Portfolio`,
    description:
      "Portfolio of Gagah Athallah Fatha — Business Analyst, Supply Chain Analyst, Data Analyst, and AI Engineer specializing in business analysis, supply chain optimization, web development, AI and data systems, and enterprise solutions.",
    siteName,
    locale: "en_US",
    alternateLocale: ["id_ID"],
    images: [
      {
        url: "/ITBlack.png",
        width: 1200,
        height: 630,
        alt: "Gagah Athallah Fatha Portfolio",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} - Portfolio`,
    description:
      "Business Analyst, Supply Chain Analyst, Data Analyst, and AI Engineer focused on building clear, data-driven and AI-enabled systems.",
    images: ["/ITBlack.png"],
    creator: "@athallahfatha",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationSchema) }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
