import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';

// 📌 CONFIG PADRÃO
const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

const ISSUER = 'api-node-prisma';
const AUDIENCE = 'users';

// 🔐 GERAR ACCESS TOKEN
export function generateAccessToken(userId: number, role?: string) {
  return jwt.sign(
    {
      sub: String(userId),
      ...(role && { role }),
      jti: crypto.randomUUID(),
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      issuer: ISSUER,
      audience: AUDIENCE,
    }
  );
}

// 🔐 GERAR REFRESH TOKEN
export function generateRefreshToken(userId: number) {
  return jwt.sign(
    {
      sub: String(userId),
      jti: crypto.randomUUID(),
    },
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      issuer: ISSUER,
      audience: AUDIENCE,
    }
  );
}

// 🔍 VALIDAR ACCESS TOKEN
export function verifyAccessToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string, {
      issuer: ISSUER,
      audience: AUDIENCE,
    }) as JwtPayload;
  } catch {
    throw new Error('Token inválido ou expirado');
  }
}

// 🔍 VALIDAR REFRESH TOKEN
export function verifyRefreshToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string, {
      issuer: ISSUER,
      audience: AUDIENCE,
    }) as JwtPayload;
  } catch {
    throw new Error('Refresh token inválido ou expirado');
  }
}