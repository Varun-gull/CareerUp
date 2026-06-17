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

export type Profile = {
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
