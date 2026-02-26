import Image from "next/image";

const education = [
  { name: "Bandung Institute of Technology", year: "2023 - 2026" },
];

export default function Education() {
  return (
    <section className="mb-16">
      <div className="flex items-center gap-2 mb-6 border-t border-neutral-200 pt-8">
        <h2 className="text-2xl font-serif font-medium text-neutral-900">
          Education
        </h2>
      </div>
      <div className="flex flex-col">
        {education.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-4 px-2 -mx-2 rounded-sm"
          >
            <div className="flex items-center gap-3 text-neutral-800 font-medium">
              <div className="relative w-[36px] h-[36px] flex-shrink-0">
                <Image
                  src="/ITBlack.png"
                  alt="ITB"
                  fill
                  className="object-contain itb-logo-light"
                />
                <Image
                  src="/ITWhite.png"
                  alt="ITB"
                  fill
                  className="object-contain itb-logo-dark"
                />
              </div>
              <span>{item.name}</span>
            </div>
            <span className="text-neutral-600 text-sm">{item.year}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
