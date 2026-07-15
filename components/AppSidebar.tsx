import { SidebarNavLinks } from "@/components/SidebarNavLinks";

export async function AppSidebar() {
  return (
    <aside className="hidden lg:sticky lg:top-[5.25rem] lg:flex lg:h-[calc(100vh-5.25rem)] lg:flex-col lg:items-center lg:overflow-visible lg:px-3 lg:py-5">
      <SidebarNavLinks />
    </aside>
  );
}
