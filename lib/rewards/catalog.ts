import type { Reward } from "@/lib/types";

export const rewardCatalog: Array<Omit<Reward, "unlocked">> = [
  {
    id: "behavioral-interview-pack",
    title: "Behavioral Interview Prep Kit",
    description: "Unlock STAR prompts, answer structure, and story checkpoints for behavioral interviews.",
    category: "Interview prep",
    xpCost: 140,
    contents: [
      "Core prompts: conflict, leadership, failure, fast learning, teamwork, and technical problem solving.",
      "STAR structure: 15 seconds for context, 15 for your task, 45 for action, 15 for result.",
      "Story bank checklist: project story, team story, challenge story, and growth story.",
      "Final pass: add one metric, one tradeoff, and one lesson to every answer."
    ]
  },
  {
    id: "recruiter-message-kit",
    title: "Recruiter Outreach Pack",
    description: "Message templates for recruiters, alumni, referrals, and follow-ups after applying.",
    category: "Networking",
    xpCost: 130,
    contents: [
      "Recruiter opener: role interest, one matching project, and one clear next step.",
      "Alumni message: shared school connection, concise background, and 15-minute call ask.",
      "Referral ask: role link, two matching proof points, and a polished resume note.",
      "Follow-up cadence: 4 business days after outreach, 7 to 10 business days after applying."
    ]
  },
  {
    id: "technical-screen-checklist",
    title: "Technical Screen Prep Plan",
    description: "A focused prep plan for SWE, data, product, and technical internship interviews.",
    category: "Technical prep",
    xpCost: 175,
    contents: [
      "SWE track: arrays, hash maps, strings, sorting, recursion, graphs, complexity, and edge cases.",
      "Data track: SQL joins, grouping, window functions, experiment metrics, and dashboard storytelling.",
      "Project deep dive: goal, stack, tradeoffs, bug, metric, and next improvement.",
      "Mock flow: clarify, outline approach, solve, test, discuss complexity, and summarize."
    ]
  },
  {
    id: "application-quality-audit",
    title: "High-Priority Application Checklist",
    description: "A submission checklist for roles you care about most, before you hit apply.",
    category: "Applications",
    xpCost: 80,
    contents: [
      "Match the resume headline or top project to the role's core skill.",
      "Add three truthful keywords from the posting into the resume or short answers.",
      "Check that LinkedIn, GitHub, portfolio, and resume links open correctly.",
      "Use a company-specific sentence instead of a generic interest statement.",
      "Save the role, deadline, and follow-up reminder in CareerUp."
    ]
  },
  {
    id: "company-research-template",
    title: "Company Research Brief",
    description: "Turn any job posting into a short company brief before applying or interviewing.",
    category: "Research",
    xpCost: 90,
    contents: [
      "Company snapshot: mission, product, customer, and recent company news.",
      "Role match: three posting details that connect to your projects or coursework.",
      "Team questions: ask about intern ownership, mentorship, metrics, and return offers.",
      "Interview angle: one reason the company fits your goals beyond brand name."
    ]
  },
  {
    id: "resume-bullet-scorer",
    title: "Resume Keyword Tailor Kit",
    description: "A practical way to tailor your resume without changing the original upload.",
    category: "Resume",
    xpCost: 150,
    contents: [
      "Pull 5 to 8 important keywords from the posting: tools, skills, responsibilities, and domain words.",
      "Map each keyword to an honest resume proof point: project, class, job, or club work.",
      "Rewrite bullets with action verb, tool, task, result, and measurable impact.",
      "Keep the master resume untouched; create a role-specific copy for that application.",
      "Remove filler before adding keywords so the resume stays readable."
    ]
  },
  {
    id: "follow-up-calendar-system",
    title: "Follow-up Calendar System",
    description: "A timing system for application follow-ups, interview thank-yous, and recruiter nudges.",
    category: "Organization",
    xpCost: 100,
    contents: [
      "Application follow-up: 7 to 10 business days after applying.",
      "Recruiter message follow-up: 4 business days after no response.",
      "Interview thank-you: same day, ideally within 6 hours.",
      "Final status check: one week after the promised decision window.",
      "Close the loop politely when you accept another offer."
    ]
  },
  {
    id: "cold-email-outline",
    title: "Networking Tracker Template",
    description: "A simple system for tracking who you contacted, what you asked, and when to follow up.",
    category: "Networking",
    xpCost: 95,
    contents: [
      "Track contact name, company, source, relationship, message date, and follow-up date.",
      "Log the ask: referral, coffee chat, resume review, recruiter screen, or hiring manager intro.",
      "Add one personal detail from the conversation so follow-ups feel human.",
      "Use statuses: queued, sent, replied, call booked, referred, closed.",
      "Review the tracker twice a week to avoid missed follow-ups."
    ]
  },
  {
    id: "offer-negotiation-primer",
    title: "Offer Decision Kit",
    description: "Compare offers clearly and prepare professional questions before making a decision.",
    category: "Offers",
    xpCost: 240,
    contents: [
      "Compare hourly pay, housing, relocation, return offer rate, team quality, and project scope.",
      "Ask about mentor assignment, intern conversion process, performance expectations, and project ownership.",
      "Score each offer by learning value, resume value, network value, compensation, and location fit.",
      "Use a polite negotiation frame: appreciation, competing context, specific ask, flexibility.",
      "Never invent competing offers or deadlines."
    ]
  }
];
