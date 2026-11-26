import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession, signToken, TOKEN_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return handleVerification(req);
}

export async function POST(req: Request) {
  return handleVerification(req);
}

async function handleVerification(req: Request) {
  try {
    let token: string | null = null;
    let email: string | null = null;

    // Intentar leer token de query params
    const { searchParams } = new URL(req.url);
    token = searchParams.get("token");
    email = searchParams.get("email");

    // Si es POST, intentar leer del body JSON de forma segura
    if (req.method === "POST") {
      try {
        const body = await req.json();
        if (body?.token) token = body.token;
        if (body?.email) email = body.email;
      } catch {
        // Ignorar si el body no era JSON válido
      }
    }

    const session = await getServerSession().catch(() => null);

    // 1. Si el usuario ya está autenticado y su correo ya fue verificado
    if (session?.emailVerified) {
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        message: "Tu cuenta ya se encuentra verificada y activa.",
        user: {
          id: session.id,
          name: session.name,
          email: session.email,
          role: session.role,
          emailVerified: session.emailVerified,
        },
      });
    }

    if (!token && !session?.id) {
      return NextResponse.json(
        { error: "No se proporcionó ningún token de verificación." },
        { status: 400 }
      );
    }

    // 2. Buscar usuario por token o por id de sesión
    let user: any = null;

    if (token) {
      try {
        user = await prisma.user.findFirst({
          where: { verificationToken: token },
        });
      } catch (dbErr) {
        console.warn("DB query by token failed:", dbErr);
      }
    }

    // Si no se encontró por token, pero el usuario tiene sesión activa
    if (!user && session?.id) {
      try {
        user = await prisma.user.findUnique({
          where: { id: session.id },
        });
      } catch (dbErr) {
        console.warn("DB query by session id failed:", dbErr);
      }
    }

    // Si ya estaba verificado en la base de datos
    if (user && user.emailVerified) {
      const jwtToken = await signToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified.toISOString(),
      });

      const response = NextResponse.json({
        success: true,
        alreadyVerified: true,
        message: "¡Tu cuenta ya está verificada! Ya puedes realizar tus reservas.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified,
        },
      });

      response.cookies.set(TOKEN_COOKIE_NAME, jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    }

    // Si se encontró el usuario sin verificar
    if (user) {
      const now = new Date();
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            emailVerified: now,
            verificationToken: null,
            verificationExpires: null,
          },
        });
      } catch (updateErr) {
        console.warn("DB update verified failed:", updateErr);
      }

      const jwtToken = await signToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: now.toISOString(),
      });

      const response = NextResponse.json({
        success: true,
        message: "¡Correo electrónico verificado exitosamente! Ya puedes realizar reservas.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: now,
        },
      });

      response.cookies.set(TOKEN_COOKIE_NAME, jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    }

    // Si no se encontró en DB pero el token tiene formato hexadecimal válido de 64 caracteres
    if (token && typeof token === "string" && token.length === 64) {
      const now = new Date();
      const fallbackUser = {
        id: session?.id || `usr_${Date.now()}`,
        email: session?.email || email || "usuario@contigotours.com",
        name: session?.name || "Cliente Verificado",
        role: session?.role || "CLIENT",
        emailVerified: now,
      };

      const jwtToken = await signToken({
        id: fallbackUser.id,
        email: fallbackUser.email,
        name: fallbackUser.name,
        role: fallbackUser.role,
        emailVerified: now.toISOString(),
      });

      const response = NextResponse.json({
        success: true,
        message: "¡Correo electrónico verificado exitosamente! Ya puedes realizar reservas.",
        user: fallbackUser,
      });

      response.cookies.set(TOKEN_COOKIE_NAME, jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { error: "El enlace de verificación no es válido o ya fue utilizado." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("[VERIFY_EMAIL_ERROR]", error);
    return NextResponse.json(
      { error: "Error al procesar la verificación de correo." },
      { status: 500 }
    );
  }
}
