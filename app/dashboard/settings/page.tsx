import { notFound } from "next/navigation";
import { getAuthenticatedUser } from "@/libs/supabase/client/auth";
import SettingsClient from "@/components/dashboard/settings/SettingsClient";
import { fetchUserData } from "@/lib/actions/user";

export default async function SettingsPage() {
  const { user : {id} } = await getAuthenticatedUser();
  const user = await fetchUserData(id);
  
  if (!user) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6 h-full">
      <div className="max-w-4xl mx-auto max-h-full pb-6 px-4 overflow-y-auto scrollbar-hide">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your account settings and preferences
          </p>
        </div>
        
        <SettingsClient user={user.data} />
      </div>
    </div>
  );
}