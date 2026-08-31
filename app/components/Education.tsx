import Image from "next/image";

interface EducationItem {
  name: string;
  degree?: string;
  major?: string;
  year: string;
}

const education: EducationItem[] = [
  {
    name: "Bandung Institute of Technology",
    degree: "Management",
    major: "Operations Management (Industrial Operations)",
    year: "Aug 2023 - Aug 2026",
  },
];

export default function Education() {
  return (
    <section className="mb-16">
      <div className="projects-header">
        <h2 className="projects-title">Education</h2>
      </div>
      <div className="flex flex-col">
        {education.map((item, index) => {
          const isLast = index === education.length - 1;
          return (
            <div
              key={index}
              className={`flex items-start md:items-center justify-between py-3.5 gap-4 ${
                isLast ? "" : "border-b border-neutral-200"
              }`}
            >
              <div className="flex items-start md:items-center gap-3.5 min-w-0">
                <div className="relative w-9 h-9 md:w-10 md:h-10 shrink-0 mt-0.5 md:mt-0">
                  <Image
                    src="/ITBlack.png"
                    alt="ITB"
                    fill
                    className="object-contain itb-logo-light"
                    sizes="40px"
                  />
                  <Image
                    src="/ITWhite.png"
                    alt="ITB"
                    fill
                    className="object-contain itb-logo-dark"
                    sizes="40px"
                  />
                </div>

                <div className="flex flex-col min-w-0">
                  <h3 className="font-semibold text-neutral-900 text-sm md:text-base leading-snug">
                    {item.name}
                  </h3>
                  {item.degree && (
                    <span className="text-xs text-neutral-600 font-medium">
                      {item.degree}
                      {item.major && (
                        <>
                          <span className="text-neutral-400/50 opacity-60 mx-1 font-normal">|</span>
                          {item.major}
                        </>
                      )}
                    </span>
                  )}
                  <span className="text-xs text-neutral-500 font-normal mt-0.5 md:hidden">
                    {item.year}
                  </span>
                </div>
              </div>

              <span className="hidden md:inline-block text-xs text-neutral-500 shrink-0 text-right font-normal">
                {item.year}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
