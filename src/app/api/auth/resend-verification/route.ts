import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { sendVerificationEmail, getAppUrl } from "@/lib/mail";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    let email = session?.email;

    if (!email) {
      const body = await req.json().catch(() => ({}));
      email = body.email;
    }

    if (!email) {
      return NextResponse.json(
        { error: "Correo electrónico no proporcionado." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No se encontró ningún usuario con ese correo." },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Este correo ya está verificado y activo." },
        { status: 200 }
      );
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationExpires,
      },
    });

    const mailResult = await sendVerificationEmail({
      to: user.email,
      name: user.name,
      token: verificationToken,
    });

    const appUrl = getAppUrl();
    const deliveredTo = (mailResult as any)?.deliveredTo || user.email;

    return NextResponse.json({
      message:
        deliveredTo.toLowerCase() !== user.email.toLowerCase()
          ? `Correo enviado a ${deliveredTo} (Restricción de pruebas Resend Sandbox). Revisa tu bandeja de entrada.`
          : `Correo de verificación enviado a ${deliveredTo}. Revisa tu bandeja de entrada.`,
      verifyUrl: mailResult?.verifyUrl || `${appUrl}/auth/verify?token=${verificationToken}`,
      deliveredTo,
    });
  } catch (error) {
    console.error("[RESEND_VERIFICATION_ERROR]", error);
    return NextResponse.json(
      { error: "Error al reenviar el correo de verificación." },
      { status: 500 }
    );
  }
}
