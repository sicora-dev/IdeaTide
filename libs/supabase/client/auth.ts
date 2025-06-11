import { createClient } from "libs/supabase/client/client";
import { getCookie } from "../server/cookies";

export const getSupabaseClient = () => {
  return createClient();
};

export const getAuthenticatedUser = async () => {
  const supabase = getSupabaseClient();
  const userCookie = await getCookie("sb-user");
  if (userCookie) return { user: JSON.parse(userCookie), supabase };

  const { data: { user: fetchedUser }, error } = await supabase.auth.getUser();
  if (error || !fetchedUser) {
    return { user: null, supabase };
  }

  return { user: fetchedUser, supabase };
};

export async function getToken(): Promise<string | null> {
  const token = await getCookie("sb-token");
  if (token) return token;

  const supabase = getSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  return session?.access_token || null;
}

export async function resetPasswordForEmailMethod(
  email: string,
  redirectTo: string
): Promise<string | null> {
  const supabase = getSupabaseClient();

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) throw error;

    return "Password reset email sent! Check your inbox.";
  } catch (error: any) {
    console.error("Error resetting password:", error);
    throw error.message || "Failed to send password reset email.";
  }
}

export async function updateEmailMethod(email: string, redirectTo: string) {
  const supabase = getSupabaseClient();
  try {
    const { data, error } = await supabase.auth.updateUser(
      { email: email },
      { emailRedirectTo: redirectTo }
    );
    if (error) throw error;
    console.log(data);
    return "Please check your email";
  } catch (error: any) {
    console.error("Error updating email:", error);
    throw error.message || "Failed to send the update email message.";
  }
}