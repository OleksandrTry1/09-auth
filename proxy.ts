import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parseSetCookie } from "cookie";
import { checkSession } from "@/lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

const matchesRoute = (pathname: string, routes: string[]): boolean =>
  routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

// Asks the backend to refresh the session and stores the new tokens through
// the cookies() store, which writes them to the outgoing response.
const refreshSession = async (): Promise<boolean> => {
  try {
    const response = await checkSession();
    const header = response.headers["set-cookie"];
    const setCookies = Array.isArray(header) ? header : header ? [header] : [];
    const cookieStore = await cookies();

    for (const setCookie of setCookies) {
      const parsed = parseSetCookie(setCookie);

      if (parsed.value) {
        cookieStore.set(parsed.name, parsed.value, parsed);
      }
    }

    return response.data.success;
  } catch {
    return false;
  }
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicRoute = matchesRoute(pathname, publicRoutes);
  const isPrivateRoute = matchesRoute(pathname, privateRoutes);

  const hasAccessToken = Boolean(request.cookies.get("accessToken")?.value);
  const hasRefreshToken = Boolean(request.cookies.get("refreshToken")?.value);

  let isAuthenticated = hasAccessToken;

  // No access token, but the refresh token may still restore the session.
  if (!hasAccessToken && hasRefreshToken) {
    isAuthenticated = await refreshSession();
  }

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
