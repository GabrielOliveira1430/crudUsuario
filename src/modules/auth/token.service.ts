import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';

const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

const ISSUER = 'api-node-prisma';
const AUDIENCE = 'users';

export function generateAccessToken(userId: number, role?: string) {
  return jwt.sign(
    {
      sub: String(userId),
      role, // pode manter, mas não confie nele no middleware
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

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, process.env.JWT_SECRET as string, {
    issuer: ISSUER,
    audience: AUDIENCE,
  }) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string, {
    issuer: ISSUER,
    audience: AUDIENCE,
  }) as JwtPayload;
}