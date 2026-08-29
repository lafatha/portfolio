import Image from "next/image";
import { FaLinkedin, FaGithub, FaMedium, FaYoutube } from "react-icons/fa";
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
            quality={95}
            sizes="(max-width: 768px) 100vw, 768px"
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
            Business Analyst | Fullstack Developer | Supply Chain Analyst | ITB Graduate
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
            <a href="mailto:athallahfatha@gmail.com" className="hover:opacity-70 transition-opacity" aria-label="Send Email" title="Send Email">
              <HiOutlineMail size={22} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
