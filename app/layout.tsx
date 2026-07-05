import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NavigationProgress } from "@/components/NavigationProgress";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

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
    <html lang="en" className={inter.variable}>
      <body>
        <Suspense>
          <NavigationProgress />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
