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
      <div className="flex flex-col h-full overflow-y-hidden w-full bg-muted/40">
        <DesktopNav />
        <div className="h-full flex flex-col sm:gap-4 sm:py-4 sm:pl-14 ">
          <header className="flex justify-between items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 max-md:p-3">
            <MobileNav />
            <DashboardBreadcrumb />
            <User />
          </header>
          <main className="h-full items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40 max-md:overflow-y-auto">
            {children}
          </main>
        </div>
        <Analytics />
      </div>
    </Providers>
  );
}