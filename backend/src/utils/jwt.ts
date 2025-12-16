import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as jwt.Secret;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as jwt.Secret;

export const generateAccessToken = (userId: string, email: string, role: string): string => {
  return (jwt.sign as any)(
    { id: userId, email, role },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
};

export const generateRefreshToken = (userId: string): string => {
  return (jwt.sign as any)(
    { id: userId },
    JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

export const verifyRefreshToken = (token: string): { id: string } => {
  return (jwt.verify as any)(token, JWT_REFRESH_SECRET) as { id: string };
};
