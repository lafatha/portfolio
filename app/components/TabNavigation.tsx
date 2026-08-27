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
  const tabs: { id: TabType; label: string; icon: typeof User }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "portfolio", label: "Projects", icon: Briefcase },

    { id: "posts", label: "Posts", icon: FileText },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
    { id: "chat", label: "Chat", icon: MessageSquare },
  ];

  return (
    <div className="-mx-8 md:-mx-12 px-8 md:px-12 border-y border-neutral-200 dark:border-neutral-800 mt-6 mb-6">
      <div className="grid grid-cols-5 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`tab-underline-btn relative h-12 flex items-center justify-center cursor-pointer border-b-2 transition-all duration-200 outline-none focus:outline-none select-none ${
                isActive
                  ? "active-tab border-neutral-900 dark:border-neutral-100 text-black dark:text-white font-semibold"
                  : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white font-normal"
              }`}
              title={tab.label}
              aria-label={tab.label}
            >

              <div className="flex items-center justify-center">
                <Icon
                  size={20}
                  strokeWidth={isActive ? 1.75 : 1.4}
                  className="shrink-0 transition-transform duration-200"
                />
                <span
                  className={`inline-block overflow-hidden whitespace-nowrap text-sm tracking-tight transition-all duration-300 ease-out ${
                    isActive
                      ? "max-w-24 opacity-100 ml-2"
                      : "max-w-0 opacity-0 ml-0"
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}




