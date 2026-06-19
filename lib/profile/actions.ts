"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { extractResumeKeywords, extractResumeTextFromFile, normalizeResumeText } from "@/lib/resume";
import { getSupabaseServerClient } from "@/lib/supabase/server";

function redirectWithMessage(path: string, message: string): never {
  redirect(`${path}?message=${encodeURIComponent(message)}`);
}

function parseList(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);
}

export async function updateProfile(formData: FormData) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    redirectWithMessage("/profile", "Connect Supabase before updating your profile.");
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirectWithMessage("/login", "Log in before updating your profile.");
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const school = String(formData.get("school") ?? "").trim();
  const major = String(formData.get("major") ?? "").trim();
  const graduationYear = String(formData.get("graduationYear") ?? "").trim();
  const targetRoles = parseList(formData.get("targetRoles"));
  const targetLocations = parseList(formData.get("targetLocations"));

  if (!fullName) {
    redirectWithMessage("/profile", "Your name is required.");
  }

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("xp, profile_completed_awarded")
    .eq("id", user.id)
    .single<{ xp: number | null; profile_completed_awarded: boolean | null }>();

  const isComplete = Boolean(school && major && graduationYear && targetRoles.length > 0 && targetLocations.length > 0);
  const shouldAwardProfileXp = isComplete && !currentProfile?.profile_completed_awarded;

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      school: school || null,
      major: major || null,
      graduation_year: graduationYear || null,
      target_roles: targetRoles,
      target_locations: targetLocations,
      profile_completed_awarded: shouldAwardProfileXp ? true : currentProfile?.profile_completed_awarded ?? false,
      xp: shouldAwardProfileXp ? (currentProfile?.xp ?? 0) + 30 : currentProfile?.xp ?? 0
    })
    .eq("id", user.id);

  if (error) {
    redirectWithMessage("/profile", error.message);
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  revalidatePath("/leaderboard");
  redirectWithMessage("/profile", shouldAwardProfileXp ? "Profile saved. You earned 30 XP for completing it." : "Profile saved.");
}

export async function saveResumeProfile(formData: FormData) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    redirectWithMessage("/profile", "Connect Supabase before saving your resume.");
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirectWithMessage("/login", "Log in before saving your resume.");
  }

  const resumeFile = formData.get("resumeFile");
  const pastedText = String(formData.get("resumeText") ?? "");
  let resumeText = pastedText;
  let fileName = "";

  if (resumeFile instanceof File && resumeFile.size > 0) {
    fileName = resumeFile.name;
    resumeText = await extractResumeTextFromFile(resumeFile);
  }

  const normalizedText = normalizeResumeText(resumeText);
  const keywords = extractResumeKeywords(normalizedText);

  if (!normalizedText || keywords.length === 0) {
    redirectWithMessage("/profile", "Add resume text from a text-based resume before saving.");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      resume_text: normalizedText,
      resume_keywords: keywords,
      resume_file_name: fileName || "Pasted resume",
      resume_updated_at: new Date().toISOString()
    })
    .eq("id", user.id);

  if (error) {
    redirectWithMessage("/profile", error.message);
  }

  revalidatePath("/profile");
  revalidatePath("/postings");
  redirectWithMessage("/profile", `Resume saved. CareerUp found ${keywords.length} keywords for matching.`);
}
