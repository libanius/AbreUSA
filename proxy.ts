import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseMiddlewareClient } from "@/lib/supabase-middleware";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });
  const supabase = createSupabaseMiddlewareClient(request, response);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const isAdmin = Boolean(user && ADMIN_EMAIL && user.email === ADMIN_EMAIL);

  // Admin routes
  const isAdminLoginPage = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute && !isAdminLoginPage && !user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isAdminRoute && !isAdminLoginPage && user && !isAdmin) {
    // Authenticated customer trying to access admin — redirect to their dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAdminLoginPage && user && isAdmin) {
    return NextResponse.redirect(new URL("/admin/orders", request.url));
  }

  if (isAdminLoginPage && user && !isAdmin) {
    // Authenticated customer visiting admin login — redirect to customer dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Customer auth routes — redirect to dashboard if already logged in as customer
  const isDashboardLoginPage = pathname === "/dashboard/login";
  const isDashboardRegisterPage = pathname === "/dashboard/register";

  if ((isDashboardLoginPage || isDashboardRegisterPage) && user && !isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/login", "/dashboard/register"],
};
