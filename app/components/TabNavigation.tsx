"use client";

import { User, Briefcase, FileText, Image as ImageIcon, MessageSquare } from "lucide-react";

export type TabType = "profile" | "portfolio" | "posts" | "gallery" | "chat";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TabNavigation({
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  const tabs = [
    { id: "profile" as const, label: "Profile", href: "/", icon: User },
    { id: "portfolio" as const, label: "Projects", href: "/projects", icon: Briefcase },
    { id: "posts" as const, label: "Posts", href: "/posts", icon: FileText },
    { id: "gallery" as const, label: "Gallery", href: "/gallery", icon: ImageIcon },
    { id: "chat" as const, label: "Chat", href: null, icon: MessageSquare },
  ];

  return (
    <nav
      aria-label="Portfolio Sections"
      className="-mx-8 md:-mx-12 px-8 md:px-12 border-y border-[#f0f0f0] dark:border-[#242424] mt-6 mb-6"
    >
      <div className="grid grid-cols-5 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const commonClassName = `tab-underline-btn group relative h-12 flex items-center justify-center cursor-pointer border-b-2 transition-colors duration-200 outline-none focus:outline-none select-none ${
            isActive
              ? "active-tab border-black dark:border-white text-black dark:text-white font-medium"
              : "border-transparent text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 font-normal"
          }`;

          const content = (
            <div className="flex items-center justify-center">
              <Icon
                size={20}
                strokeWidth={isActive ? 1.75 : 1.4}
                className="shrink-0 transition-transform duration-200"
              />
              <span
                className={`tab-label-text hidden md:inline-block overflow-hidden whitespace-nowrap text-sm tracking-tight transition-all duration-300 ease-out ${
                  isActive
                    ? "max-w-[120px] opacity-100 ml-2"
                    : "max-w-0 opacity-0 ml-0"
                }`}
              >
                {tab.label}
              </span>
            </div>
          );

          if (tab.href) {
            return (
              <a
                key={tab.id}
                href={tab.href}
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
                    e.preventDefault();
                    onTabChange(tab.id);
                  }
                }}
                className={commonClassName}
                title={tab.label}
                aria-label={tab.label}
              >
                {content}
              </a>
            );
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={commonClassName}
              title={tab.label}
              aria-label={tab.label}
            >
              {content}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
