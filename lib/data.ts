import { applications as mockApplications, leaderboard as mockLeaderboard, profile as mockProfile } from "./mock-data";
import type { Application, LeaderboardUser, Profile } from "./types";
import { getSupabaseServerClient } from "./supabase/server";

type DbApplication = {
  id: string;
  company: string;
  role: string;
  location: string | null;
  source_url: string | null;
  status: Application["status"];
  fit_score: number | null;
  xp_awarded: number | null;
  deadline: string | null;
  updated_at: string;
};

type DbProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
  school: string | null;
  major: string | null;
  graduation_year: string | null;
  target_roles: string[] | null;
  target_locations: string[] | null;
  xp: number | null;
  streak_count: number | null;
  applications_applied: number | null;
};

export async function getCurrentUser() {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentProfile(): Promise<Profile> {
  const supabase = getSupabaseServerClient();
  const user = await getCurrentUser();

  if (!supabase || !user) {
    return mockProfile;
  }

  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single<DbProfile>();

  if (!data) {
    return mockProfile;
  }

  return {
    name: data.full_name ?? user.email ?? "Student",
    school: data.school ?? "CareerUp Student",
    major: data.major ?? "",
    graduationYear: data.graduation_year ?? "",
    targetRoles: data.target_roles ?? [],
    targetLocations: data.target_locations ?? [],
    xp: data.xp ?? 0,
    streak: data.streak_count ?? 0,
    applicationsApplied: data.applications_applied ?? 0
  };
}

export async function getApplications(): Promise<Application[]> {
  const supabase = getSupabaseServerClient();
  const user = await getCurrentUser();

  if (!supabase || !user) {
    return mockApplications;
  }

  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .returns<DbApplication[]>();

  if (error || !data) {
    return [];
  }

  return data.map((application) => ({
    id: application.id,
    company: application.company,
    role: application.role,
    location: application.location ?? "Remote",
    source: application.source_url ?? "Saved manually",
    status: application.status,
    fitScore: application.fit_score ?? 75,
    xp: application.xp_awarded ?? 0,
    deadline: application.deadline ?? "No deadline",
    updatedAt: new Date(application.updated_at).toLocaleDateString()
  }));
}

export async function getLeaderboard(): Promise<LeaderboardUser[]> {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return mockLeaderboard;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, school, xp, streak_count")
    .order("xp", { ascending: false })
    .limit(25)
    .returns<Array<Pick<DbProfile, "id" | "full_name" | "school" | "xp" | "streak_count">>>();

  if (error || !data) {
    return mockLeaderboard;
  }

  return data.map((user) => ({
    id: user.id,
    name: user.full_name ?? "CareerUp Student",
    school: user.school ?? "Student",
    xp: user.xp ?? 0,
    streak: user.streak_count ?? 0
  }));
}
