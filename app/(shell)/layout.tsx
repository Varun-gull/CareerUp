import { AppDock } from "@/components/AppDock";
import { ShellMotion } from "@/components/ShellMotion";
import { TopBar } from "@/components/TopBar";

export default function ShellLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen">
      <TopBar />
      <ShellMotion>{children}</ShellMotion>
      <AppDock />
    </div>
  );
}
