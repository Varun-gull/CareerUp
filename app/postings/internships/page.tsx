import { PostingsPageView } from "@/components/PostingsPageView";

export default function InternshipPostingsPage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    location?: string;
    remote?: "all" | "remote" | "hybrid" | "onsite";
    minFit?: string;
    sort?: "fit" | "newest" | "company";
    message?: string;
  };
}) {
  return <PostingsPageView kind="internship" searchParams={searchParams} />;
}
