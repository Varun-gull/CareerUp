import { Suspense } from "react";
import type { Metadata } from "next";
import { NavigationProgress } from "@/components/NavigationProgress";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareerUp | Gamified Internship Tracker",
  description: "Track internship applications, build streaks, earn XP, and level up your search."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense>
          <NavigationProgress />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
