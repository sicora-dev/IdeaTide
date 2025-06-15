import { DesktopNav } from "@/components/navigation/DesktopNav";
import { MobileNav } from "@/components/navigation/MobileNav";
import { Analytics } from "@vercel/analytics/next";
import { User } from "@/components/users/User";
import Providers from "../providers";
import DashboardBreadcrumb from "@/components/ui/dashboard/shared/DashboardBreadcrumb";
import { SearchInput } from "@/components/navigation/SearchInput";
import { getAuthenticatedUser } from "libs/supabase/server/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getAuthenticatedUser();

  if (!user) {
    redirect("/signin");
  }
  return (
    <Providers>
      <div className="flex flex-col h-screen w-full bg-muted/40">
        <DesktopNav />
        <div className="flex-1 flex flex-col h-0 sm:gap-4 sm:py-4 sm:pl-14 overflow-hidden">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 max-md:p-3">
            <MobileNav />
            <DashboardBreadcrumb />
            <SearchInput />
            <User />
          </header>
          <main className="flex-1 h-0 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40 overflow-hidden">
            {children}
          </main>
        </div>
        <Analytics />
      </div>
    </Providers>
  );
}