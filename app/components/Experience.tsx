import Image from "next/image";

interface ExperienceItem {
  role: string;
  company: string;
  type?: string;
  dates: string;
  logo?: string | null;
  isGrayBox?: boolean;
}

const experiences: ExperienceItem[] = [
  {
    role: "Technology & Transformation",
    company: "Deloitte",
    type: "Internship",
    dates: "Jun 2026 - Present",
    logo: "/experience/deloitte.png",
  },
  {
    role: "Business Development",
    company: "PT SAS AERO SISHAN",
    type: "Internship",
    dates: "Feb 2026 - May 2026",
    logo: "/experience/sas.png",
  },
  {
    role: "Warehouse & ERP Development",
    company: "HATA KARYA CV",
    type: "Internship",
    dates: "Dec 2025 - Feb 2026",
    isGrayBox: true,
  },
  {
    role: "Research and Data Analyst",
    company: "Blockvizo Research",
    dates: "Jun 2024 - Jul 2025",
    logo: "/experience/blockvizo.png",
  },
  {
    role: "Startup Mentee",
    company: "The GreaterHub",
    dates: "Sep 2023 - Dec 2023",
    logo: "/experience/greaterhub.png",
  },
];

export default function Experience() {
  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6 border-t border-neutral-200 pt-8">
        <h2 className="projects-title">Experience</h2>
      </div>

      <div className="flex flex-col">
        {experiences.map((exp, index) => {
          const isLast = index === experiences.length - 1;
          return (
            <div
              key={index}
              className={`flex items-start md:items-center justify-between py-3.5 gap-4 ${
                isLast ? "" : "border-b border-neutral-200"
              }`}
            >
              <div className="flex items-start md:items-center gap-3.5 min-w-0">
                {exp.isGrayBox ? (
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-md bg-neutral-400 dark:bg-neutral-600 shrink-0 mt-0.5 md:mt-0" />
                ) : (
                  <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-md overflow-hidden shrink-0 mt-0.5 md:mt-0">
                    <Image
                      src={exp.logo!}
                      alt={exp.company}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                )}

                <div className="flex flex-col min-w-0">
                  <h3 className="font-semibold text-neutral-900 text-sm md:text-base leading-snug">
                    {exp.role}
                  </h3>
                  <span className="text-xs text-neutral-600 font-medium">
                    {exp.company} {exp.type ? `· ${exp.type}` : ""}
                  </span>
                  <span className="text-xs text-neutral-500 font-normal mt-0.5 md:hidden">
                    {exp.dates}
                  </span>
                </div>
              </div>

              <span className="hidden md:inline-block text-xs text-neutral-500 shrink-0 text-right font-normal">
                {exp.dates}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
