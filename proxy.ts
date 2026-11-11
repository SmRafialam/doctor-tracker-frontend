import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_COOKIE = "dt_token";
const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "");

async function isAuthenticated(token: string | undefined) {
  if (!token || secret.length === 0) return false;
  try {
    await jwtVerify(token, secret, { algorithms: ["HS256"] });
    return true;
  } catch {
    return false; // expired, tampered or signed with another key
  }
}

/**
 * Route guard. Runs before any page renders, so signed-out users never see
 * a flash of protected UI. It checks the JWT's signature and expiry locally
 * (no network hop). The API still verifies the token on every request, so
 * this is a UX layer on top of the real security boundary.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const authed = await isAuthenticated(request.cookies.get(AUTH_COOKIE)?.value);
  const onLogin = pathname === "/login";

  if (!authed && !onLogin) {
    const url = new URL("/login", request.url);
    if (pathname !== "/") url.searchParams.set("next", pathname + search);
    const res = NextResponse.redirect(url);
    res.cookies.delete(AUTH_COOKIE); // drop a stale/invalid cookie
    return res;
  }
  if (authed && onLogin) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  // Everything except the API proxy, Next internals and static files.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)"],
};
