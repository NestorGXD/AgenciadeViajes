import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const destinationId = searchParams.get("destinationId");
    const category = searchParams.get("category");

    const where: any = {};
    if (destinationId) where.destinationId = destinationId;
    if (category) where.category = category;

    const hotels = await prisma.hotel.findMany({
      where,
      include: {
        destination: {
          select: { id: true, name: true, city: true, country: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ hotels });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener hoteles." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado." }, { status: 403 });
    }

    const body = await req.json();
    const {
      destinationId,
      name,
      description,
      address,
      category,
      pricePerNight,
      rating,
      imageUrl,
      amenities,
    } = body;

    if (!destinationId || !name || !address || pricePerNight === undefined) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios para el hotel." },
        { status: 400 }
      );
    }

    const hotel = await prisma.hotel.create({
      data: {
        destinationId,
        name,
        description: description || "",
        address,
        category: category || "ALL_INCLUSIVE",
        pricePerNight: parseFloat(pricePerNight),
        rating: rating ? parseFloat(rating) : 4.7,
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        amenities: amenities || "Wifi,Piscina,Restaurante",
      },
    });

    return NextResponse.json({ hotel }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al registrar el hotel." },
      { status: 500 }
    );
  }
}
