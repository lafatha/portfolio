"use client";

import { useState } from "react";
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

const erpSystemImages = [
  "/stock/stock.jpg",
];

const projectDescriptions: { [key: string]: string } = {
  baseRealms: "Base Realms is a transparent, skill-based onchain RPG built on Base that separates gameplay from speculation, using ERC-721 characters and ERC-1155 items to create verifiable ownership without gambling mechanics. It transforms battles into the core economic engine, where rewards are earned through seasonal performance and fully enforced by smart contracts. Designed for crypto-native and normie users alike, Base Realms integrates multi-currency payments and QRIS onboarding to make onchain gaming accessible, fair, and consumer-ready.",
  erpSystem: "Supply Chain Management system built as an internal ERP solution. It centralizes inventory tracking, stock monitoring, transaction management, invoicing, PDF reporting, and analytics into a single dashboard interface. The system provides real-time stock visibility, low-stock alerts, monthly revenue tracking, and structured order workflows to streamline operational efficiency. It also includes a locally hosted, private AI assistant for internal data queries and decision support, ensuring company data remains secure and confidential. Due to company privacy policies, additional system modules and screenshots cannot be publicly shared. Overall, the platform functions as a lightweight ERP tailored for operational control, financial tracking, and supply chain optimization.",
};

const projectImages: { [key: string]: string[] } = {
  baseRealms: baseRealmsImages,
  erpSystem: erpSystemImages,
};

export default function Projects() {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const handleProjectClick = (e: React.MouseEvent, projectName: string, hasPreview: boolean, projectKey: string) => {
    if (hasPreview) {
      e.preventDefault();
      setExpandedProject(expandedProject === projectKey ? null : projectKey);
    }
  };

  return (
    <section className="mb-16">
      <div className="flex items-center gap-2 mb-6 border-t border-neutral-200 pt-8">
        <h2 className="text-2xl font-serif font-medium text-neutral-900">
          Projects
        </h2>
      </div>
      <div className="flex flex-col">
        {projects.map((project, index) => (
          <div key={index}>
            <a
              href={project.url}
              onClick={(e) => handleProjectClick(e, project.name, project.hasPreview, project.projectKey)}
              target={project.hasPreview ? undefined : "_blank"}
              rel={project.hasPreview ? undefined : "noopener noreferrer"}
              className="flex items-center justify-between py-4 border-b border-neutral-200 hover:bg-neutral-100 transition-colors duration-150 px-2 -mx-2 rounded-sm group cursor-pointer"
            >
              <div className="flex items-center gap-3 text-neutral-800 font-medium group-hover:text-neutral-900">
                <ChevronRight size={18} className="text-neutral-400 group-hover:text-neutral-600 transition-colors" />
                <span>{project.name}</span>
              </div>
              <Link size={14} className="text-neutral-400 group-hover:text-neutral-600 transition-colors" />
            </a>
            
            {project.hasPreview && expandedProject === project.projectKey && (
              <div className="mt-4 mb-4 px-2">
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {projectImages[project.projectKey]?.map((image, imgIndex) => (
                    <div key={imgIndex} className="flex-shrink-0">
                      <div className="relative w-[210px] aspect-video md:w-[280px] rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`${project.name} ${imgIndex + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed mt-4 max-w-4xl">
                  {projectDescriptions[project.projectKey]}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
