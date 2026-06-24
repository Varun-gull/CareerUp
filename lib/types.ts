export type ApplicationStatus = "saved" | "applied" | "interviewing" | "offer" | "rejected";

export type Application = {
  id: string;
  company: string;
  role: string;
  location: string;
  source: string;
  status: ApplicationStatus;
  fitScore: number;
  xp: number;
  deadline: string;
  updatedAt: string;
};

export type InternshipPosting = {
  id: string;
  company: string;
  title: string;
  location: string;
  source: string;
  url: string;
  remote: boolean;
  workMode: "remote" | "hybrid" | "onsite";
  postedAt: string;
  tags: string[];
  description: string;
  fitScore: number;
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  xp: number;
  progress: number;
  target: number;
  completed: boolean;
};

export type Reward = {
  id: string;
  title: string;
  description: string;
  category: string;
  xpCost: number;
  contents: string[];
  unlocked: boolean;
};

export type InterviewAnswer = {
  id: string;
  prompt: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  notes: string;
  createdAt: string;
};

export type LeaderboardUser = {
  id: string;
  name: string;
  school: string;
  xp: number;
  streak: number;
};

export type Friend = {
  id: string;
  userId: string;
  name: string;
  email: string;
  school: string;
  xp: number;
  streak: number;
  status: "pending" | "accepted" | "blocked";
  direction: "incoming" | "outgoing";
};

export type PublicProfile = {
  id: string;
  name: string;
  school: string;
  major: string;
  graduationYear: string;
  targetRoles: string[];
  targetLocations: string[];
  xp: number;
  streak: number;
  applicationsApplied: number;
};

export type CalendarEvent = {
  id: string;
  applicationId: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  eventType: "deadline" | "submitted" | "custom" | "interview" | "offer";
  date: string; // YYYY-MM-DD
  time?: string;
  notes?: string;
};

export type Profile = {
  name: string;
  school: string;
  major: string;
  graduationYear: string;
  targetRoles: string[];
  targetLocations: string[];
  resumeKeywords: string[];
  resumeFileName: string;
  resumeUpdatedAt: string;
  xp: number;
  streak: number;
  streakBroken: boolean;
  streakFreeReviveUsed: boolean;
  streakPaidRevives: number;
  streakReviveRequiredApplications: number;
  applicationsApplied: number;
};
