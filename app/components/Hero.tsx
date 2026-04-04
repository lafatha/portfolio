import Image from "next/image";
import { FaLinkedin, FaGithub, FaMedium, FaYoutube } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

import heroBanner from "@/public/backgr.webp";
import profilePic from "@/public/profilepic.webp";

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="-mx-8 md:-mx-12">
        <div className="hero-banner">
          <Image
            src={heroBanner}
            alt="Profile banner"
            fill
            className="object-cover"
            priority
            placeholder="blur"
            sizes="(min-width: 768px) 768px, 100vw"
          />
        </div>
      </div>
      <div className="hero-inner">
        <div className="hero-avatar">
          <Image
            src={profilePic}
            alt="Gagah Athallah Fatha"
            fill
            className="hero-avatar-image object-cover"
            placeholder="blur"
            sizes="(min-width: 768px) 112px, 96px"
          />
        </div>
        <div className="hero-content">
          <div className="hero-name">
            <h1>
              Gagah Athallah Fatha
            </h1>
          </div>
          <span className="hero-subtitle">
            Fullstack | Business Analyst | Data Analyst | Supply Chain Analyst
          </span>

          <div className="hero-bio">
            <p>
              I help organizations translate{" "}
              <span className="inline-block bg-[#ebebeb] px-1 py-px rounded font-semibold">
                business challenges
              </span>{" "}
              into{" "}
              <span className="inline-block bg-[#ebebeb] px-1 py-px rounded font-semibold">
                structured data
              </span>{" "}
              and{" "}
              <span className="inline-block bg-[#ebebeb] px-1 py-px rounded font-semibold">
                technology solutions.
              </span>
            </p>
            <p>
              Experienced in analytics design, system thinking, and building decision-support tools that improve operational clarity.
            </p>
            <p>
              Passionate about applying AI and advanced analytics to inform strategic, data-driven business decisions.
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
