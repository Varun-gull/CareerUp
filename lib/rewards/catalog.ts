import type { Reward } from "@/lib/types";

export const rewardCatalog: Array<Omit<Reward, "unlocked">> = [
  {
    id: "behavioral-interview-pack",
    title: "Behavioral Interview Pack",
    description: "Practice high-frequency internship interview prompts with a STAR response structure.",
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
  }
];
