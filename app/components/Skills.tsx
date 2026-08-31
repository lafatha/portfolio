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
  SiMysql,
  SiSqlite,
  SiGit,
  SiSap,
  SiOracle,
  SiDocker,
} from "react-icons/si";

function IvaluaIcon({
  size = 16,
  className = "",
  ...props
}: {
  size?: number;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 620 250.3"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M594,181.2 c-16.4,23.2-43.6,38.5-74.2,38.5c-30.6,0-57.8-15.3-74.2-38.5L419,196.5c21.5,32.3,58.3,53.8,100.2,53.8 s78.7-21.5,100.2-53.8L594,181.2z" />
      <path d="M423,48.1v80.4 c-5.1,6.8-15.3,14.2-26.6,14.2c-10.8,0-19.3-7.4-19.3-15.3V48.7h-24.9v78.7c0,18.7,10.8,35.7,40.8,35.7 c14.2,0,25.5-7.9,30-12.5v10.2h24.3l0.6-112.7C447.9,48.1,423,48.1,423,48.1z" />
      <path d="M318.2,164.7 c-9.6-2.8-24.3-11.3-24.3-28.3V7.3l25.5-7.4v126.9c0,6.8,2.8,19.8,12.5,25.5L318.2,164.7z" />
      <polygon points="104.7,165.3 55.5,48.1 82.1,48.1 109.3,113.8 137,48.1 163.1,48.1 114.4,165.3" />
      <path d="M262.2,126.2v-47 c0-16.4-15.9-34-40.2-34c-14.7,0-26.6,2.3-37.4,7.4l6.8,18.7c0,0,13-5.7,26-5.7c16.4,0,20.4,11.3,20.4,18.7v4.5 c-2.8-0.6-7.9-1.7-11.9-1.7c-39.6,0-52.7,19.3-52.7,37.9c0,24.3,10.2,36.8,39.1,36.8c17,0,24.9-7.4,28.9-10.2 c4,7.4,15.3,11.3,20.4,12.5l11.3-11.3C262.7,147.2,262.2,133,262.2,126.2 M215.7,143.2c-10.8,0-17.6-4-17.6-17.6 s12.5-20.4,28.3-20.4c4,0,8.5,0,10.8,1.1v24.9C231,139.3,224.8,143.2,215.7,143.2" />
      <path d="M559.4,126.2v-47 c0-16.4-16.4-34-40.2-34c-14.7,0-26.6,2.3-37.4,7.4l6.8,18.7c0,0,13-5.7,26-5.7c16.4,0,20.4,11.3,20.4,18.7v4.5 c-2.8-0.6-7.9-1.7-11.9-1.7c-39.6,0-52.7,19.3-52.7,37.9c0,24.3,10.2,36.8,39.1,36.8c17,0,24.9-7.4,28.9-10.2 c4,7.4,15.3,11.3,20.4,12.5l11.3-11.3C560,147.2,559.4,133,559.4,126.2 M513,143.2c-10.8,0-17.6-4-17.6-17.6 s12.5-20.4,28.3-20.4c4,0,8.5,0,10.8,1.1v24.9C528.3,139.3,522,143.2,513,143.2" />
      <polygon points="13.6,160.8 39.1,160.8 39.1,48.1 0,48.1 0,68.5 13.6,68.5" />
      <rect x="0" y="9.6" width="39.1" height="20.4" />
    </svg>
  );
}

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
  { name: "MySQL", icon: SiMysql },
  { name: "SQLite", icon: SiSqlite },
  { name: "Git", icon: SiGit },
  { name: "SAP", icon: SiSap },
  { name: "Ivalua", icon: IvaluaIcon },
  { name: "Oracle", icon: SiOracle },
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
            <skill.icon className="skill-badge-icon" size={16} aria-hidden="true" />
            <span>{skill.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
