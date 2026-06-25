"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { extractResumeKeywords, extractResumeTextFromFile, normalizeResumeText } from "@/lib/resume";
import { getSchoolLogoUrl } from "@/lib/schools";
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

function isUploadedFile(value: FormDataEntryValue | null): value is File {
  return Boolean(
    value &&
      typeof value === "object" &&
      "name" in value &&
      "size" in value &&
      "arrayBuffer" in value &&
      "text" in value &&
      typeof value.arrayBuffer === "function" &&
      typeof value.text === "function" &&
      Number(value.size) > 0
  );
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
  const selectedSchool = String(formData.get("school") ?? "").trim();
  const customSchool = String(formData.get("customSchool") ?? "").trim();
  const school = customSchool || selectedSchool;
  const schoolLogoUrl = customSchool ? "" : getSchoolLogoUrl(selectedSchool);
  const major = String(formData.get("major") ?? "").trim();
  const graduationYear = String(formData.get("graduationYear") ?? "").trim();
  const targetRoles = parseList(formData.get("targetRoles"));
  const targetLocations = parseList(formData.get("targetLocations"));
  const shareApplicationBoard = formData.get("shareApplicationBoard") === "on";

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
      school_logo_url: schoolLogoUrl || null,
      major: major || null,
      graduation_year: graduationYear || null,
      target_roles: targetRoles,
      target_locations: targetLocations,
      share_application_board: shareApplicationBoard,
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
  let fileReadFailed = false;

  if (isUploadedFile(resumeFile)) {
    fileName = resumeFile.name;

    if (Number(resumeFile.size) > 8 * 1024 * 1024) {
      redirectWithMessage("/profile", "Resume file is too large. Upload a file under 8 MB or paste the text instead.");
    }

    try {
      resumeText = await extractResumeTextFromFile(resumeFile);
    } catch {
      fileReadFailed = true;
      resumeText = pastedText;
    }
  }

  const normalizedText = normalizeResumeText(resumeText);
  const keywords = extractResumeKeywords(normalizedText);

  if (!normalizedText || keywords.length === 0) {
    redirectWithMessage(
      "/profile",
      fileReadFailed
        ? "CareerUp could not read that file. Paste your resume text in the box and save again."
        : "Add resume text from a text-based resume before saving."
    );
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
  redirectWithMessage("/profile", fileReadFailed ? "Resume text saved from the pasted box because the file could not be read." : "Resume saved.");
}
