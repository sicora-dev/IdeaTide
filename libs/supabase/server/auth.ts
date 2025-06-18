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

  if (!fetchedUser.email) {
    return { user: null, supabase };
  }
  const mappedUser: User = {
    ...fetchedUser,
    email: fetchedUser.email,
    image: fetchedUser.user_metadata?.avatar_url || null,
    full_name: fetchedUser.user_metadata?.full_name || null,
    phone: fetchedUser.user_metadata?.phone || null,
    created_at: fetchedUser.created_at ? new Date(fetchedUser.created_at) : undefined,
    updated_at: fetchedUser.updated_at ? new Date(fetchedUser.updated_at) : undefined,
    last_sign_in_at: fetchedUser.last_sign_in_at ? new Date(fetchedUser.last_sign_in_at) : null,
  };
  return { user: mappedUser, supabase };
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