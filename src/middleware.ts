import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const TOKEN_COOKIE_NAME = "contigo_token";

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "contigo-tours-default-secret-key-change-in-prod-32chars";
  return new TextEncoder().encode(secret);
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas que requieren autenticación
  const isClientRoute = pathname.startsWith("/client");
  const isAdminRoute = pathname.startsWith("/admin");

  if (!isClientRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const secret = getSecretKey();
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role as string;

    // Si intenta entrar a /admin pero no es ADMIN
    if (isAdminRoute && role !== "ADMIN") {
      const clientUrl = new URL("/client", request.url);
      return NextResponse.redirect(clientUrl);
    }

    return NextResponse.next();
  } catch (error) {
    // Token inválido o expirado
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(TOKEN_COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: [
    "/client/:path*",
    "/admin/:path*",
  ],
};
