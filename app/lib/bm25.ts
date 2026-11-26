/**
 * Small bilingual (Indonesian + English) BM25 search. No model, no network:
 * classic keyword retrieval with light stemming and a concept dictionary so an
 * Indonesian question ("pengalaman kerja") can hit English content ("experience").
 *
 * Every token is expanded into weighted variants:
 *   raw word (1.0) > concept tag (0.8) > stemmed forms (0.7)
 * Documents get the same expansion, so exact matches always outrank fuzzy ones.
 */

const K1 = 1.2;
const B = 0.75;

const STOPWORDS = new Set([
  // English
  "a", "an", "the", "and", "or", "but", "if", "of", "to", "in", "on", "at", "by", "for", "with", "about",
  "from", "into", "as", "is", "are", "was", "were", "be", "been", "being", "am", "do", "does", "did",
  "have", "has", "had", "i", "me", "my", "you", "your", "he", "him", "his", "she", "her", "it", "its",
  "we", "our", "they", "them", "their", "this", "that", "these", "those", "what", "which", "who", "whom",
  "how", "why", "when", "where", "can", "could", "would", "should", "will", "shall", "may", "might",
  "please", "tell", "know", "any", "some", "so", "than", "then", "there", "here", "just", "also", "very",
  "s", "t", "don", "doesn", "out", "up", "more", "most", "all", "much", "many", "us", "let", "lets",
  "hi", "hello", "hey", "thanks", "thank", "okay", "ok", "yes", "no", "not", "like", "give",
  // Indonesian
  "yang", "dan", "di", "ke", "dari", "ini", "itu", "dengan", "untuk", "adalah", "ialah", "tidak", "bukan",
  "saya", "aku", "kamu", "anda", "dia", "ia", "beliau", "mereka", "kita", "kami", "juga", "bisa", "dapat",
  "sudah", "telah", "akan", "atau", "pada", "dalam", "ada", "karena", "seperti", "lebih", "tentang",
  "apa", "apakah", "siapa", "bagaimana", "gimana", "kenapa", "mengapa", "kapan", "mana", "dimana",
  "berapa", "tolong", "coba", "dong", "deh", "sih", "nih", "ya", "yah", "kah", "lah", "pun", "nya",
  "sama", "jadi", "kalau", "kalo", "aja", "saja", "udah", "belum", "masih", "banget", "sangat", "bro",
  "halo", "hai", "terima", "kasih", "makasih", "oke", "iya", "gak", "ga", "nggak", "tidak", "mau",
  "ceritain", "ceritakan", "jelaskan", "jelasin", "kasih", "tahu", "tau", "punya", "sebutkan", "apa",
]);

/** Concept groups: any member (word or phrase) adds the group's tag token. */
const CONCEPTS: Record<string, string[]> = {
  experience: [
    "experience", "experiences", "work", "worked", "working", "job", "jobs", "career", "employment",
    "intern", "internship", "internships", "position", "role", "company", "companies", "worked at",
    "pengalaman", "kerja", "bekerja", "pekerjaan", "karir", "karier", "magang", "posisi", "jabatan",
    "perusahaan", "kantor", "riwayat kerja",
  ],
  education: [
    "education", "study", "studied", "studies", "university", "college", "campus", "degree", "major",
    "bachelor", "school", "graduate", "graduated", "itb", "bsc", "gpa",
    "pendidikan", "kuliah", "kampus", "universitas", "jurusan", "gelar", "sarjana", "sekolah", "lulus",
    "lulusan", "prodi", "program studi", "institut",
  ],
  project: [
    "project", "projects", "built", "build", "building", "made", "make", "created", "create", "portfolio",
    "app", "apps", "application", "platform", "product", "products", "developed", "develop", "side project",
    "proyek", "projek", "project", "bikin", "dibikin", "buat", "dibuat", "membuat", "membangun", "dibangun",
    "aplikasi", "produk", "karya", "portofolio", "mengembangkan", "dikembangkan",
  ],
  skill: [
    "skill", "skills", "tech stack", "stack", "technology", "technologies", "tools", "tool", "language",
    "languages", "programming", "framework", "frameworks", "expertise", "proficient", "code", "coding",
    "keahlian", "kemampuan", "kemahiran", "teknologi", "bahasa pemrograman", "pemrograman", "ngoding",
    "koding", "menguasai", "dikuasai", "jago",
  ],
  contact: [
    "contact", "email", "mail", "reach", "hire", "hiring", "linkedin", "github", "youtube", "medium",
    "researchgate", "social", "socials", "connect", "phone", "touch",
    "kontak", "hubungi", "menghubungi", "dihubungi", "surel", "sosmed", "media sosial", "rekrut",
  ],
  writing: [
    "post", "posts", "article", "articles", "blog", "write", "writes", "wrote", "written", "writing",
    "publication", "essay", "medium",
    "artikel", "tulisan", "menulis", "ditulis", "nulis", "postingan", "blog",
  ],
  ai: [
    "ai", "artificial intelligence", "llm", "llms", "agent", "agents", "agentic", "chatbot", "gpt",
    "language model", "reasoning", "generative",
    "kecerdasan buatan", "kecerdasan artifisial",
  ],
  ml: [
    "machine learning", "ml", "model", "models", "bilstm", "lstm", "deep learning", "neural", "sentiment",
    "classification", "forecasting", "prediction",
    "pembelajaran mesin", "sentimen", "prediksi", "peramalan",
  ],
  erp: [
    "erp", "enterprise resource planning", "sap", "ivalua", "oracle", "inventory", "warehouse", "stock",
    "procurement", "purchasing", "invoice", "invoicing",
    "persediaan", "gudang", "stok", "pengadaan", "pembelian", "faktur",
  ],
  supplychain: [
    "supply chain", "logistics", "operations", "operation", "network operations", "distribution",
    "transportation", "shipment", "fleet",
    "rantai pasok", "rantai pasokan", "logistik", "operasional", "operasi", "distribusi", "transportasi",
    "pengiriman",
  ],
  consulting: [
    "consulting", "consultant", "consultancy", "advisory", "deloitte", "transformation",
    "konsultan", "konsultasi", "transformasi",
  ],
  data: [
    "data", "analytics", "analysis", "analyst", "analyze", "research", "researcher", "insight", "insights",
    "dashboard", "visualization",
    "analisis", "analisa", "analis", "riset", "penelitian", "peneliti", "wawasan",
  ],
  business: [
    "business", "business development", "strategy", "startup", "startups", "entrepreneur", "market",
    "bisnis", "usaha", "strategi", "pengembangan bisnis", "wirausaha", "pasar",
  ],
  blockchain: [
    "blockchain", "onchain", "web3", "crypto", "nft", "erc", "smart contract", "smart contracts", "base",
    "solidity", "token", "game", "gaming", "rpg",
    "kripto", "permainan", "gim",
  ],
  presentation: [
    "presentation", "presentations", "slide", "slides", "deck", "decks", "pitch",
    "presentasi", "salindia",
  ],
  web: [
    "website", "web", "frontend", "backend", "fullstack", "full stack", "react", "nextjs", "next",
    "typescript", "javascript", "nodejs", "tailwind",
    "situs", "laman", "halaman web",
  ],
  algorithm: ["algorithm", "algorithms", "algorithmic", "algoritma", "algoritmik"],
  trading: ["trading", "trader", "traders", "trade", "market", "markets", "stock market", "saham", "pasar modal", "perdagangan"],
  identity: [
    "who", "about", "background", "profile", "bio", "introduce", "introduction", "summary", "himself",
    "profil", "latar belakang", "perkenalan", "kenalan", "perkenalkan", "tentang dia",
  ],
};

const termConcept = new Map<string, string>();
const phraseConcepts: [RegExp, string][] = [];
for (const [concept, terms] of Object.entries(CONCEPTS)) {
  for (const t of terms) {
    if (t.includes(" ")) phraseConcepts.push([new RegExp(`\\b${t}\\b`, "g"), concept]);
    else if (!termConcept.has(t)) termConcept.set(t, concept);
  }
}

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’']s\b/g, "") // possessive: gagah's -> gagah
    .replace(/\b([a-z0-9]+)\.(js|ts)\b/g, "$1$2") // next.js -> nextjs
    .replace(/\bb\.sc\.?/g, "bsc")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function stemEn(w: string): string {
  if (w.length <= 4) return w;
  if (w.endsWith("ies")) return w.slice(0, -3) + "y";
  if (w.endsWith("sses")) return w.slice(0, -2);
  if (w.endsWith("ing") && w.length > 6) return w.slice(0, -3);
  if (w.endsWith("ed") && w.length > 5) return w.slice(0, -2);
  if (w.endsWith("ly") && w.length > 5) return w.slice(0, -2);
  if (w.endsWith("er") && w.length > 5) return w.slice(0, -2); // trader -> trad (matches trading)
  if (w.endsWith("s") && !w.endsWith("ss") && !w.endsWith("us") && !w.endsWith("is")) return w.slice(0, -1);
  return w;
}

/** Indonesian affix stripping; returns every intermediate form so "jurusannya" also yields "jurusan". */
function stemId(w: string): string[] {
  if (w.length <= 5) return [];
  const forms: string[] = [];
  let s = w;
  const step = (next: string) => {
    if (next !== s && next.length >= 3) {
      s = next;
      forms.push(s);
    }
  };
  step(s.replace(/(lah|kah|pun|tah)$/, ""));
  step(s.replace(/(nya|ku|mu)$/, ""));
  if (s.length > 6) step(s.replace(/(kan|an)$/, ""));
  const pre = s.match(/^(meng|meny|mem|men|me|peng|peny|pem|pen|pe|ber|be|ter|di|ke|se)/);
  if (pre && s.length - pre[0].length >= 4) step(s.slice(pre[0].length));
  return forms;
}

/** Indonesian loanwords back to English spelling: transformasi -> transformation, organisasi -> organization. */
function loanword(w: string): string | null {
  if (w.length < 7) return null;
  if (w.endsWith("isasi")) return w.slice(0, -5) + "ization";
  if (w.endsWith("asi")) return w.slice(0, -3) + "ation";
  if (w.endsWith("itas")) return w.slice(0, -4) + "ity";
  return null;
}

/** The meaningful words of a question, for showing what was searched. */
export function keywordsOf(text: string): string[] {
  return [...new Set(normalize(text).split(" ").filter((w) => w && !STOPWORDS.has(w)))];
}

/** Weighted term bag for a piece of text. */
export function analyze(text: string): Map<string, number> {
  const norm = normalize(text);
  const out = new Map<string, number>();
  const add = (t: string, w: number) => out.set(t, (out.get(t) ?? 0) + w);

  for (const [re, concept] of phraseConcepts) {
    re.lastIndex = 0;
    const hits = norm.match(re);
    if (hits) add(`#${concept}`, 0.8 * hits.length);
  }

  for (const raw of norm.split(" ")) {
    if (!raw) continue;
    if (STOPWORDS.has(raw)) {
      // "who", "about" carry no keyword signal but still say what kind of question it is
      const c = termConcept.get(raw);
      if (c) add(`#${c}`, 0.8);
      continue;
    }
    add(raw, 1);
    const forms = new Set([stemEn(raw), ...stemId(raw)]);
    const loan = loanword(raw);
    if (loan) forms.add(loan);
    forms.delete(raw);
    for (const f of forms) add(f, 0.7);
    const concept = termConcept.get(raw) ?? [...forms].map((f) => termConcept.get(f)).find(Boolean);
    if (concept) add(`#${concept}`, 0.8);
  }
  return out;
}

export interface Doc {
  id: string;
  title: string;
  text: string;
  /** extra search terms (aliases, translations) that are indexed but not shown to the LLM */
  keywords?: string;
}

export interface Hit<T extends Doc> {
  doc: T;
  score: number;
}

export class BM25<T extends Doc> {
  private docs: T[];
  private tfs: Map<string, number>[];
  private lens: number[];
  private avgLen: number;
  private df = new Map<string, number>();

  constructor(docs: T[]) {
    this.docs = docs;
    this.tfs = docs.map((d) => {
      const tf = analyze(`${d.text} ${d.keywords ?? ""}`);
      // title counts double
      for (const [t, w] of analyze(d.title)) tf.set(t, (tf.get(t) ?? 0) + 2 * w);
      return tf;
    });
    this.lens = this.tfs.map((tf) => [...tf.values()].reduce((a, b) => a + b, 0));
    this.avgLen = this.lens.reduce((a, b) => a + b, 0) / Math.max(1, docs.length);
    for (const tf of this.tfs) for (const t of tf.keys()) this.df.set(t, (this.df.get(t) ?? 0) + 1);
  }

  private idf(term: string) {
    const n = this.df.get(term) ?? 0;
    return Math.log(1 + (this.docs.length - n + 0.5) / (n + 0.5));
  }

  /** query terms carry their own weights (from analyze); repeated query words don't stack past 1x */
  search(query: Map<string, number>, limit = 5): Hit<T>[] {
    const hits: Hit<T>[] = [];
    this.tfs.forEach((tf, i) => {
      let score = 0;
      for (const [term, qw] of query) {
        const f = tf.get(term);
        if (!f) continue;
        const norm = f + K1 * (1 - B + (B * this.lens[i]) / this.avgLen);
        score += Math.min(qw, 1) * this.idf(term) * ((f * (K1 + 1)) / norm);
      }
      if (score > 0) hits.push({ doc: this.docs[i], score });
    });
    return hits.sort((a, b) => b.score - a.score).slice(0, limit);
  }
}
