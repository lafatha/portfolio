import { FaGithub } from "react-icons/fa";

const REPO_URL = "https://github.com/lafatha/portfolio";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-neutral-200 pt-4 text-xs text-neutral-500 flex items-center justify-between">
      <p>
        This site is available on{" "}
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-2 hover:underline hover:text-neutral-700"
        >
          GitHub
        </a>{" "}
        as open-source.
      </p>
      <a
        href={REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-neutral-500 hover:text-neutral-800"
        aria-label="View source on GitHub"
      >
        <FaGithub size={16} />
      </a>
    </footer>
  );
}

