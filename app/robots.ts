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
          "Googlebot",
          "Google-Extended",
          "GoogleOther",
          "Bingbot",
          "Applebot",
          "Applebot-Extended",
          "DuckDuckBot",
          "Baiduspider",
          "YandexBot",
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "PerplexityBot",
          "Amazonbot",
          "Bytespider",
          "CCBot",
          "Meta-ExternalAgent",
          "Cohere-ai",
          "YouBot",
          "Diffbot",
        ],
        allow: ["/", "/gallery", "/llms.txt", "/llms-full.txt"],
        disallow: ["/api/"],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/llms.txt`,
      `${baseUrl}/llms-full.txt`,
    ],
    host: baseUrl,
  };
}



