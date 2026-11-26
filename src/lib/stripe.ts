import https from "https";
import Stripe from "stripe";

export function getStripe(): Stripe {
  const secret = process.env.STRIPE_SECRET_KEY || "";
  
  // En Windows o entornos locales con proxies SSL / antivirus, evitar fallos de certificados
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });

  return new Stripe(secret, {
    apiVersion: "2024-11-20.acacia" as any,
    typescript: true,
    httpAgent: agent,
  });
}

export const stripe = getStripe();
