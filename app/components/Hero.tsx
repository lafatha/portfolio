import Image from "next/image";
import { FaLinkedin, FaGithub, FaMedium } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

export default function Hero() {
  return (
    <section className="flex flex-col gap-8 mb-16">
      <div className="flex items-start gap-8">
        <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0">
          <Image
            src="https://media.licdn.com/dms/image/v2/D5603AQGkk3iMMULGDQ/profile-displayphoto-scale_200_200/B56ZraU.2DI8AY-/0/1764599527154?e=1772668800&v=beta&t=Z4KXmxxOc-lQ-nvq5AW_O4uYifdm4NfaCNfGj_CvqQs"
            alt="Gagah Athallah Fatha"
            fill
            className="rounded-full object-cover"
            priority
          />
        </div>
        <div className="flex flex-col pt-2">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-4xl md:text-5xl font-serif text-neutral-900 font-medium">
              Gagah Athallah Fatha
            </h1>
          </div>
          <span className="text-neutral-500 text-base mb-6 mt-2">Fullstack | Business Analyst | Supply Chain Analyst</span>
          
          <p className="text-neutral-800 leading-relaxed max-w-lg mb-6">
            Hi! my name is Gagah and welcome to my Portfolio Site.
          </p>

          <div className="flex items-center gap-5 text-neutral-700">
            <a href="https://linkedin.com/in/gagahathallahfatha" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
              <FaLinkedin size={20} />
            </a>
            <a href="https://github.com/lafatha" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
              <FaGithub size={20} />
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
