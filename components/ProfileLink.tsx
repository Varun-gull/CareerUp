import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";

export function ProfileLink({
  profileId,
  name,
  className,
  children
}: {
  profileId: string;
  name: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <Link href={`/u/${profileId}`} className={clsx("font-black text-ink transition hover:text-purple-800", className)} aria-label={`Open ${name}'s profile`}>
      {children ?? name}
    </Link>
  );
}
