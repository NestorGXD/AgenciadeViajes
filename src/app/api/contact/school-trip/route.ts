import { NextResponse } from "next/server";
import { sendSchoolTripInquiryEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, schoolName, destination, studentsCount, travelDate, message } = body;

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { error: "Por favor proporciona tu nombre y al menos un método de contacto (correo o teléfono/WhatsApp)." },
        { status: 400 }
      );
    }

    await sendSchoolTripInquiryEmail({
      name,
      email: email || "Sin correo",
      phone: phone || "Sin teléfono",
      schoolName,
      destination,
      studentsCount,
      travelDate,
      message,
    });

    return NextResponse.json({
      success: true,
      message: "¡Informes solicitados con éxito! Tu mensaje ha sido enviado a nuestro coordinador de viajes escolares y te contactaremos en breve.",
    });
  } catch (error: any) {
    console.error("[SCHOOL_TRIP_INQUIRY_ERROR]", error);
    return NextResponse.json(
      { error: "Ocurrió un error al enviar tu solicitud de informes. Por favor intenta de nuevo o contáctanos directamente por WhatsApp." },
      { status: 500 }
    );
  }
}
