"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronRight, Link } from "lucide-react";

const projects = [
  { name: "Narratio AI", url: "#", hasPreview: true, projectKey: "narratioAi" },
  { name: "Base Realms", url: "#", hasPreview: true, projectKey: "baseRealms" },
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
    "Narratio AI is a machine learning driven platform designed to transform raw ideas, conversations, and external data into structured business insights and consultant style presentation decks. The system leverages multiple Large Language Models to handle different layers of reasoning and generation. For example, models such as Qwen 3.6 Plus are used for deeper business process analysis and structured problem solving, while faster models such as Gemini Flash and MiniMax support rapid drafting and responsive interactions. Through a conversational interface, users can describe a problem, dataset, or hypothesis in natural language, and the system interprets context, generates analytical narratives, and converts them into modular slide components. This creates an end to end workflow from ideation and analysis to polished presentation output within a single environment.",
    "On the data and machine learning side, Narratio AI integrates both modern language models and classical deep learning approaches to improve analytical depth. External data is collected through web scraping pipelines built in Python, gathering information from sources such as news articles, market reports, and public websites. This unstructured data is processed using a Bidirectional Long Short Term Memory model to extract market sentiment signals by classifying text into positive, negative, or neutral categories with contextual understanding. These structured sentiment outputs are then combined with language model reasoning to enrich insights and improve decision quality. By combining web scraped data, sentiment modeling, and multi model orchestration, Narratio functions not only as a presentation generator but also as a lightweight business intelligence system that connects raw data with strategic storytelling.",
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
                  <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide cursor-grab select-none"
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
                  <div className="mt-4 max-w-4xl space-y-2">
                    {paragraphsForProject(project.projectKey).map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className="text-xs text-neutral-600 leading-relaxed text-justify"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {project.projectKey === "baseRealms" && (
                    <a
                      href="https://www.baserealms.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-xs text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                      <Link
                        size={14}
                        className="text-neutral-400 group-hover:text-neutral-600 transition-colors"
                      />
                      <span>Click here to see the Project</span>
                    </a>
                  )}
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
