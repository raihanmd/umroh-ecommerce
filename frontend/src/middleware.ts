import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { clearSession, getSession, getVerifyToken } from "./lib/jwt";
import { UserRole } from "./types/jwt";

function handleRoleRedirection(role: UserRole, url: URL): NextResponse | null {
  if (role === UserRole.ADMIN && url.pathname.startsWith("/user")) {
    return NextResponse.redirect(new URL("/", url));
  }

  if (role === UserRole.MEMBER && url.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", url));
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;

  try {
    const verifyToken = await getVerifyToken();

    if (
      verifyToken &&
      (currentPath === "/login" || currentPath === "/register")
    ) {
      return NextResponse.redirect(new URL("/verify", request.url));
    }

    if (!verifyToken && currentPath === "/verify") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const claims = await getSession();

    if (
      !claims &&
      (currentPath.startsWith("/admin") || currentPath.startsWith("/user"))
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (claims && (currentPath === "/login" || currentPath === "/register")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (claims) {
      const roleRedirect = handleRoleRedirection(claims.role, request.nextUrl);
      if (roleRedirect) {
        return roleRedirect;
      }
    }
  } catch (error) {
    await clearSession();
  }

  return NextResponse.next();
}
