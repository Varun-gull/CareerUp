import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";

export default function ShellLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="lg:hidden">
        <Navbar />
      </div>
      <div className="min-h-screen lg:p-5 xl:p-7">
        <div className="min-h-screen overflow-hidden lg:min-h-[calc(100vh-2.5rem)] lg:rounded-[2.25rem] lg:border lg:border-white/70 lg:bg-white/35 lg:shadow-[0_28px_90px_rgba(15,23,42,0.18)] lg:backdrop-blur-2xl xl:min-h-[calc(100vh-3.5rem)]">
          <div className="lg:grid lg:min-h-[inherit] lg:grid-cols-[252px_minmax(0,1fr)] xl:grid-cols-[272px_minmax(0,1fr)]">
            <AppSidebar />
            <div className="min-w-0">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
