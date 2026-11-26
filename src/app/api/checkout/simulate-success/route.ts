import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { sendBookingConfirmationEmail } from "@/lib/mail";
import { formatDate } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const { bookingId } = await req.json();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { destination: true, hotel: true, user: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Reserva no encontrada." }, { status: 404 });
    }

    // Actualizar estado a PAID
    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "PAID" },
      include: { destination: true, hotel: true, user: true },
    });

    // Crear registro de pago
    await prisma.payment.upsert({
      where: { bookingId },
      create: {
        bookingId,
        amount: booking.totalPrice,
        currency: "USD",
        status: "COMPLETED",
        paymentMethod: "STRIPE_TEST_SIMULATOR",
        stripePaymentIntentId: `sim_pi_${Date.now()}`,
      },
      update: {
        status: "COMPLETED",
      },
    });

    // Enviar correo de confirmación de reserva
    await sendBookingConfirmationEmail({
      to: updated.user.email,
      customerName: updated.user.name,
      bookingCode: updated.bookingCode,
      destinationName: updated.destination.name,
      hotelName: updated.hotel?.name || "Sin hotel asignado",
      checkIn: formatDate(updated.checkIn),
      checkOut: formatDate(updated.checkOut),
      adults: updated.adults,
      children: updated.children,
      totalPrice: updated.totalPrice,
    });

    return NextResponse.json({
      message: "Pago simulado con éxito y correo de confirmación disparado.",
      booking: updated,
    });
  } catch (error) {
    console.error("[SIMULATE_PAYMENT_ERROR]", error);
    return NextResponse.json({ error: "Error al simular pago." }, { status: 500 });
  }
}
