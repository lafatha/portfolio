import { BM25, analyze, keywordsOf, type Doc } from "./bm25";
import {
  profile,
  experiences,
  education,
  focusAreas,
  techStack,
  projects,
  projectDescriptions,
  posts,
} from "@/app/data/portfolio";

/**
 * Knowledge base for the chat assistant, built from the same data the site renders.
 * Two short chunks are always sent to the LLM (who Gagah is + an index of everything);
 * the detailed chunks are picked per question with BM25.
 */

interface Chunk extends Doc {
  kind: "profile" | "overview" | "about" | "education" | "contact" | "skills" | "experience" | "project" | "post" | "posts";
}

const paragraphs = (key: string) => {
  const raw = projectDescriptions[key];
  return Array.isArray(raw) ? raw : [raw];
};

const edu = education[0];
const eduLine = `${edu.degree} with a specialization in ${edu.major}, ${edu.name} (ITB)${edu.years ? `, ${edu.years}` : ""}`;

// Role titles on the site are abbreviated; spell them out for the assistant.
const ROLE_DETAIL: Record<string, { text?: string; keywords: string }> = {
  Deloitte: {
    text: "Technology and Transformation (T&T) Consulting Intern in Supply Chain and Network Operations.",
    keywords: "consulting consultant big four technology transformation konsultan magang supply chain rantai pasok",
  },
  "PT SAS AERO SISHAN": { keywords: "business development pengembangan bisnis magang" },
  "HATA KARYA CV": { keywords: "warehouse erp gudang inventory persediaan magang" },
  "Blockvizo Research": { keywords: "research data analyst riset analis data" },
  "The GreaterHub": { keywords: "startup mentee mentoring inkubator wirausaha" },
};

const PROJECT_KEYWORDS: Record<string, string> = {
  erpta: "erp industry 4.0 industri open source inventory hr payroll transportation dashboard forecasting sme umkm",
  internalIntelligence: "ai agent chatbot llm artifacts web search enterprise asisten",
  narratioAi: "presentation slide deck sentiment bilstm scraping consulting presentasi sentimen",
  baseRealms: "web3 blockchain crypto nft game rpg base qris smart contract solidity kripto permainan",
  erpSystem: "supply chain erp inventory stock invoice pdf private ai gudang stok rantai pasok",
};

const contactLines = [
  `Email: ${profile.contact.email}`,
  `LinkedIn: ${profile.contact.linkedin}`,
  `GitHub: ${profile.contact.github}`,
  `YouTube: ${profile.contact.youtube}`,
  `Medium: ${profile.contact.medium}`,
  `ResearchGate: ${profile.contact.researchgate}`,
  `Website: ${profile.contact.website}`,
];

const ALWAYS: Chunk[] = [
  {
    id: "profile",
    kind: "profile",
    title: "Who Gagah is",
    text: [
      `${profile.name} is a ${profile.roles.join(", ")}.`,
      `Education: ${eduLine}. His degree is in Management (Operations Management), not engineering and not computer science.`,
      `Focus areas: ${focusAreas.join(", ")}.`,
      `Email: ${profile.contact.email}. LinkedIn: ${profile.contact.linkedin}.`,
    ].join("\n"),
  },
  {
    id: "overview",
    kind: "overview",
    title: "Index of experience, projects and writing",
    text: [
      "Experience (newest first):",
      ...experiences.map((e) => `- ${e.company}: ${e.role}${e.type ? ` (${e.type})` : ""}, ${e.dates}`),
      "Projects (newest first):",
      ...projects.map((p) => `- ${p.name} (${p.date})${p.url && p.url !== "#" ? `: ${p.url}` : " (private, no public link)"}`),
      `Tech stack: ${techStack.join(", ")}.`,
      `He has published ${posts.length} articles on Medium (${profile.contact.medium}).`,
    ].join("\n"),
  },
];

const SEARCHABLE: Chunk[] = [
  {
    id: "about",
    kind: "about",
    title: "About Gagah and his background",
    text: `${profile.bio}\nRoles: ${profile.roles.join(", ")}.`,
    keywords: "who is gagah profile background bio siapa gagah profil latar belakang",
  },
  {
    id: "education",
    kind: "education",
    title: "Education",
    text: `${eduLine}. The degree is in Management with an Operations Management specialization. In Indonesian: Sarjana Manajemen, peminatan Operations Management. It is not engineering (Sarjana Teknik) and not computer science (Sarjana Komputer).`,
    keywords: "bandung institute of technology institut teknologi bandung sbm itb management manajemen operations",
  },
  {
    id: "contact",
    kind: "contact",
    title: "Contact and social links",
    text: contactLines.join("\n"),
  },
  {
    id: "skills",
    kind: "skills",
    title: "Skills and tech stack",
    text: `Focus areas: ${focusAreas.join(", ")}.\nTechnologies: ${techStack.join(", ")}.`,
    keywords: "postgresql sql database basis data",
  },
  ...experiences.map<Chunk>((e) => {
    const detail = ROLE_DETAIL[e.company];
    return {
      id: `exp:${e.company}`,
      kind: "experience",
      title: `Experience at ${e.company}`,
      text: [
        `${e.role} at ${e.company}${e.type ? ` (${e.type})` : ""}, ${e.dates}.`,
        detail?.text,
      ].filter(Boolean).join(" "),
      keywords: detail?.keywords,
    };
  }),
  ...projects.map<Chunk>((p) => ({
    id: `project:${p.projectKey}`,
    kind: "project",
    title: `Project: ${p.name}`,
    text: [
      `${p.name} (${p.date})${p.url && p.url !== "#" ? `, live at ${p.url}` : ", private project without a public link"}.`,
      ...paragraphs(p.projectKey),
    ].join("\n"),
    keywords: PROJECT_KEYWORDS[p.projectKey],
  })),
  {
    id: "posts",
    kind: "posts",
    title: "All articles he has written",
    text: posts.map((p) => `- "${p.title}" (${p.date}): ${p.url}`).join("\n"),
    keywords: "list articles posts medium writing daftar artikel tulisan",
  },
  ...posts.map<Chunk>((p) => ({
    id: `post:${p.url}`,
    kind: "post",
    title: `Article: ${p.title}`,
    text: `"${p.title}", published ${p.date} on Medium (${p.url}). ${p.excerpt}`,
  })),
];

const index = new BM25(SEARCHABLE);

const MAX_CHUNKS = 4;
const MIN_SCORE = 1.0; // below this a hit is noise
const RELATIVE_CUTOFF = 0.35; // keep hits within 35% of the best one
const WEAK_TOP = 2.5; // a weaker best hit means the question likely leans on earlier turns
const CARRY = 0.4; // weight of the previous question, so "it" / "itu" keeps its subject
const CARRY_WEAK = 0.7;

export interface ChatTurn {
  sender: "user" | "bot";
  text: string;
}

export interface Retrieval {
  context: string;
  keywords: string[];
  sources: { id: string; title: string; score: number }[];
}

export function retrieve(turns: ChatTurn[]): Retrieval {
  const userTurns = turns.filter((t) => t.sender === "user").map((t) => t.text);
  const latest = userTurns.at(-1) ?? "";
  const own = analyze(latest);
  let hits = index.search(own, 8);

  // Follow-ups ("which network is it on?", "modelnya pakai apa?", "tell me more") lean on the
  // previous question for their subject: blend it in, more strongly when the latest has little signal.
  if (userTurns.length > 1) {
    const carry = (hits[0]?.score ?? 0) < WEAK_TOP ? CARRY_WEAK : CARRY;
    const query = new Map(own);
    for (const [t, w] of analyze(userTurns.at(-2)!)) query.set(t, (query.get(t) ?? 0) + w * carry);
    hits = index.search(query, 8);
  }

  const top = hits[0]?.score ?? 0;
  const picked = hits
    .filter((h) => h.score >= MIN_SCORE && h.score >= top * RELATIVE_CUTOFF)
    .slice(0, MAX_CHUNKS);

  const context = [...ALWAYS, ...picked.map((h) => h.doc)]
    .map((c) => `### ${c.title}\n${c.text}`)
    .join("\n\n");

  return {
    context,
    keywords: keywordsOf(latest),
    sources: picked.map((h) => ({ id: h.doc.id, title: h.doc.title, score: Math.round(h.score * 100) / 100 })),
  };
}
