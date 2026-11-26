"use client";

/* 12x12 pixel-art tab icons; "#" = filled pixel */
const PIXEL_ICONS = {
  profile: [
    "....####....",
    "...#....#...",
    "...#....#...",
    "...#....#...",
    "....####....",
    "............",
    "...######...",
    "..#......#..",
    ".#........#.",
    ".#........#.",
    ".##########.",
    "............",
  ],
  projects: [
    "............",
    "....####....",
    "....#..#....",
    ".##########.",
    ".#........#.",
    ".#........#.",
    ".####..####.",
    ".#...##...#.",
    ".#........#.",
    ".#........#.",
    ".##########.",
    "............",
  ],
  posts: [
    "..######....",
    "..#....##...",
    "..#....#.#..",
    "..#....####.",
    "..#.......#.",
    "..#.####..#.",
    "..#.......#.",
    "..#.#####.#.",
    "..#.......#.",
    "..#.###...#.",
    "..#.......#.",
    "..#########.",
  ],
  gallery: [
    "............",
    "############",
    "#..........#",
    "#.......##.#",
    "#.......##.#",
    "#..........#",
    "#...#......#",
    "#..###..#..#",
    "#.#####.##.#",
    "#.##########",
    "############",
    "............",
  ],
  chat: [
    "............",
    ".##########.",
    "#..........#",
    "#..........#",
    "#..#..#..#.#",
    "#..........#",
    "#..........#",
    ".##...#####.",
    "...#.#......",
    "....#.......",
    "............",
    "............",
  ],
};

type PixelIconName = keyof typeof PIXEL_ICONS;

/** one SVG path per icon: each horizontal run of pixels becomes a rectangle */
function pixelPath(rows: string[]) {
  let d = "";
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== "#") continue;
      let w = 1;
      while (row[x + w] === "#") w++;
      d += `M${x} ${y}h${w}v1h-${w}z`;
      x += w - 1;
    }
  });
  return d;
}

const PIXEL_PATHS = Object.fromEntries(
  Object.entries(PIXEL_ICONS).map(([name, rows]) => [name, pixelPath(rows)]),
) as Record<PixelIconName, string>;

function PixelIcon({ name, className = "" }: { name: PixelIconName; className?: string }) {
  return (
    <svg viewBox="0 0 12 12" width={18} height={18} shapeRendering="crispEdges" aria-hidden="true" className={className}>
      <path d={PIXEL_PATHS[name]} fill="currentColor" />
    </svg>
  );
}

export type TabType = "profile" | "portfolio" | "posts" | "gallery" | "chat";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TabNavigation({
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  const tabs: { id: TabType; label: string; href: string | null; icon: PixelIconName }[] = [
    { id: "profile" as const, label: "Profile", href: "/", icon: "profile" },
    { id: "portfolio" as const, label: "Projects", href: "/projects", icon: "projects" },
    { id: "posts" as const, label: "Posts", href: "/posts", icon: "posts" },
    { id: "gallery" as const, label: "Gallery", href: "/gallery", icon: "gallery" },
    { id: "chat" as const, label: "Chat", href: null, icon: "chat" },
  ];

  return (
    <nav
      aria-label="Portfolio Sections"
      className="-mx-8 md:-mx-12 px-8 md:px-12 border-y border-line mt-6 mb-6"
    >
      <div className="grid grid-cols-5 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const commonClassName = `tab-underline-btn group relative h-12 flex items-center justify-center cursor-pointer border-b-2 transition-colors duration-200 outline-none focus:outline-none select-none ${
            isActive
              ? "active-tab border-black dark:border-white text-black dark:text-white font-medium"
              : "border-transparent text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 font-normal"
          }`;

          const content = (
            <div className="flex items-center justify-center">
              <PixelIcon
                name={tab.icon}
                className="shrink-0 transition-transform duration-200 group-hover:-translate-y-px"
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
