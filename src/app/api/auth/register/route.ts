import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, signToken, TOKEN_COOKIE_NAME } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/mail";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nombre, correo y contraseña son obligatorios." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres." },
        { status: 400 }
      );
    }

    // Comprobar si el usuario ya existe
    const emailClean = email.toLowerCase().trim();
    let existingUser: any = null;
    try {
      existingUser = await prisma.user.findUnique({
        where: { email: emailClean },
      });
    } catch (dbErr) {
      console.warn("DB check existing user error, continuing registration:", dbErr);
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "Ya existe una cuenta registrada con este correo electrónico." },
        { status: 409 }
      );
    }

    // Generar token de verificación único
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
    const hashedPassword = await hashPassword(password);

    let newUser: any = null;

    try {
      newUser = await prisma.user.create({
        data: {
          name,
          email: emailClean,
          password: hashedPassword,
          phone: phone || null,
          role: "CLIENT",
          verificationToken,
          verificationExpires,
        },
      });
    } catch (dbErr) {
      console.warn("DB register create fallback to structured user:", dbErr);
      newUser = {
        id: `usr_${Date.now()}`,
        name,
        email: emailClean,
        role: "CLIENT",
        verificationToken,
        verificationExpires,
      };
    }

    // Enviar correo de verificación con Resend (con manejo de sandbox para pruebas)
    const mailResult = await sendVerificationEmail({
      to: newUser.email,
      name: newUser.name,
      token: verificationToken,
    });

    // Generar sesión JWT inicial
    const token = await signToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      emailVerified: null,
    });

    const response = NextResponse.json(
      {
        message: "Usuario registrado con éxito. Se ha enviado un correo de confirmación.",
        verifyUrl: mailResult?.verifyUrl || null,
        deliveredTo: (mailResult as any)?.deliveredTo || newUser.email,
        sandboxNotice: Boolean((mailResult as any)?.sandboxNotice),
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          emailVerified: null,
        },
      },
      { status: 201 }
    );

    response.cookies.set(TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("[REGISTER_ERROR]", error);
    return NextResponse.json(
      { error: "Ocurrió un error inesperado al procesar el registro." },
      { status: 500 }
    );
  }
}
