const keywordGroups = [
  "python",
  "java",
  "javascript",
  "typescript",
  "react",
  "next.js",
  "node",
  "express",
  "sql",
  "postgres",
  "supabase",
  "mongodb",
  "aws",
  "azure",
  "docker",
  "kubernetes",
  "git",
  "html",
  "css",
  "tailwind",
  "figma",
  "excel",
  "tableau",
  "power bi",
  "pandas",
  "numpy",
  "scikit-learn",
  "tensorflow",
  "pytorch",
  "machine learning",
  "data science",
  "data analysis",
  "analytics",
  "api",
  "rest",
  "graphql",
  "frontend",
  "backend",
  "full stack",
  "mobile",
  "ios",
  "android",
  "swift",
  "kotlin",
  "c++",
  "c#",
  "r",
  "matlab",
  "product management",
  "user research",
  "agile",
  "scrum",
  "testing",
  "automation",
  "cloud",
  "security",
  "cybersecurity",
  "linux"
];

const stopWords = new Set([
  "and",
  "the",
  "for",
  "with",
  "from",
  "this",
  "that",
  "have",
  "using",
  "into",
  "your",
  "you",
  "are",
  "was",
  "were",
  "will",
  "can",
  "our",
  "their",
  "project",
  "work",
  "team",
  "experience",
  "skills",
  "education",
  "university",
  "college"
]);

export function normalizeResumeText(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, 18_000);
}

type UploadedResumeFile = {
  name: string;
  arrayBuffer: () => Promise<ArrayBuffer>;
  text: () => Promise<string>;
};

export async function extractResumeTextFromFile(file: UploadedResumeFile) {
  const fileName = file.name.toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());

  if (fileName.endsWith(".pdf")) {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });

    try {
      const result = await parser.getText();
      return normalizeResumeText(result.text ?? "");
    } finally {
      await parser.destroy();
    }
  }

  if (fileName.endsWith(".docx")) {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return normalizeResumeText(result.value ?? "");
  }

  return normalizeResumeText(await file.text());
}

export function extractResumeKeywords(text: string) {
  const normalized = normalizeResumeText(text).toLowerCase();
  const keywords = new Set<string>();

  keywordGroups.forEach((keyword) => {
    if (normalized.includes(keyword)) {
      keywords.add(keyword);
    }
  });

  normalized
    .match(/\b[a-z][a-z+#.-]{2,}\b/g)
    ?.filter((word) => !stopWords.has(word))
    .slice(0, 300)
    .forEach((word) => {
      if (keywords.size < 24 && /[+#.]|sql|api|cloud|data|design|engineer|analyst|product|research|software/.test(word)) {
        keywords.add(word);
      }
    });

  return Array.from(keywords).slice(0, 24);
}
