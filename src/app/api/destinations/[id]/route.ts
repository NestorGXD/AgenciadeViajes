import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const destination = await prisma.destination.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        hotels: true,
        _count: {
          select: { bookings: true },
        },
      },
    });

    if (!destination) {
      return NextResponse.json(
        { error: "Destino no encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({ destination });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener el destino." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado." }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.destination.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        country: body.country,
        city: body.city,
        latitude: body.latitude !== undefined ? parseFloat(body.latitude) : undefined,
        longitude: body.longitude !== undefined ? parseFloat(body.longitude) : undefined,
        basePrice: body.basePrice !== undefined ? parseFloat(body.basePrice) : undefined,
        imageUrl: body.imageUrl,
        featured: body.featured !== undefined ? Boolean(body.featured) : undefined,
        rating: body.rating !== undefined ? parseFloat(body.rating) : undefined,
      },
    });

    return NextResponse.json({ destination: updated });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar el destino." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado." }, { status: 403 });
    }

    const { id } = await params;
    await prisma.destination.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Destino eliminado exitosamente." });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar el destino." },
      { status: 500 }
    );
  }
}
