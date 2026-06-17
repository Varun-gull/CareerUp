import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
