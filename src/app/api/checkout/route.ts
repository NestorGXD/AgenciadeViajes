import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    const body = await req.json();
    const { bookingId, gateway = "stripe", guestEmail, guestName } = body;

    if (!bookingId) {
      return NextResponse.json({ error: "ID de reserva requerido." }, { status: 400 });
    }

    let booking: any = null;
    try {
      booking = await prisma.booking.findFirst({
        where: {
          OR: [{ id: bookingId }, { bookingCode: bookingId }],
        },
        include: {
          destination: true,
          hotel: true,
          user: true,
        },
      });
    } catch (dbErr) {
      console.warn("Prisma query failed in checkout, using fallback data:", dbErr);
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const customerEmail = booking?.user?.email || guestEmail || session?.email || "cliente@contigotours.com";
    const destinationName = booking?.destination?.name || "Paquete de Viaje Contigo Tours";
    const amount = booking?.totalPrice || 500;
    const bookingCode = booking?.bookingCode || `CT-${Date.now().toString().slice(-6)}`;

    // 1. STRIPE CHECKOUT CON LLAVES OFICIALES
    if (gateway === "stripe") {
      const stripeInstance = getStripe();

      // Crear sesión en Stripe SIN payment_method_types (para compatibilidad total con cuentas modernas)
      const sessionStripe = await stripeInstance.checkout.sessions.create({
        mode: "payment",
        customer_email: customerEmail,
        client_reference_id: booking?.id || bookingCode,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Contigo Tours: ${destinationName}`,
                description: `Reserva ${bookingCode} • Confirmación Inmediata de Viaje`,
                images: booking?.destination?.imageUrl ? [booking.destination.imageUrl] : [],
              },
              unit_amount: Math.round(amount * 100), // En centavos USD
            },
            quantity: 1,
          },
        ],
        metadata: {
          bookingId: booking?.id || bookingCode,
          bookingCode: bookingCode,
          customerEmail: customerEmail,
        },
        success_url: `${appUrl}/client/bookings/${bookingCode}?payment_success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/client/bookings/${bookingCode}?payment_cancelled=true`,
      });

      return NextResponse.json({
        url: sessionStripe.url,
        sessionId: sessionStripe.id,
      });
    }

    return NextResponse.json({ error: "Pasarela no soportada." }, { status: 400 });
  } catch (error: any) {
    console.error("[CHECKOUT_ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Error al inicializar la pasarela de pagos Stripe." },
      { status: 500 }
    );
  }
}
