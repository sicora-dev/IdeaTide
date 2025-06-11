import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const existingUserCookie = request.cookies.get("sb-user");
  const existingTokenCookie = request.cookies.get("sb-token");

  if (!existingUserCookie) {
    const { data: { user: fetchedUser }, error } = await supabase.auth.getUser();

    if (fetchedUser) {
      const userData = {
        id: fetchedUser.id,
        email: fetchedUser.email,
        full_name: fetchedUser.user_metadata?.full_name || null,
      };

      supabaseResponse.cookies.set("sb-user", JSON.stringify(userData), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60,
      });
    }
  }

  if (!existingTokenCookie) {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      const token = session.access_token;
      const decodedToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      const expiresIn = decodedToken.exp - Math.floor(Date.now() / 1000);

      supabaseResponse.cookies.set("sb-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: expiresIn,
      });
    }
  } else {
    try {
      const token = existingTokenCookie.value;
      const decodedToken = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
      const expiresIn = decodedToken.exp - Math.floor(Date.now() / 1000);

      if (expiresIn < 300) {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          const newToken = session.access_token;
          const newDecodedToken = JSON.parse(Buffer.from(newToken.split(".")[1], "base64").toString());
          const newExpiresIn = newDecodedToken.exp - Math.floor(Date.now() / 1000);

          supabaseResponse.cookies.set("sb-token", newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: newExpiresIn,
          });
        }
      }
    } catch (error) {
      console.error("Error al verificar o refrescar el token:", error);
    }
  }
  return supabaseResponse;
}