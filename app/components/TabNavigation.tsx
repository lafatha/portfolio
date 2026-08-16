"use client";

import { User, Briefcase, FileText, Image as ImageIcon } from "lucide-react";

export type TabType = "profile" | "portfolio" | "posts" | "gallery";

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
    { id: "portfolio", label: "Portfolio", icon: Briefcase },
    { id: "posts", label: "Posts", icon: FileText },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
  ];

  return (
    <div className="-mx-8 md:-mx-12 px-8 md:px-12 border-y border-neutral-200 py-4 mt-6 mb-6">
      <div className="flex items-center justify-center gap-16 md:gap-24 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className="tab-btn relative p-1.5 flex items-center justify-center cursor-pointer border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none bg-transparent select-none group"
              title={tab.label}
              aria-label={tab.label}
            >
              <Icon
                size={22}
                className={`transition-all duration-200 ${
                  isActive
                    ? "text-neutral-900 scale-110"
                    : "text-neutral-400 hover:text-neutral-700 hover:scale-105"
                }`}
                strokeWidth={isActive ? 2.2 : 1.5}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
