import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
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
  ],
  icons: {
    icon: "/jadi.svg",
    apple: "/jadi.svg",
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
