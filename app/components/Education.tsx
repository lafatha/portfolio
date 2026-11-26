import Image from "next/image";
import { education } from "@/app/data/portfolio";



export default function Education() {
  return (
    <section className="mb-16">
      <div className="flex items-center gap-2 mb-6 border-t border-line pt-8">
        <h2 className="projects-title">Education</h2>
      </div>
      <div className="flex flex-col">
        {education.map((item, index) => {
          const isLast = index === education.length - 1;
          return (
            <div
              key={index}
              className={`flex items-start md:items-center justify-between py-3.5 gap-4 ${
                isLast ? "" : "border-b border-line"
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
                          <span aria-hidden="true" className="meta-sep" />
                          {item.major}
                        </>
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
