import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const proxyRequest = async (request: NextRequest) => {
  if (!API_URL) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_API_URL is not configured" },
      { status: 500 },
    );
  }

  const path = request.nextUrl.pathname.replace(/^\/api\/?/, "");
  const targetUrl = new URL(`/${path}${request.nextUrl.search}`, API_URL);
  const headers = new Headers();

  for (const name of ["accept", "content-type", "cookie"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const hasBody = !["GET", "HEAD"].includes(request.method);
  const upstream = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
    cache: "no-store",
  });

  const responseHeaders = new Headers();
  const contentType = upstream.headers.get("content-type");
  if (contentType) responseHeaders.set("content-type", contentType);

  // Re-issue upstream cookies from localhost. This makes them available to
  // the browser on localhost and readable by the Next.js proxy/middleware.
  const setCookies = upstream.headers.getSetCookie();
  const response = new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });

  for (const cookie of setCookies) {
    const localCookie = cookie
      .replace(/;\s*Domain=[^;]*/i, "")
      .replace(/;\s*SameSite=None/i, "; SameSite=Lax");
    response.headers.append("set-cookie", localCookie);
  }

  return response;
};

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PATCH = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
