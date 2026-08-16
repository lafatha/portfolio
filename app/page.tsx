"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TabNavigation, { TabType } from "./components/TabNavigation";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import GitHubActivity from "./components/GitHubActivity";
import Posts from "./components/Posts";
import GallerySection from "./components/GallerySection";
import Footer from "./components/Footer";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  return (
    <main className="min-h-screen flex justify-center">
      <div className="relative w-full max-w-3xl min-h-screen border-x border-neutral-200 px-8 md:px-12 pt-0 pb-8">
        <Navbar />
        <Hero />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-4 transition-all duration-300">
          {activeTab === "profile" && (
            <>
              <Education />
              <Experience />
              <Skills />
              <GitHubActivity />
            </>
          )}

          {activeTab === "portfolio" && <Projects />}

          {activeTab === "posts" && <Posts />}

          {activeTab === "gallery" && <GallerySection />}
        </div>

        <Footer />
      </div>
    </main>
  );
}
