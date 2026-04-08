"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronRight, Link } from "lucide-react";

const projects = [
  {
    name: "Narratio AI",
    url: "https://narrativoai-sable.vercel.app/",
    hasPreview: true,
    projectKey: "narratioAi",
  },
  {
    name: "Base Realms",
    url: "https://www.baserealms.app/",
    hasPreview: true,
    projectKey: "baseRealms",
  },
  { name: "ERP System", url: "#", hasPreview: true, projectKey: "erpSystem" },
];

const narratioAiImages = [
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

export default function Projects() {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [expandedDescriptionByProject, setExpandedDescriptionByProject] = useState<
    Record<string, boolean>
  >({});
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const dragStateRef = useRef({ startX: 0, scrollLeft: 0 });

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
          {projects.map((project, index) => (
            <div key={index}>
              <button
                type="button"
                onClick={() =>
                  setExpandedProject(expandedProject === project.projectKey ? null : project.projectKey)
                }
                className="project-row group w-full text-left"
              >
                <div className="project-row-group">
                  <ChevronRight
                    size={18}
                    className="text-neutral-400 group-hover:text-neutral-600 transition-colors"
                  />
                  <span>{project.name}</span>
                </div>
                <Link
                  size={14}
                  className="text-neutral-400 group-hover:text-neutral-600 transition-colors"
                />
              </button>

              {project.hasPreview && expandedProject === project.projectKey && (
                <div className="mt-4 mb-4 px-2">
                  <div className="mt-4 max-w-4xl">
                    {(() => {
                      const isDescriptionExpanded = Boolean(
                        expandedDescriptionByProject[project.projectKey]
                      );
                      const fullDescription = paragraphsForProject(project.projectKey).join("\n\n");
                      return (
                        <>
                          <p
                            className={`text-xs text-neutral-600 leading-relaxed text-justify whitespace-pre-line ${
                              isDescriptionExpanded ? "" : "project-description-clamp-4"
                            }`}
                          >
                            {fullDescription}
                          </p>
                          {project.projectKey !== "erpSystem" && (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 inline-flex items-center gap-2 text-xs text-neutral-600 hover:text-neutral-900 transition-colors"
                            >
                              <Link
                                size={14}
                                className="text-neutral-400 group-hover:text-neutral-600 transition-colors"
                              />
                              <span className="font-semibold">Click here to see the Project</span>
                            </a>
                          )}
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

                          <div
                            ref={scrollRef}
                            className="mt-4 flex gap-4 overflow-x-auto pb-4 scrollbar-hide cursor-grab select-none"
                            onMouseDown={handleMouseDown}
                            onMouseLeave={stopDragging}
                            onMouseUp={stopDragging}
                            onMouseMove={handleMouseMove}
                          >
                            {projectImages[project.projectKey]?.map((image, imgIndex) => (
                              <div key={imgIndex} className="flex-shrink-0">
                                <button
                                  type="button"
                                  className="relative w-[210px] aspect-video md:w-[280px] rounded-lg overflow-hidden cursor-pointer"
                                  onClick={() => {
                                    if (hasDraggedRef.current) {
                                      return;
                                    }
                                    setLightboxImage(image);
                                  }}
                                >
                                  <Image
                                    src={image}
                                    alt={`${project.name} ${imgIndex + 1}`}
                                    fill
                                    className="object-cover"
                                    draggable={false}
                                    sizes="(min-width: 768px) 280px, 210px"
                                  />
                                </button>
                              </div>
                            ))}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          ))}
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
