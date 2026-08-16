import Image from "next/image";
import { ExternalLink } from "lucide-react";

interface Post {
  title: string;
  excerpt: string;
  date: string;
  url: string;
  image?: string | null;
}

const posts: Post[] = [
  {
    title: "I Built an AI Agent Lab Using Only Free Servers",
    excerpt:
      "As a student, experimenting with new technologies can be expensive. Running AI tools in the cloud usually requires paying for servers...",
    date: "Mar 7, 2026",
    url: "https://medium.com/@athallahfatha",
    image: "/posts/1_2cTQ1Qq6yHfU0jO4vbJzCw.webp",
  },
  {
    title: "AI is Reshaping How We Work",
    excerpt:
      "You’re not alone if you’ve caught yourself wondering whether AI is the best thing that happened to your work life or something to...",
    date: "Dec 1, 2025",
    url: "https://medium.com/@athallahfatha",
    image: "/posts/1_OcCy_f_LF3esFsBekUygbA.webp",
  },
  {
    title: "Charting the Horizons of Generative AI",
    excerpt: "How Generative AI Is Rewriting Creation Itself.",
    date: "Nov 22, 2025",
    url: "https://medium.com/@athallahfatha",
    image: "/posts/1_5jBH5X5hjbHtNX328DGr6Q.webp",
  },
  {
    title: "Are We Ready to Share Our Homes with Intelligent Machines?",
    excerpt:
      "For decades, the idea of a robot roommate lived in science fiction. Rosie spun through The Jetsons’ living room, C-3PO fussed over galactic...",
    date: "Nov 3, 2025",
    url: "https://medium.com/@athallahfatha",
    image: "/posts/1_kcPciakwwDzuiWQX5aghjQ.webp",
  },
  {
    title: "I Used Perplexity Comet for 3 Days, Here’s What Happened",
    excerpt:
      "I woke up. No plan, no class today, just vibes. First tab? Medium, some story about AI trading stocks. It’s bold, risky, kind of inspiring...",
    date: "Oct 25, 2025",
    url: "https://medium.com/@athallahfatha",
    image: "/posts/1_HNK6fZB84rB2gDFW14qDNw.webp",
  },
  {
    title: "When Every Trader Is an Algorithm",
    excerpt:
      "For decades, markets have been emotional places. Prices moved not only because of data but because of people, their fear, greed...",
    date: "Oct 21, 2025",
    url: "https://medium.com/@athallahfatha",
    image: "/posts/1_pA-nSJ2VIIJ_RBeWuCfh5Q.webp",
  },
];

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
              index === posts.length - 1 ? "" : "border-b border-neutral-200"
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
