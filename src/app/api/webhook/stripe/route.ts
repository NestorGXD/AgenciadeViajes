import { NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { sendBookingConfirmationEmail } from "@/lib/mail";
import { formatDate } from "@/lib/utils";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  let event: any;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // Si no hay firma estricta en local/preview, parsear el payload JSON
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error(`[STRIPE_WEBHOOK_ERROR] Fallo al verificar webhook: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Manejar evento de pago exitoso
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const bookingId = session.metadata?.bookingId || session.client_reference_id;

    if (bookingId) {
      try {
        // 1. Actualizar reserva a PAID
        const updatedBooking = await prisma.booking.update({
          where: { id: bookingId },
          data: { status: "PAID" },
          include: {
            destination: true,
            hotel: true,
            user: true,
          },
        });

        // 2. Registrar o actualizar registro de pago
        await prisma.payment.upsert({
          where: { bookingId: updatedBooking.id },
          create: {
            bookingId: updatedBooking.id,
            stripePaymentIntentId: session.payment_intent || null,
            stripeSessionId: session.id,
            amount: session.amount_total ? session.amount_total / 100 : updatedBooking.totalPrice,
            currency: (session.currency || "USD").toUpperCase(),
            status: "COMPLETED",
            paymentMethod: "STRIPE",
          },
          update: {
            stripePaymentIntentId: session.payment_intent || null,
            stripeSessionId: session.id,
            status: "COMPLETED",
          },
        });

        // 3. Disparar correo de confirmación de reserva
        await sendBookingConfirmationEmail({
          to: updatedBooking.user.email,
          customerName: updatedBooking.user.name,
          bookingCode: updatedBooking.bookingCode,
          destinationName: updatedBooking.destination.name,
          hotelName: updatedBooking.hotel?.name || "Sin hotel asignado",
          checkIn: formatDate(updatedBooking.checkIn),
          checkOut: formatDate(updatedBooking.checkOut),
          adults: updatedBooking.adults,
          children: updatedBooking.children,
          totalPrice: updatedBooking.totalPrice,
        });

        console.log(`[STRIPE_WEBHOOK] Reserva ${updatedBooking.bookingCode} pagada y confirmada.`);
      } catch (dbError) {
        console.error("[STRIPE_WEBHOOK_DB_ERROR]", dbError);
        return NextResponse.json({ error: "Error actualizando la base de datos." }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
