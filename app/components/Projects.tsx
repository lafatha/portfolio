"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronRight, Link } from "lucide-react";

const projects = [
  { name: "Base Realms", url: "#", hasPreview: true, projectKey: "baseRealms" },
  { name: "ERP System", url: "#", hasPreview: true, projectKey: "erpSystem" },
];

const baseRealmsImages = [
  "/baserealms/1.jpeg",
  "/baserealms/2.jpeg",
  "/baserealms/3.jpeg",
  "/baserealms/4.jpeg",
  "/baserealms/5.jpeg",
];

const erpSystemImages = ["/stock/stock.jpg"];

const projectDescriptions: { [key: string]: string } = {
  baseRealms:
    "Base Realms is a transparent, skill-based onchain RPG built on Base that separates gameplay from speculation, using ERC-721 characters and ERC-1155 items to create verifiable ownership without gambling mechanics. It transforms battles into the core economic engine, where rewards are earned through seasonal performance and fully enforced by smart contracts. Designed for crypto-native and normie users alike, Base Realms integrates multi-currency payments and QRIS onboarding to make onchain gaming accessible, fair, and consumer-ready.",
  erpSystem:
    "Supply Chain Management system built as an internal ERP solution. It centralizes inventory tracking, stock monitoring, transaction management, invoicing, PDF reporting, and analytics into a single dashboard interface. The system provides real-time stock visibility, low-stock alerts, monthly revenue tracking, and structured order workflows to streamline operational efficiency. It also includes a locally hosted, private AI assistant for internal data queries and decision support, ensuring company data remains secure and confidential. Due to company privacy policies, additional system modules and screenshots cannot be publicly shared. Overall, the platform functions as a lightweight ERP tailored for operational control, financial tracking, and supply chain optimization.",
};

const projectImages: { [key: string]: string[] } = {
  baseRealms: baseRealmsImages,
  erpSystem: erpSystemImages,
};

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

  const handleProjectClick = (
    e: React.MouseEvent,
    projectName: string,
    hasPreview: boolean,
    projectKey: string,
  ) => {
    if (hasPreview) {
      e.preventDefault();
      setExpandedProject(expandedProject === projectKey ? null : projectKey);
    }
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
              <a
                href={project.url}
                onClick={(e) =>
                  handleProjectClick(e, project.name, project.hasPreview, project.projectKey)
                }
                target={project.hasPreview ? undefined : "_blank"}
                rel={project.hasPreview ? undefined : "noopener noreferrer"}
                className="project-row group"
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
              </a>

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
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed mt-4 max-w-4xl">
                    {projectDescriptions[project.projectKey]}
                  </p>
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
          className="fixed inset-0 z-40 flex items-center justify-center bg-neutral-900/70"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-3xl w-full px-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative w-full aspect-video md:aspect-[16/9] rounded-xl overflow-hidden">
              <Image src={lightboxImage} alt="Project preview" fill className="object-contain" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
