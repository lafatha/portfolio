import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Gagah Athallah Fatha - Portfolio",
  description: "Gagah Athallah Fatha is a Fullstack Developer, Business Analyst, and Supply Chain Analyst with expertise in web development, business analysis, and supply chain optimization. Currently studying at Bandung Institute of Technology (ITB), he builds innovative solutions including onchain gaming platforms and enterprise ERP systems.",
  manifest: "/manifest.json",
  keywords: ["Gagah Athallah Fatha", "Fullstack Developer", "Business Analyst", "Supply Chain Analyst", "Portfolio", "Web Developer", "Next.js", "React", "TypeScript", "Base Realms", "ERP System"],
  icons: {
    icon: [
      {
        url: "https://media.licdn.com/dms/image/v2/D5603AQGkk3iMMULGDQ/profile-displayphoto-scale_200_200/B56ZraU.2DI8AY-/0/1764599527154?e=1772668800&v=beta&t=Z4KXmxxOc-lQ-nvq5AW_O4uYifdm4NfaCNfGj_CvqQs",
        type: "image/jpeg",
      },
    ],
    apple: [
      {
        url: "https://media.licdn.com/dms/image/v2/D5603AQGkk3iMMULGDQ/profile-displayphoto-scale_200_200/B56ZraU.2DI8AY-/0/1764599527154?e=1772668800&v=beta&t=Z4KXmxxOc-lQ-nvq5AW_O4uYifdm4NfaCNfGj_CvqQs",
        type: "image/jpeg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[#f5f5f5] text-neutral-900 font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
