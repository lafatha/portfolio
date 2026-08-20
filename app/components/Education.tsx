import Image from "next/image";

const education = [
  { name: "Bandung Institute of Technology", year: "2023 - 2026" },
];

export default function Education() {
  return (
    <section className="mb-16">
      <div className="projects-header">
        <h2 className="projects-title">
          Education
        </h2>
      </div>
      <div className="flex flex-col">
        {education.map((item, index) => (
          <div
            key={index}
            className="flex items-start md:items-center justify-between py-4 px-2 -mx-2 rounded-sm"
          >
            <div className="flex items-start md:items-center gap-3 text-neutral-800 font-medium">
              <div className="relative w-[36px] h-[36px] flex-shrink-0 mt-0.5 md:mt-0">
                <Image
                  src="/ITBlack.png"
                  alt="ITB"
                  fill
                  className="object-contain itb-logo-light"
                  sizes="36px"
                />
                <Image
                  src="/ITWhite.png"
                  alt="ITB"
                  fill
                  className="object-contain itb-logo-dark"
                  sizes="36px"
                />
              </div>
              <div className="flex flex-col">
                <span>{item.name}</span>
                <span className="text-neutral-500 text-xs font-normal mt-0.5 md:hidden">
                  {item.year}
                </span>
              </div>
            </div>
            <span className="hidden md:inline-block text-neutral-600 text-sm">
              {item.year}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
