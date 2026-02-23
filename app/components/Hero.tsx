import Image from "next/image";
import { FaLinkedin, FaGithub, FaMedium, FaYoutube } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="-mx-8 md:-mx-12">
        <div className="hero-banner">
          <Image
            src="/backgr.png"
            alt="Profile banner"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
      <div className="hero-inner">
        <div className="hero-avatar">
          <Image
            src="https://media.licdn.com/dms/image/v2/D5603AQGkk3iMMULGDQ/profile-displayphoto-scale_200_200/B56ZraU.2DI8AY-/0/1764599527154?e=1772668800&v=beta&t=Z4KXmxxOc-lQ-nvq5AW_O4uYifdm4NfaCNfGj_CvqQs"
            alt="Gagah Athallah Fatha"
            fill
            className="hero-avatar-image object-cover"
            priority
          />
        </div>
        <div className="hero-content">
          <div className="hero-name">
            <h1>
              Gagah Athallah Fatha
            </h1>
          </div>
          <span className="hero-subtitle">
            Fullstack | Business Analyst | Supply Chain Analyst
          </span>

          <div className="hero-bio">
            <p>
              I design data systems, business dashboards, and AI-driven tools that turn operational data into actionable insights.
            </p>
            <p>
              Experienced in analytics architecture, backend systems, and building internal platforms for smarter decision-making.
            </p>
            <p>
              Currently focused on AI-powered automation and business intelligence solutions.
            </p>
          </div>

          <div className="hero-socials">
            <a href="https://linkedin.com/in/gagahathallahfatha" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
              <FaLinkedin size={20} />
            </a>
            <a href="https://github.com/lafatha" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
              <FaGithub size={20} />
            </a>
            <a href="https://www.youtube.com/@GagahAthallahFatha" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
              <FaYoutube size={20} />
            </a>
            <a href="https://medium.com/@athallahfatha" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
              <FaMedium size={20} />
            </a>
            <a href="mailto:athallahfatha@gmail.com" className="hover:opacity-70 transition-opacity">
              <HiOutlineMail size={22} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
