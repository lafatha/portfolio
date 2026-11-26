"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { projects, projectDescriptions } from "@/app/data/portfolio";
import { ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Globe } from "lucide-react";


const internalIntelligenceImages = [
  "/intelligence/0.png",
  "/intelligence/3.png",
  "/intelligence/2.png",
  "/intelligence/4.png",
  "/intelligence/1.png",
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

const erptaImages = [
  "/erpta/1.webp",
  "/erpta/2.webp",
  "/erpta/3.webp",
  "/erpta/4.webp",
  "/erpta/5.webp",
];

const erpSystemImages = ["/stock/stock.webp"];


const projectImages: { [key: string]: string[] } = {
  erpta: erptaImages,
  internalIntelligence: internalIntelligenceImages,
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
                loading={imgIndex === 0 ? "eager" : "lazy"}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const CLAMP = "project-description-clamp-2";

// Paragraph that animates between a 2-line clamp and its full height.
function ProjectDescription({ text, expanded }: { text: string; expanded: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const first = useRef(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (first.current) {
      first.current = false;
      return;
    }
    const lh = parseFloat(getComputedStyle(el).lineHeight) || 18;
    const done = () => {
      el.removeEventListener("transitionend", done);
      el.style.height = "";
      el.style.overflow = "";
      if (!expanded) el.classList.add(CLAMP);
    };
    el.style.transition = "none";
    el.style.overflow = "hidden"; // clip the text while the height animates
    const from = el.offsetHeight;
    el.classList.remove(CLAMP);
    const to = expanded ? el.scrollHeight : lh * 2;
    el.style.height = `${from}px`;
    void el.offsetHeight;
    el.style.transition = "height 300ms ease-out";
    el.style.height = `${to}px`;
    el.addEventListener("transitionend", done);
    return () => el.removeEventListener("transitionend", done);
  }, [expanded]);

  return (
    <p
      ref={ref}
      className={`text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed text-justify whitespace-pre-line ${CLAMP}`}
    >
      {text}
    </p>
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

                {project.hasPreview && (
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                    aria-hidden={!isOpen}
                    inert={!isOpen}
                  >
                  <div className="overflow-hidden min-h-0">
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

                            <ProjectDescription
                              text={fullDescription}
                              expanded={isDescriptionExpanded}
                            />

                            <div className="mt-2 flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedDescriptionByProject((prev) => ({
                                    ...prev,
                                    [project.projectKey]: !isDescriptionExpanded,
                                  }))
                                }
                                className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 transition-colors cursor-pointer select-none font-medium"
                              >
                                {isDescriptionExpanded ? (
                                  <>
                                    <ChevronUp size={13} className="shrink-0" />
                                    <span>Show less</span>
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown size={13} className="shrink-0" />
                                    <span>Show more</span>
                                  </>
                                )}
                              </button>

                              {project.projectKey !== "erpSystem" && (
                                <a
                                  href={project.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                                  title="Live Demo"
                                  aria-label="Live Demo"
                                >
                                  <Globe
                                    size={14}
                                    className="shrink-0 text-current transition-colors"
                                  />
                                </a>
                              )}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
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
