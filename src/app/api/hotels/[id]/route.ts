import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: { destination: true },
    });

    if (!hotel) {
      return NextResponse.json({ error: "Hotel no encontrado." }, { status: 404 });
    }

    return NextResponse.json({ hotel });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener hotel." }, { status: 500 });
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

    const updated = await prisma.hotel.update({
      where: { id },
      data: {
        destinationId: body.destinationId,
        name: body.name,
        description: body.description,
        address: body.address,
        category: body.category,
        pricePerNight: body.pricePerNight !== undefined ? parseFloat(body.pricePerNight) : undefined,
        rating: body.rating !== undefined ? parseFloat(body.rating) : undefined,
        imageUrl: body.imageUrl,
        amenities: body.amenities,
      },
    });

    return NextResponse.json({ hotel: updated });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar hotel." }, { status: 500 });
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
    await prisma.hotel.delete({ where: { id } });

    return NextResponse.json({ message: "Hotel eliminado correctamente." });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar hotel." }, { status: 500 });
  }
}
