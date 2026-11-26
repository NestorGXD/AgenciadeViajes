import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Intentar obtener los datos más recientes de la base de datos
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: session.id },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          emailVerified: true,
          createdAt: true,
        },
      });

      if (dbUser) {
        return NextResponse.json({ user: dbUser }, { status: 200 });
      }
    } catch {
      // Si la DB falla, responder con la sesión en JWT
    }

    return NextResponse.json(
      {
        user: {
          id: session.id,
          name: session.name,
          email: session.email,
          role: session.role,
          emailVerified: session.emailVerified,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
