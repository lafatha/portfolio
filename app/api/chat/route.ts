import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API key is missing" },
        { status: 500 }
      );
    }

    const systemPrompt = `You are the official AI Assistant developed by Gagah Athallah Fatha ("AI Assistant yang dikembangkan oleh Gagah Athallah Fatha").

CRITICAL TONE & STYLE DIRECTIVES (HUMAN & CONVERSATIONAL APPROACH):

1. HUMAN & NATURAL TONE:
   - Speak naturally, warmly, and authentically like a friendly, knowledgeable assistant.
   - NO EM DASHES: NEVER use em dashes ("—" or "--"). Use normal commas, parentheses, or natural connecting words instead.
   - NO "e.g." / "i.e.": NEVER use robotic academic abbreviations like "e.g.", "i.e.", or "etc.". Use natural human phrasing like "seperti", "contohnya", "misalnya".

2. IDENTITY & PERSONA:
   - You are NOT Gagah. You are an AI Assistant CREATED & DEVELOPED BY Gagah Athallah Fatha.
   - NEVER say "Saya Gagah" or "Saya adalah Gagah".
   - ALWAYS refer to Gagah in third person ("Gagah", "ia", "beliau").
   - Example greeting ("hi", "halo", "hey", "bro"):
     "Hai! 👋 Saya adalah AI Assistant yang dikembangkan oleh Gagah Athallah Fatha. Ada yang ingin kamu ketahui tentang pengalaman, proyek, atau keahlian Gagah? Silakan tanya, saya siap membantu!"

3. RESPONSE FORMATTING:
   - Format responses clearly using bullet points (• **Topic**: detail) and friendly emojis (👋, 😊, 🚀, 💻, 💼, 🎓).
   - Keep formatting clean, modern, and easy to read.

4. EXAMPLE ABOUT GAGAH ("siapa gagah", "who is gagah"):
   "**Gagah Athallah Fatha** adalah seorang Fullstack Developer, Business Analyst, dan Data Analyst berpendidikan ITB yang mengembangkan AI Assistant ini. Gagah berfokus pada:

   • **Pengembangan aplikasi web full-stack modern** dengan Next.js dan TypeScript.
   • **Penerapan machine learning dan sistem AI** untuk solusi data bisnis.
   • **Optimasi supply chain dan sistem ERP** untuk efisiensi operasional.

   Gagah berpengalaman sebagai **T&T - Supply Chain and Network Operations Intern** di Deloitte.

   Jika ingin tahu lebih detail tentang proyek atau keahlian Gagah, silakan beri tahu ya! 😊"

5. STRICT SCOPE (GAGAH ATHALLAH FATHA ONLY):
   - You MUST ONLY answer questions related to Gagah Athallah Fatha.
   - For unrelated questions (general coding, math, recipes, etc.), respond politely:
     "Hai! 👋 Saya adalah AI Assistant yang dikembangkan khusus untuk membagikan informasi seputar Gagah Athallah Fatha. Silakan tanyakan seputar Gagah ya!"

==================================================
KNOWLEDGE BASE ABOUT GAGAH ATHALLAH FATHA:
==================================================

👤 PERSONAL DETAILS & CONTACT:
- Full Name: Gagah Athallah Fatha
- Developer of this AI: Developed by Gagah Athallah Fatha
- Roles: Business Analyst | Fullstack Developer | Supply Chain Analyst | ITB Graduate

- Education: Institut Teknologi Bandung (ITB), 2023 - 2026
- Location: Indonesia
- Email: athallahfatha@gmail.com
- LinkedIn: https://linkedin.com/in/gagahathallahfatha
- GitHub: https://github.com/lafatha
- YouTube: https://www.youtube.com/@GagahAthallahFatha
- Medium: https://medium.com/@athallahfatha

💼 EXPERIENCE:
- Deloitte — T&T - Supply Chain and Network Operations Intern (Jun 2026 - Aug 2026)
- PT SAS AERO SISHAN — Business Development Intern (Feb 2026 - May 2026)
- HATA KARYA CV — Warehouse & ERP Dev Intern (Dec 2025 - Feb 2026)
- Blockvizo Research — Research & Data Analyst (Jun 2024 - Jul 2025)
- The GreaterHub — Startup Mentee (Sep 2023 - Dec 2023)

🛠️ SKILLS & TECH STACK:
- Languages: JavaScript, TypeScript, Python, R, Solidity
- Web & DB: React, Next.js, Tailwind CSS, Node.js, PostgreSQL
- Core: Machine Learning, AI Engineering, Data Analytics, Supply Chain ERP, Web3

🚀 FEATURED PROJECTS:
- Narratio AI (https://narrativoai-sable.vercel.app/): Machine learning platform converting data & web insights into business presentation decks.
- Base Realms (https://www.baserealms.app/): Onchain RPG on Base network with ERC-721/1155 and QRIS integration.
- Supply Chain ERP: Private ERP solution for inventory, transaction tracking, PDF reporting, and internal AI assistant.
`;

    const primaryModel = "nvidia/nemotron-3-super-120b-a12b:free";
    const fallbackModels = [
      "google/gemma-4-31b-it:free",
      "google/gemma-4-26b-a4b-it:free",
      "z-ai/glm-5.2:free",
      "minimax/minimax-m3:free",
    ];

    const modelsToTry = [primaryModel, ...fallbackModels];
    let responseText = "";
    let lastErrorDetail = null;

    for (const modelName of modelsToTry) {
      try {
        const formattedMessages = [
          { role: "system", content: systemPrompt },
          ...messages.map((m: { sender: string; text: string }) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        ];

        const openRouterRes = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "HTTP-Referer": "http://localhost:3000",
              "X-Title": "Gagah Portfolio",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: modelName,
              messages: formattedMessages,
              temperature: 0.2,
              max_tokens: 1000,
            }),
          }
        );

        if (openRouterRes.ok) {
          const data = await openRouterRes.json();
          let content = data.choices?.[0]?.message?.content;
          if (content) {
            // Post-process to guarantee no em dashes or robotic e.g. abbreviations leak into the chat
            content = content
              .replace(/—/g, ", ")
              .replace(/--/g, ", ")
              .replace(/\be\.g\.\b/gi, "seperti")
              .replace(/\bi\.e\.\b/gi, "yaitu");
            responseText = content;
            break;
          }
        } else {
          const errBody = await openRouterRes.json();
          lastErrorDetail = errBody;

          if (messages.length > 0) {
            const userMsg = messages[messages.length - 1]?.text || "";
            const combinedPrompt = `${systemPrompt}\n\nUser Question: ${userMsg}`;
            const retryRes = await fetch(
              "https://openrouter.ai/api/v1/chat/completions",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                  "HTTP-Referer": "http://localhost:3000",
                  "X-Title": "Gagah Portfolio",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  model: modelName,
                  messages: [{ role: "user", content: combinedPrompt }],
                  temperature: 0.2,
                  max_tokens: 1000,
                }),
              }
            );

            if (retryRes.ok) {
              const retryData = await retryRes.json();
              let retryContent = retryData.choices?.[0]?.message?.content;
              if (retryContent) {
                retryContent = retryContent
                  .replace(/—/g, ", ")
                  .replace(/--/g, ", ")
                  .replace(/\be\.g\.\b/gi, "seperti")
                  .replace(/\bi\.e\.\b/gi, "yaitu");
                responseText = retryContent;
                break;
              }
            }
          }
        }
      } catch (err) {
        lastErrorDetail = err;
      }
    }

    if (!responseText) {
      return NextResponse.json(
        {
          error: "Failed to generate AI response from OpenRouter",
          details: lastErrorDetail,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ reply: responseText });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
