import { SignJWT, jwtVerify } from "jose";
import * as bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { SessionUser } from "@/types";

export const TOKEN_COOKIE_NAME = "contigo_token";

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "contigo-tours-default-secret-key-change-in-prod-32chars";
  return new TextEncoder().encode(secret);
};

export async function signToken(user: SessionUser): Promise<string> {
  const secret = getSecretKey();
  return await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const secret = getSecretKey();
    const { payload } = await jwtVerify(token, secret);
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as SessionUser["role"],
      emailVerified: (payload.emailVerified as string) || null,
    };
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getServerSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch {
    return null;
  }
}
