import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const pathname = nextUrl.pathname;

  // Protected routes - dashboard and books
  const isProtectedRoute = pathname.startsWith("/books") || pathname === "/";

  // Auth routes (login page)
  const isAuthRoute = pathname === "/login";

  // If user is logged in and tries to access login page, redirect to books
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/books", nextUrl));
  }

  // If user is not logged in and tries to access protected route, redirect to login
  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
};
