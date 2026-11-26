import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { comparePassword, signToken, TOKEN_COOKIE_NAME, hashPassword } from "@/lib/auth";

// Cuentas de demostración predeterminadas para garantizar acceso continuo
const DEMO_USERS = [
  {
    id: "usr_admin_default",
    name: "Administrador Contigo Tours",
    email: "admin@contigotours.com",
    role: "ADMIN" as const,
    passwordPlain: "Admin12345!",
    phone: "+52 443 186 6129",
  },
  {
    id: "usr_client_default",
    name: "Cliente Demostración",
    email: "cliente@contigotours.com",
    role: "CLIENT" as const,
    passwordPlain: "Cliente12345!",
    phone: "+52 555 123 4567",
  },
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Correo y contraseña son requeridos." },
        { status: 400 }
      );
    }

    const emailClean = email.toLowerCase().trim();

    // 1. Intentar buscar en la base de datos PostgreSQL
    let user: any = null;
    let isMatch = false;

    try {
      user = await prisma.user.findUnique({
        where: { email: emailClean },
      });

      if (user) {
        isMatch = await comparePassword(password, user.password);
      }
    } catch (dbError) {
      console.warn("DB not ready or connection issue in login, checking fallback users:", dbError);
    }

    // 2. Si no se encontró en DB o la DB no está accesible, verificar usuarios demo predeterminados
    if (!user || !isMatch) {
      const demoFound = DEMO_USERS.find(
        (u) => u.email === emailClean && u.passwordPlain === password
      );

      if (demoFound) {
        user = {
          id: demoFound.id,
          name: demoFound.name,
          email: demoFound.email,
          role: demoFound.role,
          phone: demoFound.phone,
          emailVerified: new Date(),
        };
        isMatch = true;
      }
    }

    if (!user || !isMatch) {
      return NextResponse.json(
        { error: "Credenciales inválidas. Verifica tu correo y contraseña." },
        { status: 401 }
      );
    }

    const token = await signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerified: user.emailVerified ? new Date(user.emailVerified).toISOString() : null,
    });

    const response = NextResponse.json({
      message: "Inicio de sesión exitoso.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });

    response.cookies.set(TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("[LOGIN_ERROR]", error);
    return NextResponse.json(
      { error: "Error al iniciar sesión." },
      { status: 500 }
    );
  }
}
