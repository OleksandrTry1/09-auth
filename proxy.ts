import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parseSetCookie } from "cookie";
import { checkSession } from "@/lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

interface SessionResult {
  isAuthenticated: boolean;
  setCookies: string[];
}

const matchesRoute = (pathname: string, routes: string[]): boolean =>
  routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

const refreshSession = async (request: NextRequest): Promise<SessionResult> => {
  try {
    const response = await checkSession();
    const header = response.headers["set-cookie"];
    const setCookies = Array.isArray(header) ? header : header ? [header] : [];

    // Let the page rendered during this request see the refreshed tokens.
    for (const setCookie of setCookies) {
      const parsed = parseSetCookie(setCookie);

      if (parsed.value) {
        request.cookies.set(parsed.name, parsed.value);
      }
    }

    return { isAuthenticated: response.status === 200, setCookies };
  } catch {
    return { isAuthenticated: false, setCookies: [] };
  }
};

const withCookies = (response: NextResponse, setCookies: string[]) => {
  for (const setCookie of setCookies) {
    response.headers.append("set-cookie", setCookie);
  }

  return response;
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicRoute = matchesRoute(pathname, publicRoutes);
  const isPrivateRoute = matchesRoute(pathname, privateRoutes);

  const hasAccessToken = Boolean(request.cookies.get("accessToken")?.value);
  const hasRefreshToken = Boolean(request.cookies.get("refreshToken")?.value);

  let session: SessionResult = {
    isAuthenticated: hasAccessToken,
    setCookies: [],
  };

  // No access token, but the refresh token may still restore the session.
  if (!hasAccessToken && hasRefreshToken) {
    session = await refreshSession(request);
  }

  const { isAuthenticated, setCookies } = session;

  if (isPrivateRoute && !isAuthenticated) {
    return withCookies(
      NextResponse.redirect(new URL("/sign-in", request.url)),
      setCookies,
    );
  }

  if (isPublicRoute && isAuthenticated) {
    return withCookies(
      NextResponse.redirect(new URL("/profile", request.url)),
      setCookies,
    );
  }

  return withCookies(NextResponse.next({ request }), setCookies);
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
