import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const featured = searchParams.get("featured");

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { country: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ];
    }

    if (featured === "true") {
      where.featured = true;
    }

    const destinations = await prisma.destination.findMany({
      where,
      include: {
        hotels: {
          select: {
            id: true,
            name: true,
            category: true,
            pricePerNight: true,
            rating: true,
            imageUrl: true,
          },
        },
        _count: {
          select: {
            hotels: true,
            bookings: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ destinations });
  } catch (error) {
    console.error("[DESTINATIONS_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Error al obtener destinos." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado. Solo administradores pueden crear destinos." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      name,
      slug,
      description,
      country,
      city,
      latitude,
      longitude,
      basePrice,
      imageUrl,
      featured,
      rating,
    } = body;

    if (!name || !country || !city || latitude === undefined || longitude === undefined || basePrice === undefined) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios para el destino." },
        { status: 400 }
      );
    }

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const newDestination = await prisma.destination.create({
      data: {
        name,
        slug: generatedSlug,
        description: description || "",
        country,
        city,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        basePrice: parseFloat(basePrice),
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1510097467424-192d713fd8c2",
        featured: Boolean(featured),
        rating: rating ? parseFloat(rating) : 4.8,
      },
    });

    return NextResponse.json({ destination: newDestination }, { status: 201 });
  } catch (error: any) {
    console.error("[DESTINATIONS_POST_ERROR]", error);
    return NextResponse.json(
      { error: error?.code === "P2002" ? "El slug o nombre de destino ya existe." : "Error al crear el destino." },
      { status: 500 }
    );
  }
}
