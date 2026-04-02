import jwt from 'jsonwebtoken';

export function generateAccessToken(userId: number) {
  return jwt.sign(
    { sub: userId },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );
}

export function generateRefreshToken(userId: number) {
  return jwt.sign(
    { sub: userId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );
}