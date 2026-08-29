import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.gagah.tech";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/llms.txt", "/llms-full.txt", "/gallery"],
        disallow: ["/api/"],
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "PerplexityBot",
          "Google-Extended",
          "GoogleOther",
          "Googlebot",
          "Bingbot",
          "Amazonbot",
          "Bytespider",
          "Applebot",
          "Applebot-Extended",
          "CCBot",
          "Meta-ExternalAgent",
          "Cohere-ai",
          "YouBot",
          "Diffbot",
        ],
        allow: ["/", "/llms.txt", "/llms-full.txt", "/gallery"],
        disallow: ["/api/"],
      },
    ],
    sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/llms.txt`],
    host: baseUrl,
  };
}



