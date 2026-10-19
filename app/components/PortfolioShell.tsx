"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import TabNavigation, { TabType } from "./TabNavigation";
import Footer from "./Footer";
import ChatPanel from "./ChatPanel";
import Education from "./Education";
import Experience from "./Experience";
import Skills from "./Skills";
import GitHubActivity from "./GitHubActivity";
import Projects from "./Projects";
import Posts from "./Posts";
import GallerySection from "./GallerySection";

interface PortfolioShellProps {
  initialTab: TabType;
}

const tabRoutes: Record<string, TabType> = {
  "/": "profile",
  "/projects": "portfolio",
  "/project": "portfolio",
  "/posts": "posts",
  "/post": "posts",
  "/gallery": "gallery",
};

const routePaths: Record<TabType, string> = {
  profile: "/",
  portfolio: "/projects",
  posts: "/posts",
  gallery: "/gallery",
  chat: "/",
};

export default function PortfolioShell({ initialTab }: PortfolioShellProps) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [lastContentTab, setLastContentTab] = useState<TabType>(initialTab);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Synchronize when the user presses back or forward in the browser
  useEffect(() => {
    function handlePopState() {
      const pathname = window.location.pathname;
      const matchedTab = tabRoutes[pathname] || "profile";
      setActiveTab(matchedTab);
      setLastContentTab(matchedTab);
      setIsChatOpen(false);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function handleTabChange(tab: TabType) {
    if (tab === "chat") {
      setActiveTab("chat");
      setIsChatOpen(true);
    } else {
      setActiveTab(tab);
      setLastContentTab(tab);
      setIsChatOpen(false);
      const targetPath = routePaths[tab];
      if (targetPath && window.location.pathname !== targetPath) {
        window.history.pushState({ tab }, "", targetPath);
      }
    }
  }

  function handleCloseChat() {
    setIsChatOpen(false);
    setActiveTab(lastContentTab);
  }

  const currentDisplayTab = activeTab === "chat" ? lastContentTab : activeTab;

  return (
    <main className="min-h-screen flex justify-center relative overflow-x-hidden">
      <div className="relative w-full max-w-3xl min-h-screen border-x-0 md:border-x border-[#f0f0f0] dark:border-[#242424] px-8 md:px-12 pt-0 pb-8">
        {/* Left side hatched strip */}
        <div
          className="hidden md:block absolute top-0 bottom-0 right-full w-4 border-l border-[#f0f0f0] dark:border-[#242424] pointer-events-none side-hatched-pattern"
          aria-hidden="true"
        />
        {/* Right side hatched strip */}
        <div
          className="hidden md:block absolute top-0 bottom-0 left-full w-4 border-r border-[#f0f0f0] dark:border-[#242424] pointer-events-none side-hatched-pattern"
          aria-hidden="true"
        />

        <Navbar />
        <Hero />
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

        <div className="mt-4">
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
