import { NextResponse, type NextRequest } from "next/server";

const secureHeaders: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-Railora-Rate-Limit": "placeholder",
};

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  for (const [header, value] of Object.entries(secureHeaders)) {
    response.headers.set(header, value);
  }

  if (request.nextUrl.pathname.startsWith("/api")) {
    response.headers.set("Cache-Control", "no-store");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
