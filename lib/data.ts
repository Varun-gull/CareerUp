import { applications as mockApplications, leaderboard as mockLeaderboard, profile as mockProfile } from "./mock-data";
import { rewardCatalog } from "./rewards/catalog";
import type { Application, Friend, LeaderboardUser, Profile, PublicProfile, Reward } from "./types";
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

type DbFriend = {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: Friend["status"];
};

type DbUserReward = {
  reward_id: string;
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

export async function getFriends(): Promise<Friend[]> {
  const supabase = getSupabaseServerClient();
  const user = await getCurrentUser();

  if (!supabase || !user) {
    return [];
  }

  const { data: friendships, error } = await supabase
    .from("friends")
    .select("id, requester_id, addressee_id, status")
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
    .returns<DbFriend[]>();

  if (error || !friendships?.length) {
    return [];
  }

  const profileIds = Array.from(new Set(friendships.map((friendship) => (friendship.requester_id === user.id ? friendship.addressee_id : friendship.requester_id))));

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name, email, school, xp, streak_count")
    .in("id", profileIds)
    .returns<Array<Pick<DbProfile, "id" | "full_name" | "email" | "school" | "xp" | "streak_count">>>();

  if (profilesError || !profiles) {
    return [];
  }

  const profilesById = new Map(profiles.map((profile) => [profile.id, profile]));

  return friendships
    .map((friendship) => {
      const friendId = friendship.requester_id === user.id ? friendship.addressee_id : friendship.requester_id;
      const profile = profilesById.get(friendId);

      if (!profile) {
        return null;
      }

      return {
        id: friendship.id,
        userId: friendId,
        name: profile.full_name ?? profile.email ?? "CareerUp Student",
        email: profile.email ?? "",
        school: profile.school ?? "Student",
        xp: profile.xp ?? 0,
        streak: profile.streak_count ?? 0,
        status: friendship.status,
        direction: friendship.requester_id === user.id ? "outgoing" : "incoming"
      } satisfies Friend;
    })
    .filter((friend): friend is Friend => Boolean(friend));
}

export async function getFriendLeaderboard(): Promise<LeaderboardUser[]> {
  const supabase = getSupabaseServerClient();
  const user = await getCurrentUser();

  if (!supabase || !user) {
    return mockLeaderboard;
  }

  const friends = await getFriends();
  const acceptedFriendIds = friends.filter((friend) => friend.status === "accepted").map((friend) => friend.userId);
  const ids = [user.id, ...acceptedFriendIds];

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, school, xp, streak_count")
    .in("id", ids)
    .order("xp", { ascending: false })
    .returns<Array<Pick<DbProfile, "id" | "full_name" | "school" | "xp" | "streak_count">>>();

  if (error || !data) {
    return [];
  }

  return data.map((profile) => ({
    id: profile.id,
    name: profile.full_name ?? "CareerUp Student",
    school: profile.school ?? "Student",
    xp: profile.xp ?? 0,
    streak: profile.streak_count ?? 0
  }));
}

export async function getPublicProfile(profileId: string): Promise<PublicProfile | null> {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, school, major, graduation_year, target_roles, target_locations, xp, streak_count, applications_applied")
    .eq("id", profileId)
    .maybeSingle<Pick<DbProfile, "id" | "full_name" | "school" | "major" | "graduation_year" | "target_roles" | "target_locations" | "xp" | "streak_count" | "applications_applied">>();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    name: data.full_name ?? "CareerUp Student",
    school: data.school ?? "Student",
    major: data.major ?? "",
    graduationYear: data.graduation_year ?? "",
    targetRoles: data.target_roles ?? [],
    targetLocations: data.target_locations ?? [],
    xp: data.xp ?? 0,
    streak: data.streak_count ?? 0,
    applicationsApplied: data.applications_applied ?? 0
  };
}

export async function getFriendshipWith(profileId: string): Promise<Pick<Friend, "status" | "direction"> | null> {
  const supabase = getSupabaseServerClient();
  const user = await getCurrentUser();

  if (!supabase || !user || user.id === profileId) {
    return null;
  }

  const { data, error } = await supabase
    .from("friends")
    .select("requester_id, status")
    .or(`and(requester_id.eq.${user.id},addressee_id.eq.${profileId}),and(requester_id.eq.${profileId},addressee_id.eq.${user.id})`)
    .maybeSingle<Pick<DbFriend, "requester_id" | "status">>();

  if (error || !data) {
    return null;
  }

  return {
    status: data.status,
    direction: data.requester_id === user.id ? "outgoing" : "incoming"
  };
}

export async function getRewards(): Promise<Reward[]> {
  const supabase = getSupabaseServerClient();
  const user = await getCurrentUser();

  if (!supabase || !user) {
    return rewardCatalog.map((reward) => ({ ...reward, unlocked: false }));
  }

  const { data, error } = await supabase.from("user_rewards").select("reward_id").eq("user_id", user.id).returns<DbUserReward[]>();

  if (error || !data) {
    return rewardCatalog.map((reward) => ({ ...reward, unlocked: false }));
  }

  const unlockedIds = new Set(data.map((reward) => reward.reward_id));

  return rewardCatalog.map((reward) => ({
    ...reward,
    unlocked: unlockedIds.has(reward.id)
  }));
}
