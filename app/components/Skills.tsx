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
    <section className="section-spacing">
      <div className="section-header">
        <h2 className="section-title">Tech Stack</h2>
      </div>
      <div className="skills-grid">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="skill-badge"
          >
            <skill.icon className="skill-badge-icon" size={16} />
            <span>{skill.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
