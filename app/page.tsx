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
import ChatPanel from "./components/ChatPanel";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [lastContentTab, setLastContentTab] = useState<TabType>("profile");
  const [isChatOpen, setIsChatOpen] = useState(false);

  function handleTabChange(tab: TabType) {
    if (tab === "chat") {
      setActiveTab("chat");
      setIsChatOpen(true);
    } else {
      setActiveTab(tab);
      setLastContentTab(tab);
      setIsChatOpen(false);
    }
  }

  function handleCloseChat() {
    setIsChatOpen(false);
    setActiveTab(lastContentTab);
  }

  const currentDisplayTab = activeTab === "chat" ? lastContentTab : activeTab;

  return (
    <main className="min-h-screen flex justify-center">
      <div className="relative w-full max-w-3xl min-h-screen border-x-0 md:border-x border-[#f0f0f0] dark:border-[#242424] px-8 md:px-12 pt-0 pb-8">




        <Navbar />
        <Hero />
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

        <div className="mt-4 transition-all duration-300">
          {currentDisplayTab === "profile" && (
            <>
              <Education />
              <Experience />
              <Skills />
              <GitHubActivity />
            </>
          )}

          {currentDisplayTab === "portfolio" && <Projects />}

          {currentDisplayTab === "posts" && <Posts />}

          {currentDisplayTab === "gallery" && <GallerySection />}
        </div>

        <Footer />

        <ChatPanel isOpen={isChatOpen} onClose={handleCloseChat} />
      </div>
    </main>
  );
}

