import type { InternshipPosting, Profile } from "./types";

type RemotiveJob = {
  id: number;
  title: string;
  company_name: string;
  candidate_required_location: string;
  url: string;
  publication_date: string;
  tags?: string[];
  description?: string;
};

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

export type PostingProvider = "Adzuna" | "Remotive" | "CareerUp sample";

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
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
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

  return Math.min(98, score);
}

function normalizeQuery(searchQuery: string) {
  const query = searchQuery.toLowerCase().includes("intern") ? searchQuery : `${searchQuery} internship`;
  return query.trim();
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
      const postings = jobs
        .map((job): InternshipPosting => {
          const description = stripHtml(job.description ?? "");
          const tags = [job.category?.label, job.contract_time, job.contract_type].filter(Boolean) as string[];
          const posting = {
            id: `adzuna-${job.id}`,
            company: job.company?.display_name ?? "Unknown company",
            title: job.title,
            location: job.location?.display_name ?? (locationAttempt || targetLocation || "United States"),
            source: "Adzuna",
            url: job.redirect_url,
            remote: /remote/i.test(`${job.title} ${job.location?.display_name ?? ""} ${description}`),
            postedAt: job.created ? new Date(job.created).toLocaleDateString() : "Recently",
            tags: tags.slice(0, 5),
            description: description.slice(0, 220)
          };

          return {
            ...posting,
            fitScore: getFitScore(posting, profile)
          };
        })
        .filter((posting) => /intern|internship|student|new grad|graduate/i.test(`${posting.title} ${posting.description}`))
        .slice(0, 12);

      if (postings.length > 0) {
        return {
          provider: "Adzuna",
          usingFallback: false,
          postings
        };
      }
    }
  }

  return null;
}

async function searchRemotivePostings(searchQuery: string, targetLocation: string, profile?: Profile): Promise<PostingSearchResult | null> {
  const url = new URL("https://remotive.com/api/remote-jobs");
  url.searchParams.set("search", normalizeQuery(searchQuery));
  url.searchParams.set("limit", "20");

  const response = await fetch(url, {
    next: { revalidate: 900 }
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as { jobs?: RemotiveJob[] };
  const jobs = payload.jobs ?? [];

  const postings = jobs
    .map((job): InternshipPosting => {
      const description = stripHtml(job.description ?? "");
      const posting = {
        id: `remotive-${job.id}`,
        company: job.company_name,
        title: job.title,
        location: job.candidate_required_location || "Remote",
        source: "Remotive",
        url: job.url,
        remote: true,
        postedAt: job.publication_date ? new Date(job.publication_date).toLocaleDateString() : "Recently",
        tags: job.tags?.slice(0, 5) ?? [],
        description: description.slice(0, 180)
      };

      return {
        ...posting,
        fitScore: getFitScore(posting, profile)
      };
    })
    .filter((posting) => {
      const internshipTermMatch = /intern|internship|student|new grad/i.test(`${posting.title} ${posting.description}`);
      const locationMatch = targetLocation ? includesAny(posting.location, [targetLocation, "remote"]) : true;

      return internshipTermMatch && locationMatch;
    })
    .slice(0, 12);

  return postings.length > 0
    ? {
        provider: "Remotive",
        usingFallback: false,
        postings
      }
    : null;
}

export async function searchInternshipPostings({ query, location, profile }: SearchPostingsOptions = {}): Promise<PostingSearchResult> {
  const searchQuery = query?.trim() || profile?.targetRoles[0] || "intern";
  const targetLocation = location?.trim() || profile?.targetLocations[0] || "";

  try {
    const adzunaResults = await searchAdzunaPostings(searchQuery, targetLocation, profile);

    if (adzunaResults) {
      return adzunaResults;
    }

    const remotiveResults = await searchRemotivePostings(searchQuery, targetLocation, profile);

    if (remotiveResults) {
      return remotiveResults;
    }

    return fallbackPostings(profile);
  } catch {
    return fallbackPostings(profile);
  }
}
