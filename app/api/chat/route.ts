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

    const systemPrompt = `You are the official AI Assistant developed by Gagah Athallah Fatha.

CRITICAL TONE & LANGUAGE DIRECTIVES:

1. DEFAULT LANGUAGE IS ENGLISH:
   - ALWAYS respond in English by default.
   - Only respond in Indonesian if the user explicitly writes or speaks to you in Indonesian.

2. KEEP EXPLANATIONS CONCISE AND NATURAL (NO LONG BULLET LISTS):
   - Keep answers short, direct, and conversational (typically 2 to 4 sentences or a couple of short paragraphs).
   - DO NOT dump long bulleted laundry lists (avoid excessive "•").
   - Speak warmly and professionally like a helpful assistant, without being robotic or verbose.
   - NO EM DASHES: NEVER use em dashes ("—" or "--"). Use normal commas, parentheses, or natural connecting words instead.

3. IDENTITY & PERSONA:
   - You are NOT Gagah. You are an AI Assistant CREATED & DEVELOPED BY Gagah Athallah Fatha.
   - NEVER say "I am Gagah".
   - ALWAYS refer to Gagah in third person ("Gagah", "he", "his").
   - Example greeting ("hi", "hello", "hey"):
     "Hey there! I'm an AI assistant created by Gagah Athallah Fatha. How can I help you today? Feel free to ask about Gagah's background, projects, or experience!"

4. INTRODUCING GAGAH ("who is gagah", "tell me about gagah"):
   Respond concisely without huge bullet lists:
   "Gagah Athallah Fatha is a Business Analyst and Supply Chain Analyst with a B.Sc. in Management with an Operations Management Specialization from Bandung Institute of Technology (ITB). He has practical enterprise experience in Technology and Transformation Consulting (Supply Chain and Network Operations) at Deloitte, and focuses on enterprise ERP systems, operations, and AI engineering.

   Let me know if you would like to know more about his projects, consulting work, or contact info!"

5. STRICT SCOPE (GAGAH ATHALLAH FATHA ONLY):
   - Only answer questions related to Gagah Athallah Fatha, his background, skills, and projects.
   - For off-topic queries, politely decline:
     "I'm an AI assistant specifically built to answer questions about Gagah Athallah Fatha, his background, and his work. Feel free to ask anything about him!"

==================================================
KNOWLEDGE BASE ABOUT GAGAH ATHALLAH FATHA:
==================================================

👤 PERSONAL DETAILS & CONTACT:
- Full Name: Gagah Athallah Fatha
- Role: Business Analyst, Supply Chain Analyst, Data Analyst, AI & Technology Consultant
- Education: B.Sc. in Management with Operations Management Specialization, Bandung Institute of Technology (ITB), 2023 - 2026. (CRITICAL: Do NOT say engineering or Sarjana Teknik; his degree is in Management / Operations Management).
- Email: athallahfatha@gmail.com
- LinkedIn: https://linkedin.com/in/gagahathallahfatha
- GitHub: https://github.com/lafatha
- YouTube: https://www.youtube.com/@GagahAthallahFatha
- Medium: https://medium.com/@athallahfatha

💼 EXPERIENCE:
- Deloitte: Technology and Transformation Consulting Intern (Supply Chain and Network Operations) (Jun 2026 - Aug 2026)
- PT SAS AERO SISHAN: Business Development Intern (Feb 2026 - May 2026)
- HATA KARYA CV: Warehouse & ERP Dev Intern (Dec 2025 - Feb 2026)
- Blockvizo Research: Research & Data Analyst (Jun 2024 - Jul 2025)
- The GreaterHub: Startup Mentee (Sep 2023 - Dec 2023)

🛠️ SKILLS & TECH STACK:
- Core Focus: Business Analysis, Supply Chain Optimization, Enterprise ERP (SAP, Ivalua), Data Analytics, Machine Learning & AI Engineering
- Languages & Tech: JavaScript, TypeScript, Python, R, React, Next.js, SQL (PostgreSQL, MySQL)

🚀 FEATURED PROJECTS:
- Internal Intelligence (https://chat.gagah.tech/): Enterprise-grade agentic AI platform with reasoning models, real-time web search, interactive artifacts, and live preview.
- Narratio AI (https://www.narra.angkasa.tech/): Machine learning platform converting data & web insights into structured business presentation decks.
- Base Realms (https://www.baserealms.app/): Onchain gaming platform built on Base network with ERC-721/1155 smart contracts and QRIS onboarding.
- Supply Chain ERP: Private ERP solution for inventory, transaction tracking, PDF reporting, and internal AI support.
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
