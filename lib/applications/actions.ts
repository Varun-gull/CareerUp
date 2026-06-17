"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ApplicationStatus } from "@/lib/types";

function redirectWithMessage(path: string, message: string): never {
  redirect(`${path}?message=${encodeURIComponent(message)}`);
}

const validStatuses: ApplicationStatus[] = ["saved", "applied", "interviewing", "offer", "rejected"];

function getNextStreak(lastAppliedOn: string | null, currentStreak: number) {
  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);

  if (lastAppliedOn === todayKey) {
    return currentStreak;
  }

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);

  return lastAppliedOn === yesterdayKey ? currentStreak + 1 : 1;
}

export async function createApplication(formData: FormData) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    redirectWithMessage("/applications/new", "Connect Supabase before saving real applications.");
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirectWithMessage("/login", "Log in before saving an application.");
  }

  const company = String(formData.get("company") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const sourceUrl = String(formData.get("sourceUrl") ?? "").trim();
  const deadline = String(formData.get("deadline") ?? "").trim() || null;

  if (!company || !role) {
    redirectWithMessage("/applications/new", "Company and role are required.");
  }

  const { error } = await supabase.from("applications").insert({
    user_id: user.id,
    company,
    role,
    location: location || null,
    source_url: sourceUrl || null,
    deadline,
    status: "saved",
    xp_awarded: 5
  });

  if (error) {
    redirectWithMessage("/applications/new", error.message);
  }

  await supabase.rpc("award_xp", { amount: 5 });
  redirect("/applications");
}

export async function savePostingApplication(formData: FormData) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    redirectWithMessage("/postings", "Connect Supabase before saving postings.");
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirectWithMessage("/login", "Log in before saving a posting.");
  }

  const company = String(formData.get("company") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const sourceUrl = String(formData.get("sourceUrl") ?? "").trim();
  const fitScore = Number(formData.get("fitScore") ?? 75);

  if (!company || !role || !sourceUrl) {
    redirectWithMessage("/postings", "This posting is missing required details.");
  }

  const { data: existing } = await supabase
    .from("applications")
    .select("id")
    .eq("user_id", user.id)
    .eq("source_url", sourceUrl)
    .maybeSingle<{ id: string }>();

  if (existing) {
    redirectWithMessage("/applications", "That posting is already in your tracker.");
  }

  const { error } = await supabase.from("applications").insert({
    user_id: user.id,
    company,
    role,
    location: location || null,
    source_url: sourceUrl,
    fit_score: Number.isFinite(fitScore) ? Math.min(100, Math.max(0, fitScore)) : 75,
    status: "saved",
    xp_awarded: 5
  });

  if (error) {
    redirectWithMessage("/postings", error.message);
  }

  await supabase.rpc("award_xp", { amount: 5 });
  redirectWithMessage("/applications", "Posting saved to your tracker. You earned 5 XP.");
}

export async function updateApplicationStatus(formData: FormData) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    redirectWithMessage("/applications", "Connect Supabase before updating applications.");
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirectWithMessage("/login", "Log in before updating an application.");
  }

  const applicationId = String(formData.get("applicationId") ?? "");
  const nextStatus = String(formData.get("status") ?? "") as ApplicationStatus;

  if (!applicationId || !validStatuses.includes(nextStatus)) {
    redirectWithMessage("/applications", "Choose a valid application status.");
  }

  const { data: application, error: loadError } = await supabase
    .from("applications")
    .select("id, status, xp_awarded")
    .eq("id", applicationId)
    .eq("user_id", user.id)
    .single<{ id: string; status: ApplicationStatus; xp_awarded: number | null }>();

  if (loadError || !application) {
    redirectWithMessage("/applications", "Application not found.");
  }

  const applyingForFirstTime = application.status !== "applied" && nextStatus === "applied";
  const xpBonus = applyingForFirstTime ? 20 : 0;

  const { error: updateError } = await supabase
    .from("applications")
    .update({
      status: nextStatus,
      xp_awarded: (application.xp_awarded ?? 0) + xpBonus
    })
    .eq("id", applicationId)
    .eq("user_id", user.id);

  if (updateError) {
    redirectWithMessage("/applications", updateError.message);
  }

  if (applyingForFirstTime) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("xp, streak_count, applications_applied, last_applied_on")
      .eq("id", user.id)
      .single<{ xp: number | null; streak_count: number | null; applications_applied: number | null; last_applied_on: string | null }>();

    const todayKey = new Date().toISOString().slice(0, 10);
    const streakCount = getNextStreak(profile?.last_applied_on ?? null, profile?.streak_count ?? 0);

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        xp: (profile?.xp ?? 0) + xpBonus,
        streak_count: streakCount,
        applications_applied: (profile?.applications_applied ?? 0) + 1,
        last_applied_on: todayKey
      })
      .eq("id", user.id);

    if (profileError) {
      redirectWithMessage("/applications", profileError.message);
    }
  }

  revalidatePath("/applications");
  revalidatePath("/dashboard");
  revalidatePath("/leaderboard");
  revalidatePath("/profile");
}

export async function deleteApplication(formData: FormData) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    redirectWithMessage("/applications", "Connect Supabase before deleting applications.");
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirectWithMessage("/login", "Log in before deleting an application.");
  }

  const applicationId = String(formData.get("applicationId") ?? "");

  if (!applicationId) {
    redirectWithMessage("/applications", "Application not found.");
  }

  const { error } = await supabase.from("applications").delete().eq("id", applicationId).eq("user_id", user.id);

  if (error) {
    redirectWithMessage("/applications", error.message);
  }

  revalidatePath("/applications");
  revalidatePath("/dashboard");
}
