import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'aurevex_secure_super_secret_jwt_key_2026';
const TOKEN_COOKIE_NAME = 'aurevex_auth_token';

export interface UserSession {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(session: UserSession): string {
  return jwt.sign(session, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserSession;
  } catch {
    return null;
  }
}

export function getSessionFromRequest(req: NextRequest): UserSession | null {
  const authHeader = req.headers.get('Authorization');
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    token = req.cookies.get(TOKEN_COOKIE_NAME)?.value;
  }

  if (!token) return null;
  return verifyToken(token);
}

export function setAuthCookie(res: NextResponse, token: string): void {
  res.cookies.set({
    name: TOKEN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export function clearAuthCookie(res: NextResponse): void {
  res.cookies.set({
    name: TOKEN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

export async function getAuthenticatedUser(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });
    return user;
  } catch (err) {
    console.error('Error finding auth user:', err);
    return null;
  }
}
