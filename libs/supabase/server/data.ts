import { getAuthenticatedUser, getSupabaseClient } from "libs/supabase/server/auth";

export async function getProfileData() {
  const { user, supabase } = await getAuthenticatedUser();

  const { data, error } = await (await supabase)
    .from("users")
    .select("*")
    .eq("id", user?.id)
    .maybeSingle();

  if (error) {
    throw new Error(`Error fetching profile data: ${error.message}`);
  }
  return data;
}