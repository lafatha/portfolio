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
    <div className="-mx-8 md:-mx-12 px-8 md:px-12 border-y border-[#f0f0f0] dark:border-[#242424] mt-6 mb-6">

      <div className="grid grid-cols-5 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`tab-underline-btn group relative h-12 flex items-center justify-center cursor-pointer border-b-2 transition-colors duration-200 outline-none focus:outline-none select-none ${
                isActive
                  ? "active-tab border-black dark:border-white text-black dark:text-white font-medium"
                  : "border-transparent text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 font-normal"
              }`}
              title={tab.label}
              aria-label={tab.label}
            >
              <div className="flex items-center justify-center">
                <Icon
                  size={20}
                  strokeWidth={isActive ? 1.75 : 1.4}
                  className="shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5"
                />
                <span
                  className={`tab-label-text inline-block overflow-hidden whitespace-nowrap text-sm tracking-tight ${
                    isActive
                      ? "max-w-[120px] opacity-100 ml-2"
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




