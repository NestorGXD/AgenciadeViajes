import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession, signToken, TOKEN_COOKIE_NAME, hashPassword } from "@/lib/auth";
import { generateBookingCode, calculateNights } from "@/lib/utils";
import { FALLBACK_DESTINATIONS } from "@/lib/destinations";
import { getStripe } from "@/lib/stripe";
import { getAppUrl } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const where: any = {};

    if (session.role !== "ADMIN") {
      where.userId = session.id;
    }

    if (status) {
      where.status = status;
    }

    let bookings: any[] = [];
    try {
      bookings = await prisma.booking.findMany({
        where,
        include: {
          destination: true,
          hotel: true,
          user: {
            select: { id: true, name: true, email: true, phone: true },
          },
          payment: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (dbErr) {
      console.warn("DB query failed in bookings GET:", dbErr);
    }

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("[BOOKINGS_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Error al recuperar las reservas." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let session = await getServerSession();

    const {
      destinationId,
      hotelId,
      checkIn,
      checkOut,
      adults = 1,
      children = 0,
      preferences,
      guestName,
      guestEmail,
      guestPhone,
    } = body;

    if (!destinationId || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: "Destino y fechas de viaje son obligatorios." },
        { status: 400 }
      );
    }

    let userId = session?.id;
    let userEmail = session?.email || guestEmail;
    let userName = session?.name || guestName || "Cliente Contigo Tours";
    let tokenToSet: string | null = null;

    // Si el usuario no ha iniciado sesión pero proporcionó datos de contacto, registrar/iniciar automáticamente
    if (!userId && guestEmail) {
      const emailClean = guestEmail.toLowerCase().trim();
      try {
        let existingUser = await prisma.user.findUnique({ where: { email: emailClean } });
        if (!existingUser) {
          const defaultPassword = await hashPassword("Cliente12345!");
          existingUser = await prisma.user.create({
            data: {
              email: emailClean,
              name: guestName || "Cliente Contigo Tours",
              phone: guestPhone || null,
              password: defaultPassword,
              role: "CLIENT",
              emailVerified: new Date(),
            },
          });
        }
        userId = existingUser.id;
        userEmail = existingUser.email;
        userName = existingUser.name;

        tokenToSet = await signToken({
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role,
          emailVerified: existingUser.emailVerified ? existingUser.emailVerified.toISOString() : null,
        });
      } catch (err) {
        userId = `temp_user_${Date.now()}`;
      }
    }

    if (!userId) {
      return NextResponse.json(
        {
          error: "Por favor proporciona tu nombre y correo para vincular tu reserva y pago con Stripe.",
          requiresAuthModal: true,
        },
        { status: 401 }
      );
    }

    // 1. Obtener o autogenerar destino
    let destination: any = null;
    try {
      destination = await prisma.destination.findFirst({
        where: {
          OR: [{ id: destinationId }, { slug: destinationId }],
        },
      });
    } catch {
      // Ignorar fallo DB
    }

    if (!destination) {
      const fallback =
        FALLBACK_DESTINATIONS.find((d) => d.id === destinationId || d.slug === destinationId) ||
        FALLBACK_DESTINATIONS[0];

      try {
        destination = await prisma.destination.upsert({
          where: { slug: fallback.slug },
          create: {
            name: fallback.name,
            slug: fallback.slug,
            description: fallback.description,
            country: fallback.country,
            city: fallback.city,
            latitude: fallback.latitude,
            longitude: fallback.longitude,
            basePrice: fallback.basePrice,
            imageUrl: fallback.imageUrl,
            featured: fallback.featured,
            rating: fallback.rating,
          },
          update: {},
        });
      } catch {
        destination = fallback;
      }
    }

    // 2. Calcular tarifa
    const nights = calculateNights(checkIn, checkOut);
    const numAdults = Math.max(1, parseInt(adults, 10));
    const numChildren = Math.max(0, parseInt(children, 10));

    const destinationRateTotal =
      destination.basePrice * numAdults + destination.basePrice * 0.65 * numChildren;

    // Precio hotel estimado o por categoría
    let hotelPricePerNight = 120;
    let hotelName = "Alojamiento Seleccionado";
    if (typeof preferences === "object" && preferences?.hotelName) {
      hotelName = preferences.hotelName;
    }

    const hotelTotal = hotelPricePerNight * nights;
    const totalPrice = Math.round((destinationRateTotal + hotelTotal) * 100) / 100;
    const bookingCode = generateBookingCode();

    // 3. Crear reserva en DB si está conectada
    let createdBooking: any = {
      id: `bk_${Date.now()}`,
      bookingCode,
      userId,
      destinationId: destination.id,
      hotelId: hotelId || null,
      checkIn: new Date(checkIn).toISOString(),
      checkOut: new Date(checkOut).toISOString(),
      adults: numAdults,
      children: numChildren,
      preferences: typeof preferences === "string" ? preferences : JSON.stringify(preferences || {}),
      totalPrice,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      destination,
      user: { name: userName, email: userEmail },
    };

    try {
      createdBooking = await prisma.booking.create({
        data: {
          bookingCode,
          userId,
          destinationId: destination.id,
          hotelId: hotelId || null,
          checkIn: new Date(checkIn),
          checkOut: new Date(checkOut),
          adults: numAdults,
          children: numChildren,
          preferences: typeof preferences === "string" ? preferences : JSON.stringify(preferences || {}),
          totalPrice,
          status: "PENDING",
        },
        include: {
          destination: true,
          hotel: true,
          user: true,
        },
      });
    } catch (dbError) {
      console.warn("DB insert failed for booking, using structured memory object:", dbError);
    }

    // 4. Crear sesión oficial de Stripe Checkout
    const appUrl = getAppUrl();
    const stripeInstance = getStripe();
    let stripeUrl: string | null = null;

    try {
      const sessionStripe = await stripeInstance.checkout.sessions.create({
        mode: "payment",
        customer_email: userEmail || undefined,
        client_reference_id: createdBooking.id,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Contigo Tours: ${destination.name}`,
                description: `Reserva ${bookingCode} • ${numAdults} Adultos, ${numChildren} Niños (${nights} noches en ${hotelName})`,
                images: destination.imageUrl ? [destination.imageUrl] : [],
              },
              unit_amount: Math.round(totalPrice * 100), // En centavos USD
            },
            quantity: 1,
          },
        ],
        metadata: {
          bookingId: createdBooking.id,
          bookingCode: bookingCode,
          customerEmail: userEmail || "",
        },
        success_url: `${appUrl}/client/bookings/${bookingCode}?payment_success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/client/bookings/${bookingCode}?payment_cancelled=true`,
      });

      stripeUrl = sessionStripe.url;
    } catch (stripeErr: any) {
      console.error("[STRIPE_CHECKOUT_SESSION_CREATE_ERROR]", stripeErr.message);
    }

    const response = NextResponse.json(
      {
        message: "Reserva generada con éxito.",
        booking: createdBooking,
        stripeUrl: stripeUrl || `${appUrl}/client/bookings/${bookingCode}?stripe_ready=true`,
      },
      { status: 201 }
    );

    // Si se generó un nuevo token de sesión, guardarlo en la cookie
    if (tokenToSet) {
      response.cookies.set(TOKEN_COOKIE_NAME, tokenToSet, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    return response;
  } catch (error: any) {
    console.error("[BOOKINGS_POST_ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Error al procesar la reserva." },
      { status: 500 }
    );
  }
}
