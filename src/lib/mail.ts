import { Resend } from "resend";

const RESEND_TEST_OWNER = "nesred.02@gmail.com";

export function getResendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

export function getEmailFrom(): string {
  return process.env.EMAIL_FROM || "Contigo Tours <onboarding@resend.dev>";
}

export function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("contigotours.vercel.app")) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    return "https://agenciade-viajes.vercel.app";
  }
  return "http://localhost:3000";
}

interface SendVerificationEmailParams {
  to: string;
  name: string;
  token: string;
}

interface SendBookingConfirmationParams {
  to: string;
  customerName: string;
  bookingCode: string;
  destinationName: string;
  hotelName?: string | null;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  totalPrice: number;
}

export interface SendSchoolTripInquiryParams {
  name: string;
  email: string;
  phone: string;
  schoolName?: string;
  destination?: string;
  studentsCount?: string | number;
  travelDate?: string;
  message?: string;
}

/**
 * Enviar correo de verificación de cuenta
 */
export async function sendVerificationEmail({ to, name, token }: SendVerificationEmailParams) {
  const appUrl = getAppUrl();
  const verifyUrl = `${appUrl}/auth/verify?token=${token}`;
  const cleanTo = to.toLowerCase().trim();

  const generateHtml = (isOwnerCopy = false) => `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #0284c7; margin: 0; font-size: 28px; font-weight: 800;">🌍 Contigo Tours</h1>
        <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Tu agencia de viajes de confianza</p>
      </div>

      ${
        isOwnerCopy
          ? `
      <div style="background-color: #fef3c7; border: 2px solid #f59e0b; padding: 14px 18px; border-radius: 10px; margin-bottom: 24px; color: #92400e; font-size: 13px; line-height: 1.5;">
        <strong>🔔 Notificación de Verificación (Sandbox de Resend):</strong><br>
        Se registró una cuenta con el correo: <strong>${to}</strong> (Usuario: <strong>${name}</strong>).<br><br>
        Debido a que la cuenta de prueba gratuita de Resend (<em>onboarding@resend.dev</em>) únicamente permite despachar emails a tu dirección oficial registrada (<strong>${RESEND_TEST_OWNER}</strong>), te lo hemos entregado aquí de inmediato para que puedas activar la nueva cuenta con 1 clic en el botón de abajo.
      </div>
      `
          : ""
      }

      <div style="padding: 20px 0; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9;">
        <h2 style="color: #0f172a; font-size: 20px; font-weight: 700; margin-top: 0;">¡Hola, ${name}!</h2>
        <p style="color: #334155; font-size: 15px; line-height: 1.6;">
          Gracias por registrarte en <strong>Contigo Tours</strong>. Para poder gestionar tus viajes, cotizaciones y confirmar tus reservas, confirma tu cuenta de correo haciendo clic en el siguiente botón:
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${verifyUrl}" style="background-color: #0284c7; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px; display: inline-block;">
            ⚡ Verificar y Activar Mi Cuenta Ahora
          </a>
        </div>
        <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
          Si no puedes hacer clic en el botón, copia y pega el siguiente enlace directo en tu navegador:<br>
          <a href="${verifyUrl}" style="color: #0284c7; word-break: break-all;">${verifyUrl}</a>
        </p>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 16px;">Este enlace de verificación es válido por 24 horas.</p>
      </div>
      <div style="text-align: center; margin-top: 24px; color: #94a3b8; font-size: 12px;">
        <p>© ${new Date().getFullYear()} Contigo Tours. Todos los derechos reservados.</p>
      </div>
    </div>
  `;

  const resendClient = getResendClient();
  const from = getEmailFrom();

  if (resendClient) {
    try {
      // 1. Intentar enviar al destinatario solicitado
      const result = await resendClient.emails.send({
        from,
        to: cleanTo,
        subject: "Verifica tu cuenta en Contigo Tours",
        html: generateHtml(false),
      });

      console.log(`[MAIL] Intento de envío de verificación a ${cleanTo}:`, result);

      if (result.data?.id) {
        return { success: true, verifyUrl, resendId: result.data.id, deliveredTo: cleanTo };
      }

      // Si Resend devolvió error de restricción de sandbox (solo envía a la cuenta propietaria)
      const isSandboxRestriction =
        result.error?.message?.includes("only send testing emails") ||
        (result.error as any)?.statusCode === 403 ||
        result.error?.name === "validation_error";

      if (isSandboxRestriction && cleanTo !== RESEND_TEST_OWNER) {
        console.warn(
          `[MAIL] Resend en modo pruebas bloqueó envío a ${cleanTo}. Reenviando a cuenta registrada de Resend (${RESEND_TEST_OWNER})...`
        );

        const ownerResult = await resendClient.emails.send({
          from,
          to: RESEND_TEST_OWNER,
          subject: `[Para: ${cleanTo}] ✈️ Verifica tu cuenta en Contigo Tours (${name})`,
          html: generateHtml(true),
        });

        console.log(`[MAIL] Reenvío de verificación a cuenta propietaria (${RESEND_TEST_OWNER}):`, ownerResult);

        return {
          success: true,
          verifyUrl,
          resendId: ownerResult.data?.id,
          deliveredTo: RESEND_TEST_OWNER,
          originalRecipient: cleanTo,
          sandboxNotice: true,
        };
      }
    } catch (error: any) {
      console.error("[MAIL] Error inesperado llamando a Resend:", error);

      // Si falló por restricción y el destinatario no es el dueño
      if (cleanTo !== RESEND_TEST_OWNER) {
        try {
          const ownerResult = await resendClient.emails.send({
            from,
            to: RESEND_TEST_OWNER,
            subject: `[Para: ${cleanTo}] ✈️ Verifica tu cuenta en Contigo Tours (${name})`,
            html: generateHtml(true),
          });
          return {
            success: true,
            verifyUrl,
            resendId: ownerResult.data?.id,
            deliveredTo: RESEND_TEST_OWNER,
          };
        } catch (subErr) {
          console.error("[MAIL] Error reenviando a owner:", subErr);
        }
      }
    }
  }

  // Fallback simulador en terminal
  console.log("=================================================");
  console.log(`📨 [SIMULADOR DE EMAIL] Para: ${to}`);
  console.log(`🔗 Enlace de verificación: ${verifyUrl}`);
  console.log("=================================================");
  return { success: true, simulated: true, verifyUrl };
}

/**
 * Enviar confirmación de reserva
 */
export async function sendBookingConfirmationEmail({
  to,
  customerName,
  bookingCode,
  destinationName,
  hotelName,
  checkIn,
  checkOut,
  adults,
  children,
  totalPrice,
}: SendBookingConfirmationParams) {
  const appUrl = getAppUrl();
  const voucherUrl = `${appUrl}/client/bookings/${bookingCode}`;
  const cleanTo = to.toLowerCase().trim();

  const generateHtml = (isOwnerCopy = false) => `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #0284c7; margin: 0; font-size: 28px; font-weight: 800;">🎉 ¡Tu Reserva está Confirmada!</h1>
        <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Contigo Tours - Viaja sin preocupaciones</p>
      </div>

      ${
        isOwnerCopy
          ? `
      <div style="background-color: #fef3c7; border: 2px solid #f59e0b; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; color: #92400e; font-size: 13px;">
        <strong>🔔 Copia de Respaldo (Resend Sandbox):</strong> Este voucher fue emitido para el cliente <strong>${cleanTo}</strong> (${customerName}).
      </div>
      `
          : ""
      }

      <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center;">
        <p style="margin: 0; color: #166534; font-weight: 700; font-size: 18px;">Código de Reserva: ${bookingCode}</p>
        <p style="margin: 4px 0 0; color: #15803d; font-size: 14px;">Estado del Pago: PAGADO (PAID)</p>
      </div>
      <div style="padding: 16px 0; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9;">
        <h3 style="color: #0f172a; margin-top: 0;">Detalles del Itinerario:</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #334155;">
          <tr>
            <td style="padding: 8px 0; font-weight: 600;">Titular:</td>
            <td style="padding: 8px 0; text-align: right;">${customerName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600;">Destino:</td>
            <td style="padding: 8px 0; text-align: right;">${destinationName}</td>
          </tr>
          ${
            hotelName
              ? `
          <tr>
            <td style="padding: 8px 0; font-weight: 600;">Hotel / Hospedaje:</td>
            <td style="padding: 8px 0; text-align: right;">${hotelName}</td>
          </tr>`
              : ""
          }
          <tr>
            <td style="padding: 8px 0; font-weight: 600;">Fechas:</td>
            <td style="padding: 8px 0; text-align: right;">${checkIn} al ${checkOut}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600;">Pasajeros:</td>
            <td style="padding: 8px 0; text-align: right;">${adults} Adulto(s)${children > 0 ? `, ${children} Niño(s)` : ""}</td>
          </tr>
          <tr style="border-top: 2px solid #e2e8f0; font-size: 16px;">
            <td style="padding: 12px 0; font-weight: 800; color: #0f172a;">Total Pagado:</td>
            <td style="padding: 12px 0; text-align: right; font-weight: 800; color: #0284c7;">$${totalPrice.toFixed(2)} USD</td>
          </tr>
        </table>
        <div style="text-align: center; margin: 28px 0 12px;">
          <a href="${voucherUrl}" style="background-color: #0284c7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; display: inline-block;">
            Ver / Descargar Voucher de Viaje
          </a>
        </div>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #94a3b8; font-size: 12px;">
        <p>¿Tienes dudas o cambios? Escríbenos a soporte@contigotours.com o por WhatsApp al +52 (443) 186-6129.</p>
        <p>© ${new Date().getFullYear()} Contigo Tours.</p>
      </div>
    </div>
  `;

  const resendClient = getResendClient();
  const from = getEmailFrom();

  if (resendClient) {
    try {
      const result = await resendClient.emails.send({
        from,
        to: cleanTo,
        subject: `Confirmación de Reserva ${bookingCode} - Contigo Tours`,
        html: generateHtml(false),
      });

      if (result.data?.id) {
        console.log(`[MAIL] Confirmación de reserva enviada a ${cleanTo}`);
        return { success: true };
      }

      // Si hubo error de sandbox
      if (cleanTo !== RESEND_TEST_OWNER) {
        await resendClient.emails.send({
          from,
          to: RESEND_TEST_OWNER,
          subject: `[Copia para ${cleanTo}] Confirmación de Reserva ${bookingCode} - Contigo Tours`,
          html: generateHtml(true),
        });
        console.log(`[MAIL] Copia de confirmación enviada al owner (${RESEND_TEST_OWNER})`);
        return { success: true };
      }
    } catch (error) {
      console.error("[MAIL] Error enviando confirmación de reserva con Resend:", error);
    }
  }

  console.log("=================================================");
  console.log(`📨 [SIMULADOR DE EMAIL] Confirmación enviada a: ${to}`);
  console.log(`🎟️ Código: ${bookingCode} | Total: $${totalPrice} USD`);
  console.log("=================================================");
  return { success: true, simulated: true };
}

/**
 * Enviar solicitud de viaje escolar / informes
 */
export async function sendSchoolTripInquiryEmail(data: SendSchoolTripInquiryParams) {
  const targetEmail = process.env.SCHOOL_TRIPS_ADMIN_EMAIL || "hugoalex.riverab@gmail.com";
  const cleanPhone = (data.phone || "").replace(/\D/g, "");
  const whatsAppDirectUrl =
    cleanPhone.length >= 10
      ? `https://wa.me/${cleanPhone.startsWith("52") ? cleanPhone : `52${cleanPhone}`}?text=${encodeURIComponent(
          `Hola ${data.name}, te contacto de Contigo Tours respecto a tu solicitud de viaje escolar.`
        )}`
      : `https://wa.me/524431866129`;

  const generateHtml = (isOwnerCopy = false) => `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px; background: linear-gradient(135deg, #0284c7, #0369a1); padding: 20px; border-radius: 10px; color: white;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 800;">🎒 Nueva Solicitud de Viaje Escolar / Informes</h1>
        <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.9;">Contigo Tours - Prospecto de Viaje en Grupo</p>
      </div>

      ${
        isOwnerCopy
          ? `
      <div style="background-color: #fef3c7; border: 2px solid #f59e0b; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; color: #92400e; font-size: 13px;">
        <strong>🔔 Copia de Sandbox Resend:</strong> El informe está destinado originalmente a <strong>${targetEmail}</strong>.
      </div>
      `
          : ""
      }

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <p style="margin: 0; color: #0369a1; font-weight: 700; font-size: 15px;">
          📌 Contacto asignado a: <strong>${targetEmail}</strong>
        </p>
        <p style="margin: 4px 0 0; color: #475569; font-size: 13px;">
          Llegó a través del Chat de Informes / Formulario de Viajes Escolares.
        </p>
      </div>

      <div style="padding: 10px 0;">
        <h3 style="color: #0f172a; border-bottom: 2px solid #0284c7; padding-bottom: 8px; margin-top: 0;">Detalles del Solicitante:</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #334155;">
          <tr>
            <td style="padding: 8px 0; font-weight: 600; width: 40%;">Nombre Completo:</td>
            <td style="padding: 8px 0; color: #0f172a; font-weight: 700;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600;">Correo Electrónico:</td>
            <td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #0284c7;">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600;">Teléfono / WhatsApp:</td>
            <td style="padding: 8px 0;"><a href="tel:${data.phone}" style="color: #0284c7; font-weight: 700;">${data.phone}</a></td>
          </tr>
          ${
            data.schoolName
              ? `
          <tr>
            <td style="padding: 8px 0; font-weight: 600;">Institución / Escuela:</td>
            <td style="padding: 8px 0; font-weight: 600;">${data.schoolName}</td>
          </tr>`
              : ""
          }
          ${
            data.destination
              ? `
          <tr>
            <td style="padding: 8px 0; font-weight: 600;">Destino de Interés:</td>
            <td style="padding: 8px 0; color: #0284c7; font-weight: 700;">${data.destination}</td>
          </tr>`
              : ""
          }
          ${
            data.studentsCount
              ? `
          <tr>
            <td style="padding: 8px 0; font-weight: 600;">Alumnos / Viajeros estimados:</td>
            <td style="padding: 8px 0;">${data.studentsCount} pasajeros</td>
          </tr>`
              : ""
          }
          ${
            data.travelDate
              ? `
          <tr>
            <td style="padding: 8px 0; font-weight: 600;">Fecha tentativa:</td>
            <td style="padding: 8px 0;">${data.travelDate}</td>
          </tr>`
              : ""
          }
        </table>

        ${
          data.message
            ? `
        <div style="margin-top: 16px; padding: 14px; background-color: #f1f5f9; border-left: 4px solid #0284c7; border-radius: 4px;">
          <p style="margin: 0 0 4px; font-weight: 700; color: #0f172a; font-size: 13px;">Mensaje / Dudas del cliente:</p>
          <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.5;">${data.message}</p>
        </div>`
            : ""
        }

        <div style="margin-top: 28px; text-align: center;">
          <a href="${whatsAppDirectUrl}" style="background-color: #25D366; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; display: inline-block; margin-right: 10px;">
            💬 Abrir WhatsApp con el Cliente
          </a>
          <a href="mailto:${data.email}?subject=Informes%20de%20Viaje%20Escolar%20-%20Contigo%20Tours" style="background-color: #0284c7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; display: inline-block;">
            ✉️ Responder por Correo
          </a>
        </div>
      </div>

      <div style="text-align: center; margin-top: 28px; padding-top: 16px; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 12px;">
        <p>Contigo Tours • Coordinación de Viajes Escolares y Grupales</p>
        <p>WhatsApp Central: +52 443 186 6129 • hugoalex.riverab@gmail.com</p>
      </div>
    </div>
  `;

  const resendClient = getResendClient();
  const from = getEmailFrom();

  if (resendClient) {
    try {
      const result = await resendClient.emails.send({
        from,
        to: targetEmail,
        replyTo: data.email,
        subject: `🎒 Solicitud de Viaje Escolar / Informes: ${data.name}${data.schoolName ? ` (${data.schoolName})` : ""}`,
        html: generateHtml(false),
      });

      if (result.data?.id) {
        console.log(`[MAIL] Solicitud de viaje escolar enviada a ${targetEmail}`);
        return { success: true };
      }

      // Si Resend sandbox no permite enviar a targetEmail, enviar a la cuenta registrada
      if (targetEmail.toLowerCase() !== RESEND_TEST_OWNER) {
        await resendClient.emails.send({
          from,
          to: RESEND_TEST_OWNER,
          replyTo: data.email,
          subject: `[Para: ${targetEmail}] 🎒 Solicitud de Viaje Escolar: ${data.name}`,
          html: generateHtml(true),
        });
        console.log(`[MAIL] Solicitud entregada a cuenta de Resend (${RESEND_TEST_OWNER})`);
        return { success: true };
      }
    } catch (error) {
      console.error("[MAIL] Error enviando informe con Resend:", error);
    }
  }

  // Fallback simulador
  console.log("=================================================");
  console.log(`📨 [SIMULADOR DE EMAIL] Solicitud de Viaje Escolar / Informes`);
  console.log(`📬 Destinatario: ${targetEmail}`);
  console.log(`👤 Solicitante: ${data.name} | 📱 ${data.phone} | ✉️ ${data.email}`);
  console.log("=================================================");
  return { success: true, simulated: true };
}
