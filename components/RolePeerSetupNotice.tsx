import Link from "next/link";
import type { RolePeerFeatureStatus } from "@/lib/types";

export function RolePeerSetupNotice({ status }: { status: RolePeerFeatureStatus }) {
  if (status.ready) {
    return null;
  }

  return (
    <div className="mt-5 rounded-lg border border-purple-200 bg-purple-50 p-4 text-sm font-bold text-purple-950">
      <p className="font-black">Peer insights need one Supabase migration before live data appears.</p>
      <p className="mt-1">
        Missing: {status.missing.join(", ")}. Run <span className="font-black">supabase/role-peer-insights.sql</span> in the Supabase SQL Editor, then refresh this page.
      </p>
      <Link href="/messages" className="mt-3 inline-flex text-purple-800 underline underline-offset-4">
        Messages will activate from the same setup.
      </Link>
    </div>
  );
}
