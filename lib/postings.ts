import type { InternshipPosting, Profile } from "./types";

type AdzunaJob = {
  id: string;
  title: string;
  company?: {
    display_name?: string;
  };
  location?: {
    display_name?: string;
  };
  redirect_url: string;
  created?: string;
  description?: string;
  category?: {
    label?: string;
  };
  contract_time?: string;
  contract_type?: string;
};

type SearchPostingsOptions = {
  query?: string;
  location?: string;
  profile?: Profile;
};

export type PostingProvider = "Curated GitHub" | "Curated GitHub + Adzuna" | "Adzuna" | "CareerUp sample";

export type PostingSearchResult = {
  postings: InternshipPosting[];
  provider: PostingProvider;
  usingFallback: boolean;
};

function includesAny(value: string, terms: string[]) {
  const normalized = value.toLowerCase();
  return terms.some((term) => normalized.includes(term.toLowerCase()));
}

function stripHtml(value: string) {
  return decodeHtml(value)
    .replace(/<br\s*\/?>/gi, ", ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function getFirstHref(value: string) {
  const match = value.match(/href=["']([^"']+)["']/i);
  return match ? decodeHtml(match[1]) : "";
}

function makePostingId(source: string, company: string, title: string, url: string) {
  const value = `${source}-${company}-${title}-${url}`;
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return `${source.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${hash.toString(36)}`;
}

function getFitScore(job: Pick<InternshipPosting, "title" | "location" | "description" | "tags">, profile?: Profile) {
  if (!profile) {
    return 72;
  }

  let score = 62;
  const haystack = `${job.title} ${job.description} ${job.tags.join(" ")}`;

  if (profile.targetRoles.length && includesAny(haystack, profile.targetRoles)) {
    score += 20;
  }

  if (profile.targetLocations.length && includesAny(job.location, profile.targetLocations)) {
    score += 12;
  }

  if (job.location.toLowerCase().includes("remote") && profile.targetLocations.some((location) => location.toLowerCase().includes("remote"))) {
    score += 8;
  }

  const resumeMatches = profile.resumeKeywords.filter((keyword) => includesAny(haystack, [keyword]));

  if (resumeMatches.length > 0) {
    score += Math.min(18, resumeMatches.length * 4);
  }

  return Math.min(98, score);
}

function getWorkMode(value: string): InternshipPosting["workMode"] {
  if (/hybrid/i.test(value)) {
    return "hybrid";
  }

  if (/remote|work from home|wfh/i.test(value)) {
    return "remote";
  }

  return "onsite";
}

function getRoleTags(title: string, source: string) {
  const tags = new Set<string>([source]);
  const normalized = title.toLowerCase();

  if (/software|frontend|backend|full stack|developer|firmware|embedded|cloud|systems/.test(normalized)) {
    tags.add("Software Engineering");
  }

  if (/data|analytics|scientist|machine learning|ml|ai|artificial intelligence|research/.test(normalized)) {
    tags.add("Data/AI");
  }

  if (/product/.test(normalized)) {
    tags.add("Product");
  }

  if (/quant|trading|finance/.test(normalized)) {
    tags.add("Quant/Finance");
  }

  if (/hardware|electrical|mechanical|robotics/.test(normalized)) {
    tags.add("Hardware");
  }

  return Array.from(tags).slice(0, 5);
}

function normalizeQuery(searchQuery: string) {
  const query = searchQuery.toLowerCase().includes("intern") ? searchQuery : `${searchQuery} internship`;
  return query.trim();
}

function matchesPostingSearch(posting: InternshipPosting, searchQuery: string, targetLocation: string) {
  const query = searchQuery.trim();
  const location = targetLocation.trim();
  const haystack = `${posting.company} ${posting.title} ${posting.location} ${posting.description} ${posting.tags.join(" ")}`.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  const companyMatch = Boolean(normalizedQuery && posting.company.toLowerCase().includes(normalizedQuery));
  const queryTerms = buildAdzunaQueryVariants(query)
    .flatMap((variant) => variant.toLowerCase().split(/\s+/))
    .filter((term) => term.length > 2 && !["intern", "internship"].includes(term));
  const queryMatch = !queryTerms.length || queryTerms.some((term) => haystack.includes(term));
  const locationMatch = companyMatch || !location || includesAny(posting.location, [location, "remote", "united states", "usa"]);

  return queryMatch && locationMatch;
}

function makeCuratedPosting({
  source,
  company,
  title,
  location,
  url,
  age,
  profile
}: {
  source: string;
  company: string;
  title: string;
  location: string;
  url: string;
  age: string;
  profile?: Profile;
}): InternshipPosting | null {
  const cleanCompany = company.replace(/^🔥\s*/, "").replace(/^↳$/, "").trim();
  const cleanTitle = title.replace(/[🎓🛂🇺🇸🔒🔥]/g, "").replace(/\s+/g, " ").trim();
  const cleanLocation = location.replace(/\s*,\s*/g, ", ").trim() || "United States";
  const cleanUrl = url.trim();

  if (!cleanCompany || !cleanTitle || !cleanUrl || /closed/i.test(cleanTitle)) {
    return null;
  }

  const workMode = getWorkMode(`${cleanTitle} ${cleanLocation}`);
  const posting = {
    id: makePostingId(source, cleanCompany, cleanTitle, cleanUrl),
    company: cleanCompany,
    title: cleanTitle,
    location: cleanLocation,
    source,
    url: cleanUrl,
    remote: workMode === "remote",
    workMode,
    postedAt: age || "Recently",
    tags: getRoleTags(cleanTitle, source),
    description: `${cleanTitle} at ${cleanCompany}. Curated from ${source} with a direct application link.`
  };

  return {
    ...posting,
    fitScore: getFitScore(posting, profile)
  };
}

function parseSimplifyReadme(markdown: string, profile?: Profile) {
  const rows = Array.from(markdown.matchAll(/<tr>([\s\S]*?)<\/tr>/gi));
  const postings: InternshipPosting[] = [];
  let lastCompany = "";

  rows.forEach((row) => {
    const cells = Array.from(row[1].matchAll(/<td>([\s\S]*?)<\/td>/gi)).map((cell) => cell[1]);

    if (cells.length < 5) {
      return;
    }

    const rawCompany = stripHtml(cells[0]);
    const company = rawCompany === "↳" ? lastCompany : rawCompany;
    const title = stripHtml(cells[1]);
    const location = stripHtml(cells[2]);
    const url = getFirstHref(cells[3]);
    const age = stripHtml(cells[4]);

    if (rawCompany && rawCompany !== "↳") {
      lastCompany = rawCompany;
    }

    const posting = makeCuratedPosting({
      source: "Simplify",
      company,
      title,
      location,
      url,
      age,
      profile
    });

    if (posting) {
      postings.push(posting);
    }
  });

  return postings;
}

function parseSpeedyApplyReadme(markdown: string, source: string, profile?: Profile) {
  return markdown
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|") && /<a href=.*<strong>/i.test(line) && /alt="Apply"/i.test(line))
    .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()))
    .map((cells) => {
      const hasSalary = cells.length >= 6;
      const company = stripHtml(cells[0] ?? "");
      const title = stripHtml(cells[1] ?? "");
      const location = stripHtml(cells[2] ?? "");
      const postingCell = cells[hasSalary ? 4 : 3] ?? "";
      const age = stripHtml(cells[hasSalary ? 5 : 4] ?? "");
      const url = getFirstHref(postingCell);

      return makeCuratedPosting({
        source,
        company,
        title,
        location,
        url,
        age,
        profile
      });
    })
    .filter((posting): posting is InternshipPosting => Boolean(posting));
}

async function fetchText(url: string) {
  const response = await fetch(url, {
    next: { revalidate: 1800 }
  });

  if (!response.ok) {
    return "";
  }

  return response.text();
}

async function searchCuratedGithubPostings(searchQuery: string, targetLocation: string, profile?: Profile): Promise<PostingSearchResult | null> {
  const [simplifyReadme, speedySweReadme, speedyAiReadme] = await Promise.all([
    fetchText("https://raw.githubusercontent.com/SimplifyJobs/Summer2026-Internships/dev/README.md"),
    fetchText("https://raw.githubusercontent.com/speedyapply/2026-SWE-College-Jobs/main/README.md"),
    fetchText("https://raw.githubusercontent.com/speedyapply/2026-AI-College-Jobs/main/README.md")
  ]);

  const postings = [
    ...parseSimplifyReadme(simplifyReadme, profile),
    ...parseSpeedyApplyReadme(speedySweReadme, "SpeedyApply SWE", profile),
    ...parseSpeedyApplyReadme(speedyAiReadme, "SpeedyApply AI", profile)
  ].filter((posting) => matchesPostingSearch(posting, searchQuery, targetLocation));

  const deduped = dedupePostings(postings);

  return deduped.length > 0
    ? {
        provider: "Curated GitHub",
        usingFallback: false,
        postings: deduped.slice(0, 50)
      }
    : null;
}

function dedupePostings(postings: InternshipPosting[]) {
  const collectedPostings = new Map<string, InternshipPosting>();

  postings.forEach((posting) => {
    const normalizedUrl = posting.url.replace(/[?#].*$/, "").toLowerCase();
    const fallbackKey = `${posting.company}-${posting.title}-${posting.location}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const key = normalizedUrl || fallbackKey;
    const existing = collectedPostings.get(key);

    if (!existing || posting.fitScore > existing.fitScore) {
      collectedPostings.set(key, posting);
    }
  });

  return Array.from(collectedPostings.values()).sort((a, b) => {
    const aAge = parsePostingAge(a.postedAt);
    const bAge = parsePostingAge(b.postedAt);

    if (aAge !== bAge) {
      return aAge - bAge;
    }

    return b.fitScore - a.fitScore;
  });
}

function parsePostingAge(value: string) {
  const daysMatch = value.match(/^(\d+)d$/i);
  if (daysMatch) {
    return Number(daysMatch[1]);
  }

  const monthMatch = value.match(/^(\d+)\s*mo/i);
  if (monthMatch) {
    return Number(monthMatch[1]) * 30;
  }

  const parsedDate = Date.parse(value);
  return Number.isNaN(parsedDate) ? 999 : Math.max(0, Math.round((Date.now() - parsedDate) / 86_400_000));
}

function buildAdzunaQueryVariants(searchQuery: string) {
  const cleanQuery = searchQuery.trim();
  const variants = [
    cleanQuery,
    cleanQuery.toLowerCase().includes("intern") ? cleanQuery : `${cleanQuery} intern`,
    normalizeQuery(cleanQuery)
  ];

  if (/data scientist/i.test(cleanQuery)) {
    variants.push(cleanQuery.replace(/data scientist/gi, "data intern"));
    variants.push("data analyst intern");
  }

  if (/software engineer/i.test(cleanQuery)) {
    variants.push(cleanQuery.replace(/software engineer/gi, "software intern"));
    variants.push("software engineering intern");
  }

  if (/product manager|product management/i.test(cleanQuery)) {
    variants.push("product intern");
    variants.push("product management intern");
  }

  const firstWord = cleanQuery.split(/\s+/)[0];
  if (firstWord && !/intern/i.test(firstWord)) {
    variants.push(`${firstWord} intern`);
  }

  variants.push("internship");

  return Array.from(new Set(variants.map((variant) => variant.trim()).filter(Boolean)));
}

function fallbackPostings(profile?: Profile): PostingSearchResult {
  const seed = [
    {
      id: "fallback-software",
      company: "Northstar Labs",
      title: "Software Engineering Intern",
      location: "Remote",
      source: "CareerUp sample",
      url: "https://example.com/software-engineering-intern",
      remote: true,
      workMode: "remote" as const,
      postedAt: "Sample",
      tags: ["Software Engineering", "React", "TypeScript"],
      description: "Build user-facing product features with a small engineering team."
    },
    {
      id: "fallback-data",
      company: "BlueGrid AI",
      title: "Data Science Intern",
      location: "New York, NY",
      source: "CareerUp sample",
      url: "https://example.com/data-science-intern",
      remote: false,
      workMode: "onsite" as const,
      postedAt: "Sample",
      tags: ["Data", "Python", "Analytics"],
      description: "Analyze datasets, build dashboards, and support product experiments."
    },
    {
      id: "fallback-product",
      company: "Summit Systems",
      title: "Product Management Intern",
      location: "Washington, DC",
      source: "CareerUp sample",
      url: "https://example.com/product-management-intern",
      remote: false,
      workMode: "onsite" as const,
      postedAt: "Sample",
      tags: ["Product", "Research", "Strategy"],
      description: "Work with design and engineering to scope student-facing features."
    }
  ];

  return {
    provider: "CareerUp sample",
    usingFallback: true,
    postings: seed.map((posting) => ({
      ...posting,
      fitScore: getFitScore(posting, profile)
    }))
  };
}

async function searchAdzunaPostings(searchQuery: string, targetLocation: string, profile?: Profile): Promise<PostingSearchResult | null> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    return null;
  }

  const locationAttempts = targetLocation ? [targetLocation, ""] : [""];
  const collectedPostings = new Map<string, InternshipPosting>();

  for (const locationAttempt of locationAttempts) {
    for (const variant of buildAdzunaQueryVariants(searchQuery)) {
      const url = new URL("https://api.adzuna.com/v1/api/jobs/us/search/1");
      url.searchParams.set("app_id", appId);
      url.searchParams.set("app_key", appKey);
      url.searchParams.set("results_per_page", "24");
      url.searchParams.set("content-type", "application/json");
      url.searchParams.set("sort_by", "date");
      url.searchParams.set("what", variant);

      if (locationAttempt) {
        url.searchParams.set("where", locationAttempt);
      }

      const response = await fetch(url, {
        cache: "no-store"
      });

      if (!response.ok) {
        continue;
      }

      const payload = (await response.json()) as { results?: AdzunaJob[] };
      const jobs = payload.results ?? [];
      jobs
        .map((job): InternshipPosting => {
          const description = stripHtml(job.description ?? "");
          const tags = [job.category?.label, job.contract_time, job.contract_type].filter(Boolean) as string[];
          const workMode = getWorkMode(`${job.title} ${job.location?.display_name ?? ""} ${description}`);
          const posting = {
            id: `adzuna-${job.id}`,
            company: job.company?.display_name ?? "Unknown company",
            title: job.title,
            location: job.location?.display_name ?? (locationAttempt || targetLocation || "United States"),
            source: "Adzuna",
            url: job.redirect_url,
            remote: workMode === "remote",
            workMode,
            postedAt: job.created ? new Date(job.created).toLocaleDateString() : "Recently",
            tags: tags.slice(0, 5),
            description: description.slice(0, 220)
          };

          return {
            ...posting,
            fitScore: getFitScore(posting, profile)
          };
        })
        .filter((posting) => /intern|internship|student|new grad|graduate|emerging talent|early career/i.test(`${posting.title} ${posting.description}`))
        .forEach((posting) => {
          collectedPostings.set(posting.url, posting);
        });

      if (collectedPostings.size >= 24) {
        return {
          provider: "Adzuna",
          usingFallback: false,
          postings: Array.from(collectedPostings.values()).slice(0, 24)
        };
      }
    }

    if (collectedPostings.size >= 6) {
      break;
    }
  }

  if (collectedPostings.size > 0) {
    return {
      provider: "Adzuna",
      usingFallback: false,
      postings: Array.from(collectedPostings.values()).slice(0, 24)
    };
  }

  return null;
}

export async function searchInternshipPostings({ query, location, profile }: SearchPostingsOptions = {}): Promise<PostingSearchResult> {
  const searchQuery = query?.trim() || profile?.targetRoles[0] || "intern";
  const targetLocation = typeof location === "string" ? location.trim() : query?.trim() ? "" : profile?.targetLocations[0] || "";

  try {
    const curatedResults = await searchCuratedGithubPostings(searchQuery, targetLocation, profile);
    const adzunaResults = await searchAdzunaPostings(searchQuery, targetLocation, profile);

    if (curatedResults && adzunaResults) {
      return {
        provider: "Curated GitHub + Adzuna",
        usingFallback: false,
        postings: dedupePostings([...curatedResults.postings, ...adzunaResults.postings]).slice(0, 60)
      };
    }

    if (curatedResults) {
      return curatedResults;
    }

    if (adzunaResults) {
      return adzunaResults;
    }

    return fallbackPostings(profile);
  } catch {
    return fallbackPostings(profile);
  }
}
