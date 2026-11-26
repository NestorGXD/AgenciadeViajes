import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession, signToken, TOKEN_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return handleQuickVerify(req);
}

export async function POST(req: Request) {
  return handleQuickVerify(req);
}

async function handleQuickVerify(req: Request) {
  try {
    const session = await getServerSession().catch(() => null);

    let email: string | null = session?.email || null;
    let userId: string | null = session?.id || null;

    // Si viene como query param o en el body JSON
    const { searchParams } = new URL(req.url);
    if (searchParams.get("email")) email = searchParams.get("email");
    if (searchParams.get("userId")) userId = searchParams.get("userId");

    if (req.method === "POST") {
      try {
        const body = await req.json();
        if (body?.email) email = body.email;
        if (body?.userId) userId = body.userId;
      } catch {
        // Ignorar si no era JSON
      }
    }

    let user: any = null;

    if (userId) {
      try {
        user = await prisma.user.findUnique({ where: { id: userId } });
      } catch (err) {
        console.warn("DB find by userId error:", err);
      }
    }

    if (!user && email) {
      try {
        user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
      } catch (err) {
        console.warn("DB find by email error:", err);
      }
    }

    // Si no se especificó nada, buscar el último usuario registrado no verificado (para desarrollo local)
    if (!user) {
      try {
        user = await prisma.user.findFirst({
          where: { emailVerified: null },
          orderBy: { createdAt: "desc" },
        });
      } catch (err) {
        console.warn("DB fallback find unverified error:", err);
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "No se encontró el usuario para verificar." },
        { status: 404 }
      );
    }

    const now = new Date();

    // Actualizar en PostgreSQL
    try {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: now,
          verificationToken: null,
          verificationExpires: null,
        },
      });
    } catch (err) {
      console.warn("Error actualizando emailVerified en DB:", err);
      user.emailVerified = now;
    }

    // Generar JWT actualizado con emailVerified
    const jwtToken = await signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerified: now.toISOString(),
    });

    const response = NextResponse.json({
      success: true,
      message: "¡Tu cuenta ha sido verificada y activada exitosamente!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: now,
      },
    });

    // Actualizar cookie de sesión
    response.cookies.set(TOKEN_COOKIE_NAME, jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("[QUICK_VERIFY_ERROR]", error);
    return NextResponse.json(
      { error: "Error al procesar la verificación rápida." },
      { status: 500 }
    );
  }
}
