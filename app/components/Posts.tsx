import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { posts } from "@/app/data/portfolio";



export default function Posts() {
  return (
    <section className="mb-16">
      <div className="projects-header justify-between">
        <h2 className="projects-title">Posts</h2>
        <a
          href="https://medium.com/@athallahfatha"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1"
        >
          View all on Medium
          <ExternalLink size={12} />
        </a>
      </div>

      <div className="flex flex-col">
        {posts.map((post, index) => (
          <a
            key={index}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group block py-5 transition-colors ${
              index === posts.length - 1 ? "" : "border-b border-line"
            }`}
          >
            <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
              <span className="font-medium text-neutral-700">
                Gagah Athallah Fatha
              </span>
              <span>•</span>
              <span>{post.date}</span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-neutral-900 group-hover:text-neutral-600 transition-colors text-base md:text-lg leading-snug mb-1">
                  {post.title}
                </h3>
                <p className="text-xs md:text-sm text-neutral-600 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              {post.image && (
                <div className="relative w-24 h-18 md:w-32 md:h-22 rounded-md overflow-hidden shrink-0 bg-neutral-100">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(min-width: 768px) 128px, 96px"
                  />
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
