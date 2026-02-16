import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Education from "./components/Education";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import GitHubActivity from "./components/GitHubActivity";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] flex justify-center">
      <div className="w-full max-w-3xl bg-white min-h-screen border-x border-neutral-200 px-8 md:px-12 pt-0 pb-8">
        <Navbar />
        <Hero />
        <Education />
        <Skills />
        <Projects />
        <GitHubActivity />
        </div>
      </main>
  );
}
