import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiR,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiSolidity,
  SiTailwindcss,
  SiPostgresql,
  SiGit,
  SiGithub,
  SiDocker,
} from "react-icons/si";

const skills = [
  { name: "JavaScript", icon: SiJavascript },
  { name: "TypeScript", icon: SiTypescript },
  { name: "Python", icon: SiPython },
  { name: "R", icon: SiR },
  { name: "React", icon: SiReact },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "Node.js", icon: SiNodedotjs },
  { name: "Solidity", icon: SiSolidity },
  { name: "Tailwind", icon: SiTailwindcss },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "Git", icon: SiGit },
  { name: "GitHub", icon: SiGithub },
  { name: "Docker", icon: SiDocker },
];

export default function Skills() {
  return (
    <section className="mb-16">
      <div className="flex items-center gap-2 mb-6 border-t border-neutral-200 pt-8">
        <h2 className="text-2xl font-serif font-medium text-neutral-900">
          Tech Stack
        </h2>
      </div>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="flex items-center gap-2 border border-dashed border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors cursor-default"
          >
            <skill.icon className="text-neutral-700" size={16} />
            <span>{skill.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
