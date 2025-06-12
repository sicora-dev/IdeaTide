import { createClient } from "libs/supabase/server/server";
import { deleteCookie, getCookie } from "./cookies";
import { User } from "@/lib/types/users";

export const getSupabaseClient = () => {
  return createClient();
};

export const getAuthenticatedUser = async () => {
  const supabase = await getSupabaseClient();
  const userCookie = await getCookie("sb-user");
  if (userCookie) return { user: JSON.parse(userCookie), supabase };

  const { data: { user: fetchedUser }, error } = await supabase.auth.getUser();
  if (error || !fetchedUser) {
    return { user: null, supabase };
  }

  return { user: fetchedUser as User, supabase };
};

export async function getToken(): Promise<string | null> {
  const token = await getCookie("sb-token");
  if (token) return token;

  const supabase = await getSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  return session?.access_token || null;
}

export const signOutUser = async () => {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error during sign out:", error);
      throw error;
    }
    await deleteCookie("sb-user");
    await deleteCookie("sb-token");
    return { success: true };
  } catch (error) {
    console.error("Unexpected error during sign out:", error);
    return { success: false, error };
  }
};