import { cookies } from "next/headers";
import { env } from "~/env";
import { AccessTokenClaims, VerifyTokenClaims } from "~/types/jwt";
import { jwtVerify } from "jose";

export const extractAccessToken = async (
  token: string,
): Promise<AccessTokenClaims> => {
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(env.JWT_SECRET),
  );
  return payload as AccessTokenClaims;
};

export const extractVerifyToken = async (
  token: string,
): Promise<VerifyTokenClaims> => {
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(env.JWT_SECRET),
  );
  return payload as VerifyTokenClaims;
};

export async function getVerifyToken() {
  const cookieStore = cookies();
  const token = cookieStore.get("verify_token")?.value;

  if (!token) return null;

  try {
    const claims = await extractVerifyToken(token);
    return claims;
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) return null;

  try {
    const claims = await extractAccessToken(token);
    return claims;
  } catch (error) {
    return null;
  }
}

export async function clearVerifyToken() {
  cookies().delete("verify_token");
}

export async function clearSession() {
  cookies().delete("access_token");
}
