import Image from "next/image";
import { FaLinkedin, FaGithub, FaMedium, FaYoutube, FaResearchgate } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

import heroBanner from "@/public/backgr.webp";
import profilePic from "@/public/profilepic.webp";

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="-mx-8 md:-mx-12">
        <div className="hero-banner relative">
          <Image
            src={heroBanner}
            alt="Profile banner"
            fill
            className="hero-banner-image object-cover"
            priority
            quality={100}
            unoptimized
            sizes="100vw"
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
            priority
            quality={100}
            unoptimized
            sizes="(min-width: 768px) 256px, 192px"
          />
        </div>
        <div className="hero-content">
          <div className="hero-name">
            <h1>
              Gagah Athallah Fatha
            </h1>
          </div>
          <span className="hero-subtitle">
            Business Analyst • Supply Chain Analyst
          </span>


          <div className="hero-bio">
            <p>
              I help organizations translate{" "}
              <span className="font-semibold text-neutral-900">
                business challenges
              </span>{" "}
              into{" "}
              <span className="font-semibold text-neutral-900">
                structured data
              </span>{" "}
              and{" "}
              <span className="font-semibold text-neutral-900">
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
            <a href="https://linkedin.com/in/gagahathallahfatha" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="LinkedIn Profile" title="LinkedIn Profile">
              <FaLinkedin size={20} aria-hidden="true" />
            </a>
            <a href="https://github.com/lafatha" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="GitHub Profile" title="GitHub Profile">
              <FaGithub size={20} aria-hidden="true" />
            </a>
            <a href="https://www.youtube.com/@GagahAthallahFatha" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="YouTube Channel" title="YouTube Channel">
              <FaYoutube size={20} aria-hidden="true" />
            </a>
            <a href="https://medium.com/@athallahfatha" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="Medium Profile" title="Medium Profile">
              <FaMedium size={20} aria-hidden="true" />
            </a>
            <a href="https://www.researchgate.net/profile/Gagah-Athallah-Fatha" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="ResearchGate Profile" title="ResearchGate Profile">
              <FaResearchgate size={20} aria-hidden="true" />
            </a>
            <a href="mailto:athallahfatha@gmail.com" className="hover:opacity-70 transition-opacity" aria-label="Send Email" title="Send Email">
              <HiOutlineMail size={22} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
