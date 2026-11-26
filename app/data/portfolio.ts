/**
 * Single source of truth for portfolio content. The page components render it
 * and the chat assistant indexes it for retrieval (app/lib/knowledge.ts), so
 * editing something here updates both.
 */

export const profile = {
  name: "Gagah Athallah Fatha",
  roles: ["Business Analyst", "Supply Chain Analyst", "Data Analyst", "AI & Technology Consultant"],
  bio: "I bridge business strategy, data analytics, and technology to solve complex challenges and drive measurable impact. Experienced in translating business needs into analytical frameworks and decision-support systems, with a focus on leveraging AI to optimize decisions and create sustainable value.",
  contact: {
    email: "athallahfatha@gmail.com",
    linkedin: "https://linkedin.com/in/gagahathallahfatha",
    github: "https://github.com/lafatha",
    youtube: "https://www.youtube.com/@GagahAthallahFatha",
    medium: "https://medium.com/@athallahfatha",
    researchgate: "https://www.researchgate.net/profile/Gagah-Athallah-Fatha",
    website: "https://www.gagah.tech",
  },
};

export interface ExperienceItem {
  role: string;
  company: string;
  type?: string;
  dates: string;
  logo?: string | null;
  isGrayBox?: boolean;
}

export const experiences: ExperienceItem[] = [
  {
    role: "T&T - Supply Chain and Network Operations",
    company: "Deloitte",
    type: "Internship",
    dates: "Jun 2026 - Aug 2026",
    logo: "/experience/deloitte.png",
  },
  {
    role: "Business Development",
    company: "PT SAS AERO SISHAN",
    type: "Internship",
    dates: "Feb 2026 - May 2026",
    logo: "/experience/sas.png",
  },
  {
    role: "Warehouse & ERP Development",
    company: "HATA KARYA CV",
    type: "Internship",
    dates: "Dec 2025 - Feb 2026",
    logo: "/experience/hatakarya.png",
  },
  {
    role: "Research and Data Analyst",
    company: "Blockvizo Research",
    dates: "Jun 2024 - Jul 2025",
    logo: "/experience/blockvizo.png",
  },
  {
    role: "Startup Mentee",
    company: "The GreaterHub",
    dates: "Sep 2023 - Dec 2023",
    logo: "/experience/greaterhub.png",
  },
];

export interface EducationItem {
  name: string;
  degree?: string;
  major?: string;
  years?: string;
}

export const education: EducationItem[] = [
  {
    name: "Bandung Institute of Technology",
    degree: "B.Sc. in Management",
    major: "Operations Management",
    years: "2023 - 2026",
  },
];

export const focusAreas = [
  "Business Analysis",
  "Supply Chain Optimization",
  "Enterprise ERP (SAP, Ivalua)",
  "Data Analytics",
  "Machine Learning & AI Engineering",
];

/** Order matters: it is the badge order on the page. Icons live in Skills.tsx. */
export const techStack = [
  "JavaScript", "TypeScript", "Python", "R", "React", "Next.js", "Node.js", "Rust", "Solidity",
  "Tailwind", "Postgre", "MySQL", "SQLite", "Git", "SAP", "Ivalua", "Oracle", "Docker",
];

export const projects = [
  {
    name: "ERPTA",
    date: "Jun 2026",
    url: "https://erpta-bxlx.vercel.app/",
    hasPreview: true,
    projectKey: "erpta",
  },
  {
    name: "Internal Intelligence",
    date: "May 2026",
    url: "https://chat.gagah.tech/",
    hasPreview: true,
    projectKey: "internalIntelligence",
  },
  {
    name: "Narratio AI",
    date: "April 2026",
    url: "https://www.narra.angkasa.tech/",
    hasPreview: true,
    projectKey: "narratioAi",
  },
  {
    name: "Base Realms",
    date: "January 2026",
    url: "https://www.baserealms.app/",
    hasPreview: true,
    projectKey: "baseRealms",
  },
  {
    name: "ERP System",
    date: "December 2025",
    url: "#",
    hasPreview: true,
    projectKey: "erpSystem",
  },
];

export const projectDescriptions: { [key: string]: string | string[] } = {
  erpta: [
    "ERPTA is an open-source, modular ERP system built for the Industry 4.0 course. It was originally implemented for a real SME client, so every record in the public demo is mock data and no company information is exposed. The core idea of Industry 4.0 here is to connect every part of a business (inventory, purchasing, production, logistics, and people) into one digital system that shares data in real time, so decisions come from live numbers instead of spreadsheets and guesswork.",
    "The dashboard gives a live overview of monthly revenue, inventory value, active manufacturing orders, open purchase orders, delayed orders, and low-stock alerts, with a forecasting tab and an AI tab on top. The Inventory module tracks items, transactions, warehouses, stock adjustments, transfers, cycle counts, and FIFO or average-cost valuation. Transportation covers fleet management, shipment tracking, and distribution planning, while HR handles employees, attendance, leave, payroll, recruitment, and performance. Every module uses the same filterable, paginated data grids, so a user learns the interface once and works across the whole system.",
  ],
  internalIntelligence: [
    "Internal Intelligence is an enterprise-grade agentic AI platform designed as an intelligent operating system and internal knowledge workspace. Built for deep autonomous workflows, it features an agentic architecture equipped with reasoning models, real-time web search capabilities, humanized synthesis, and academic retrieval modes. Users can seamlessly orchestrate multi-step tasks, execute complex problem solving, and configure modular agent settings tailored to diverse enterprise and analytical needs.",
    "The platform features an integrated interactive artifacts engine, allowing users to generate, edit, and preview live HTML, CSS, JavaScript, and complex Mermaid diagrams in real time alongside conversational outputs. With granular model selection spanning state-of-the-art LLMs (including Claude Opus and DeepSeek V4), token usage telemetry, and secure workspace authentication, Internal Intelligence bridges conversational AI with production-grade development and enterprise intelligence workflows.",
  ],
  narratioAi: [
    "Narratio AI is a machine learning powered platform designed to help users convert raw data, web insights, and conversations into structured business narratives and consulting style presentation decks. The system combines advanced AI reasoning with classical machine learning models to deliver actionable insights. Large Language Models, such as Qwen 3.6 Plus, are used to generate structured slides that highlight business implications, translate analysis into clear narratives, and maintain a polished consulting style. Users interact via a natural language interface, providing context or data, and the platform transforms it into modular slide components with logical flow, charts, and recommendations, enabling an end to end workflow from research and analysis to presentation-ready outputs.",
    "On the machine learning side, Narratio integrates multiple pipelines to enhance data-driven decision making. Python scripts are used to scrape relevant data from websites, such as news, market reports, and public sources. This unstructured text is processed with a Bidirectional Long Short Term Memory (BiLSTM) model for sentiment analysis, extracting positive, negative, or neutral signals with contextual understanding. These structured sentiment insights are then combined with LLM reasoning to generate slides that reflect market trends, business risks, and strategic recommendations. By merging web scraping, BiLSTM sentiment modeling, and LLM based slide generation, Narratio not only produces visually professional decks but also functions as a machine learning powered business intelligence assistant that supports data-driven consulting decisions.",
  ],
  baseRealms:
    "Base Realms is a transparent, skill-based onchain RPG built on Base that separates gameplay from speculation, using ERC-721 characters and ERC-1155 items to create verifiable ownership without gambling mechanics. It transforms battles into the core economic engine, where rewards are earned through seasonal performance and fully enforced by smart contracts. Designed for crypto-native and normie users alike, Base Realms integrates multi-currency payments and QRIS onboarding to make onchain gaming accessible, fair, and consumer-ready.",
  erpSystem:
    "Supply Chain Management system built as an internal ERP solution. It centralizes inventory tracking, stock monitoring, transaction management, invoicing, PDF reporting, and analytics into a single dashboard interface. The system provides real-time stock visibility, low-stock alerts, monthly revenue tracking, and structured order workflows to streamline operational efficiency. It also includes a locally hosted, private AI assistant for internal data queries and decision support, ensuring company data remains secure and confidential. Due to company privacy policies, additional system modules and screenshots cannot be publicly shared. Overall, the platform functions as a lightweight ERP tailored for operational control, financial tracking, and supply chain optimization.",
};

export interface Post {
  title: string;
  excerpt: string;
  date: string;
  url: string;
  image?: string | null;
}

export const posts: Post[] = [
  {
    title: "What Happens When AI Leaves the Chat Window",
    excerpt:
      "As software shifts from answering isolated prompts to running multi-step jobs in the background, the hardest problem is learning how to steer systems we cannot directly see.",
    date: "Oct 19, 2026",
    url: "https://medium.com/@athallahfatha",
    image: "/posts/1_lsnATTeG_X0BNA_gIgDFOA.webp",
  },
  {
    title: "I Built an AI Agent Lab Using Only Free Servers",
    excerpt:
      "As a student, experimenting with new technologies can be expensive. Running AI tools in the cloud usually requires paying for servers, GPUs, and infrastructure that can easily cost hundreds of dollars per month.",
    date: "Mar 7, 2026",
    url: "https://medium.com/p/ad805bfae420",
    image: "/posts/1_2cTQ1Qq6yHfU0jO4vbJzCw.webp",
  },
  {
    title: "AI is Reshaping How We Work",
    excerpt:
      "You’re not alone if you’ve caught yourself wondering whether AI is the best thing that happened to your work life or something to be worried about. The truth is likely both, but right now, for most of us, it’s turning out to be a pretty useful companion at the desk.",
    date: "Dec 1, 2025",
    url: "https://medium.com/p/41d7605b28a8",
    image: "/posts/1_OcCy_f_LF3esFsBekUygbA.webp",
  },
  {
    title: "Charting the Horizons of Generative AI",
    excerpt:
      "When was the last time you noticed a piece of digital art and questioned whether a human or an algorithm created it? Or watched a robotic process flow through code, tackling challenges with an elegance that belied its non-human origin?",
    date: "Nov 22, 2025",
    url: "https://medium.com/p/14c6c8665aa9",
    image: "/posts/1_5jBH5X5hjbHtNX328DGr6Q.webp",
  },
  {
    title: "Are We Ready to Share Our Homes with Intelligent Machines?",
    excerpt:
      "For decades, the idea of a robot roommate lived in science fiction. Rosie spun through The Jetsons’ living room, C-3PO fussed over galactic royalty. We dreamed about androids who made life easier, less cluttered, maybe even a bit more fun.",
    date: "Nov 3, 2025",
    url: "https://medium.com/p/c2b60aca596f",
    image: "/posts/1_kcPciakwwDzuiWQX5aghjQ.webp",
  },
  {
    title: "I Used Perplexity Comet for 3 Days, Here’s What Happened",
    excerpt:
      "I woke up. No plan, no class today, just vibes. First tab? Medium, some story about AI trading stocks. It’s bold, risky, kind of inspiring. I opened another about the AI pullback. Is the hype slowing? Is tech dying or just changing?",
    date: "Oct 25, 2025",
    url: "https://medium.com/p/33a1a216d921",
    image: "/posts/1_HNK6fZB84rB2gDFW14qDNw.webp",
  },
  {
    title: "When Every Trader Is an Algorithm",
    excerpt:
      "For decades, markets have been emotional places. Prices moved not only because of data but because of people, their fear, greed, excitement, and mistakes.",
    date: "Oct 21, 2025",
    url: "https://medium.com/p/7be17a747847",
    image: "/posts/1_pA-nSJ2VIIJ_RBeWuCfh5Q.webp",
  },
];
