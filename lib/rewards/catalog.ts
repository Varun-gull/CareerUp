import type { Reward } from "@/lib/types";

export const rewardCatalog: Array<Omit<Reward, "unlocked">> = [
  {
    id: "behavioral-interview-pack",
    title: "Behavioral Interview Builder",
    description: "Unlock the STAR answer builder and a bank of high-frequency internship prompts.",
    category: "Interview prep",
    xpCost: 100,
    contents: [
      "Tell me about a time you solved a difficult problem.",
      "Describe a project where you had to learn something quickly.",
      "Tell me about a time you worked through conflict on a team.",
      "STAR frame: Situation, Task, Action, Result. Keep each answer under 90 seconds."
    ]
  },
  {
    id: "recruiter-message-kit",
    title: "Recruiter Message Kit",
    description: "Copy-ready message templates for recruiters, alumni, and hiring managers.",
    category: "Networking",
    xpCost: 120,
    contents: [
      "LinkedIn recruiter opener: role interest, one matching project, and a direct ask.",
      "Alumni message: school connection, concise background, and 15-minute coffee chat ask.",
      "Follow-up after applying: application link, resume attached, and one relevant proof point.",
      "Referral thank-you note with next-step tracking."
    ]
  },
  {
    id: "technical-screen-checklist",
    title: "Technical Screen Checklist",
    description: "A pre-interview checklist for coding, data, and technical internship screens.",
    category: "Technical prep",
    xpCost: 160,
    contents: [
      "Review arrays, hash maps, strings, sorting, recursion, and basic graph traversal.",
      "Prepare one project deep dive: goal, stack, tradeoffs, bug, metric, and next improvement.",
      "Practice explaining your approach out loud before writing code.",
      "End every answer with complexity, tests, and edge cases."
    ]
  },
  {
    id: "application-quality-audit",
    title: "Application Quality Audit",
    description: "A final checklist before submitting high-priority applications.",
    category: "Applications",
    xpCost: 90,
    contents: [
      "Resume filename is professional and company-specific.",
      "Top third of resume matches at least three posting keywords truthfully.",
      "Portfolio, GitHub, and LinkedIn links open correctly.",
      "Application answers include role-specific details instead of generic text.",
      "Deadline and follow-up reminder are added to the calendar."
    ]
  },
  {
    id: "company-research-template",
    title: "Company Research Template",
    description: "Turn a job posting into a focused interview prep brief.",
    category: "Research",
    xpCost: 80,
    contents: [
      "Company mission in one sentence.",
      "Product or team you are most excited about.",
      "Three details from the internship posting that match your experience.",
      "Two thoughtful questions for the interviewer."
    ]
  },
  {
    id: "resume-bullet-scorer",
    title: "Resume Bullet Scorer",
    description: "A simple rubric for making resume bullets stronger before applying.",
    category: "Resume",
    xpCost: 130,
    contents: [
      "Score 1 point for a strong action verb.",
      "Score 1 point for a clear technical skill or tool.",
      "Score 1 point for measurable impact.",
      "Score 1 point for business/user context.",
      "Rewrite any bullet under 3 points before sending an application."
    ]
  },
  {
    id: "follow-up-calendar-system",
    title: "Follow-up Calendar System",
    description: "A timing system for follow-ups after applications, interviews, and recruiter messages.",
    category: "Organization",
    xpCost: 110,
    contents: [
      "Application follow-up: 7 to 10 business days after applying.",
      "Recruiter message follow-up: 4 business days after no response.",
      "Interview thank-you: same day, ideally within 6 hours.",
      "Final status check: one week after the promised decision window."
    ]
  },
  {
    id: "offer-negotiation-primer",
    title: "Offer Negotiation Primer",
    description: "A prep sheet for comparing internship offers and asking smart questions.",
    category: "Offers",
    xpCost: 240,
    contents: [
      "Compare hourly pay, housing, relocation, return offer rate, team quality, and project scope.",
      "Ask about mentor assignment, intern conversion process, and performance expectations.",
      "Use a polite negotiation frame: appreciation, competing context, specific ask, flexibility.",
      "Never invent competing offers or deadlines."
    ]
  }
];
