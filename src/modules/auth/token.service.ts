import jwt, {
  JwtPayload
} from 'jsonwebtoken';

import crypto from 'crypto';

const ACCESS_EXPIRES = '15m';
const REFRESH_EXPIRES = '7d';

const ISSUER =
  'api-node-prisma';

const AUDIENCE =
  'users';


// ========================================
// 🔐 VALIDAR SECRETS
// ========================================

function assertSecrets() {

  if (
    !process.env.JWT_SECRET ||
    !process.env.JWT_REFRESH_SECRET
  ) {
    throw new Error(
      'JWT secrets não configurados'
    );
  }
}


// ========================================
// 🔐 ACCESS TOKEN
// ========================================

export function generateAccessToken(
  userId: number,
  role?: string,
  plan?: string
) {

  assertSecrets();

  if (!userId) {
    throw new Error(
      'userId inválido'
    );
  }

  return jwt.sign(

    {
      sub: String(userId),

      role:
        role || 'USER',

      plan:
        plan || 'FREE',

      jti:
        crypto.randomUUID(),
    },

    process.env.JWT_SECRET!,

    {
      expiresIn:
        ACCESS_EXPIRES,

      issuer:
        ISSUER,

      audience:
        AUDIENCE,
    }
  );
}


// ========================================
// 🔐 REFRESH TOKEN
// ========================================

export function generateRefreshToken(
  userId: number
) {

  assertSecrets();

  if (!userId) {
    throw new Error(
      'userId inválido'
    );
  }

  return jwt.sign(

    {
      sub:
        String(userId),

      jti:
        crypto.randomUUID(),
    },

    process.env.JWT_REFRESH_SECRET!,

    {
      expiresIn:
        REFRESH_EXPIRES,

      issuer:
        ISSUER,

      audience:
        AUDIENCE,
    }
  );
}


// ========================================
// 🔍 VERIFY ACCESS
// ========================================

export function verifyAccessToken(
  token: string
): JwtPayload {

  assertSecrets();

  const decoded =
    jwt.verify(

      token,

      process.env.JWT_SECRET!,

      {
        issuer:
          ISSUER,

        audience:
          AUDIENCE,
      }

    ) as JwtPayload;

  if (!decoded.sub) {
    throw new Error(
      'Access token inválido'
    );
  }

  return decoded;
}


// ========================================
// 🔍 VERIFY REFRESH
// ========================================

export function verifyRefreshToken(
  token: string
): JwtPayload {

  assertSecrets();

  const decoded =
    jwt.verify(

      token,

      process.env.JWT_REFRESH_SECRET!,

      {
        issuer:
          ISSUER,

        audience:
          AUDIENCE,
      }

    ) as JwtPayload;

  if (!decoded.sub) {
    throw new Error(
      'Refresh token inválido'
    );
  }

  return decoded;
}