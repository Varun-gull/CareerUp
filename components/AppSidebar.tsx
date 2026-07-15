import { SidebarNavLinks } from "@/components/SidebarNavLinks";
import { getCurrentUser, getUnreadPeerMessageCount } from "@/lib/data";

export async function AppSidebar() {
  const user = await getCurrentUser();
  const unreadMessages = user ? await getUnreadPeerMessageCount() : 0;

  return (
    <aside className="hidden lg:sticky lg:top-[5.25rem] lg:flex lg:h-[calc(100vh-5.25rem)] lg:flex-col lg:items-center lg:overflow-visible lg:px-3 lg:py-5">
      <SidebarNavLinks unreadMessages={unreadMessages} />
    </aside>
  );
}
