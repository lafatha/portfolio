"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft, Globe } from "lucide-react";

const projects = [
  {
    name: "Narratio AI",
    date: "April 2026",
    url: "https://narrativoai-sable.vercel.app/",
    hasPreview: true,
    projectKey: "narratioAi",
  },
  {
    name: "Base Realms",
    date: "January 2026",
    url: "https://www.baserealms.app/",
    hasPreview: true,
    projectKey: "baseRealms",
  },
  {
    name: "ERP System",
    date: "December 2025",
    url: "#",
    hasPreview: true,
    projectKey: "erpSystem",
  },
];

const narratioAiImages = [
  "/narratio/0.webp",
  "/narratio/1.webp",
  "/narratio/2.webp",
  "/narratio/3.webp",
  "/narratio/4.webp",
  "/narratio/5.webp",
  "/narratio/6.webp",
];

const baseRealmsImages = [
  "/baserealms/1.webp",
  "/baserealms/2.webp",
  "/baserealms/3.webp",
  "/baserealms/4.webp",
  "/baserealms/5.webp",
];

const erpSystemImages = ["/stock/stock.webp"];

const projectDescriptions: { [key: string]: string | string[] } = {
  narratioAi: [
    "Narratio AI is a machine learning powered platform designed to help users convert raw data, web insights, and conversations into structured business narratives and consulting style presentation decks. The system combines advanced AI reasoning with classical machine learning models to deliver actionable insights. Large Language Models, such as Qwen 3.6 Plus, are used to generate structured slides that highlight business implications, translate analysis into clear narratives, and maintain a polished consulting style. Users interact via a natural language interface, providing context or data, and the platform transforms it into modular slide components with logical flow, charts, and recommendations, enabling an end to end workflow from research and analysis to presentation-ready outputs.",
    "On the machine learning side, Narratio integrates multiple pipelines to enhance data-driven decision making. Python scripts are used to scrape relevant data from websites, such as news, market reports, and public sources. This unstructured text is processed with a Bidirectional Long Short Term Memory (BiLSTM) model for sentiment analysis, extracting positive, negative, or neutral signals with contextual understanding. These structured sentiment insights are then combined with LLM reasoning to generate slides that reflect market trends, business risks, and strategic recommendations. By merging web scraping, BiLSTM sentiment modeling, and LLM based slide generation, Narratio not only produces visually professional decks but also functions as a machine learning powered business intelligence assistant that supports data-driven consulting decisions.",
  ],
  baseRealms:
    "Base Realms is a transparent, skill-based onchain RPG built on Base that separates gameplay from speculation, using ERC-721 characters and ERC-1155 items to create verifiable ownership without gambling mechanics. It transforms battles into the core economic engine, where rewards are earned through seasonal performance and fully enforced by smart contracts. Designed for crypto-native and normie users alike, Base Realms integrates multi-currency payments and QRIS onboarding to make onchain gaming accessible, fair, and consumer-ready.",
  erpSystem:
    "Supply Chain Management system built as an internal ERP solution. It centralizes inventory tracking, stock monitoring, transaction management, invoicing, PDF reporting, and analytics into a single dashboard interface. The system provides real-time stock visibility, low-stock alerts, monthly revenue tracking, and structured order workflows to streamline operational efficiency. It also includes a locally hosted, private AI assistant for internal data queries and decision support, ensuring company data remains secure and confidential. Due to company privacy policies, additional system modules and screenshots cannot be publicly shared. Overall, the platform functions as a lightweight ERP tailored for operational control, financial tracking, and supply chain optimization.",
};

const projectImages: { [key: string]: string[] } = {
  narratioAi: narratioAiImages,
  baseRealms: baseRealmsImages,
  erpSystem: erpSystemImages,
};

function paragraphsForProject(projectKey: string): string[] {
  const raw = projectDescriptions[projectKey];
  return Array.isArray(raw) ? raw : [raw];
}

function ProjectCarousel({
  images,
  projectName,
  onImageClick,
}: {
  images: string[];
  projectName: string;
  onImageClick: (img: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const dragStateRef = useRef({ startX: 0, scrollLeft: 0 });

  const totalImages = images.length;

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft } = scrollRef.current;
    const cardWidth = window.innerWidth >= 768 ? 296 : 226;
    const calculatedIndex = Math.round(scrollLeft / cardWidth) + 1;
    const clampedIndex = Math.min(totalImages, Math.max(1, calculatedIndex));
    setCurrentIndex(clampedIndex);
  };

  const scrollByDirection = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = window.innerWidth >= 768 ? 296 : 226;
    const delta = dir === "left" ? -cardWidth : cardWidth;
    scrollRef.current.scrollBy({ left: delta, behavior: "smooth" });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStateRef.current = {
      startX: e.clientX,
      scrollLeft: scrollRef.current.scrollLeft,
    };
  };

  const stopDragging = () => {
    isDraggingRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    e.preventDefault();
    const deltaX = e.clientX - dragStateRef.current.startX;
    if (Math.abs(deltaX) > 3) {
      hasDraggedRef.current = true;
    }
    scrollRef.current.scrollLeft = dragStateRef.current.scrollLeft - deltaX;
  };

  return (
    <div className="relative group mb-4">
      {totalImages > 1 && (
        <div className="absolute top-2 right-2 z-20 bg-neutral-900/80 dark:bg-neutral-800/90 text-white text-[11px] font-medium px-2.5 py-0.5 rounded-md backdrop-blur-md pointer-events-none select-none shadow-sm">
          {currentIndex}/{totalImages}
        </div>
      )}

      {totalImages > 1 && (
        <button
          type="button"
          onClick={() => scrollByDirection("left")}
          disabled={currentIndex <= 1}
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-neutral-900/80 dark:bg-neutral-800/90 text-white shadow-lg flex items-center justify-center transition-all duration-200 ${
            currentIndex <= 1
              ? "opacity-0 pointer-events-none"
              : "opacity-90 md:opacity-0 md:group-hover:opacity-100 hover:scale-110 cursor-pointer"
          }`}
          aria-label="Previous image"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      {totalImages > 1 && (
        <button
          type="button"
          onClick={() => scrollByDirection("right")}
          disabled={currentIndex >= totalImages}
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-neutral-900/80 dark:bg-neutral-800/90 text-white shadow-lg flex items-center justify-center transition-all duration-200 ${
            currentIndex >= totalImages
              ? "opacity-0 pointer-events-none"
              : "opacity-90 md:opacity-0 md:group-hover:opacity-100 hover:scale-110 cursor-pointer"
          }`}
          aria-label="Next image"
        >
          <ChevronRight size={18} />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide cursor-grab select-none scroll-smooth"
        onMouseDown={handleMouseDown}
        onMouseLeave={stopDragging}
        onMouseUp={stopDragging}
        onMouseMove={handleMouseMove}
      >
        {images.map((image, imgIndex) => (
          <div key={imgIndex} className="flex-shrink-0">
            <button
              type="button"
              className="relative w-[210px] aspect-video md:w-[280px] rounded-lg overflow-hidden cursor-pointer"
              onClick={() => {
                if (hasDraggedRef.current) return;
                onImageClick(image);
              }}
            >
              <Image
                src={image}
                alt={`${projectName} ${imgIndex + 1}`}
                fill
                className="object-cover"
                draggable={false}
                sizes="(min-width: 768px) 280px, 210px"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Projects() {
  const [openProjects, setOpenProjects] = useState<Record<string, boolean>>({
    narratioAi: true,
    baseRealms: true,
    erpSystem: true,
  });
  const [expandedDescriptionByProject, setExpandedDescriptionByProject] = useState<
    Record<string, boolean>
  >({});
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    if (!lightboxImage) return;

    const handleScroll = () => {
      setLightboxImage(null);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lightboxImage]);

  return (
    <>
      <section className="projects-section">
        <div className="projects-header">
          <h2 className="projects-title">Projects</h2>
        </div>
        <div className="projects-list">
          {projects.map((project, index) => {
            const isOpen = openProjects[project.projectKey] !== false;
            return (
              <div key={index}>
                <button
                  type="button"
                  onClick={() =>
                    setOpenProjects((prev) => ({
                      ...prev,
                      [project.projectKey]: !isOpen,
                    }))
                  }
                  className="project-row group w-full text-left"
                >
                  <div className="project-row-group">
                    <ChevronRight
                      size={18}
                      className={`text-neutral-400 group-hover:text-neutral-600 transition-transform duration-200 ${
                        isOpen ? "rotate-90 text-neutral-600" : ""
                      }`}
                    />
                    <span>{project.name}</span>
                  </div>
                  <span className="text-xs text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 font-normal transition-colors">
                    {project.date}
                  </span>
                </button>

                {project.hasPreview && isOpen && (
                  <div className="mt-4 mb-4 px-2">
                    <div className="mt-4 max-w-4xl">
                      {(() => {
                        const isDescriptionExpanded = Boolean(
                          expandedDescriptionByProject[project.projectKey]
                        );
                        const fullDescription = paragraphsForProject(
                          project.projectKey
                        ).join("\n\n");
                        const images = projectImages[project.projectKey] || [];
                        return (
                          <>
                            <ProjectCarousel
                              images={images}
                              projectName={project.name}
                              onImageClick={(img) => setLightboxImage(img)}
                            />

                            <p
                              className={`text-xs text-neutral-600 leading-relaxed text-justify whitespace-pre-line ${
                                isDescriptionExpanded ? "" : "project-description-clamp-4"
                              }`}
                            >
                              {fullDescription}
                            </p>

                            <button
                              type="button"
                              onClick={() =>
                                setExpandedDescriptionByProject((prev) => ({
                                  ...prev,
                                  [project.projectKey]: !isDescriptionExpanded,
                                }))
                              }
                              className="mt-2 block text-xs text-blue-500 hover:text-blue-600 transition-colors"
                            >
                              {isDescriptionExpanded ? "Show less" : "Show more"}
                            </button>

                            {project.projectKey !== "erpSystem" && (
                              <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                              >
                                <Globe
                                  size={14}
                                  className="shrink-0 text-current transition-colors"
                                />
                                <span className="font-normal text-current">
                                  Live Demo
                                </span>
                              </a>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {lightboxImage && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-neutral-900/70"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-3xl w-full px-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative w-full aspect-video md:aspect-[16/9] rounded-xl overflow-hidden">
              <Image
                src={lightboxImage}
                alt="Project preview"
                fill
                className="object-contain"
                sizes="(min-width: 1024px) 768px, 100vw"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
