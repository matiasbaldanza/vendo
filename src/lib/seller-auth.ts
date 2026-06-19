import { cookies } from 'next/headers'
import { siteConfig } from '../../site.config'

export const SELLER_COOKIE_NAME = 'vendo_seller'
const SESSION_MARKER = 'vendo-seller-v1'

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return mismatch === 0
}

export function isValidSellerToken(token: string | null | undefined, secret: string): boolean {
  if (!token || !secret) return false
  if (token.length !== secret.length) return false
  return timingSafeEqual(token, secret)
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message))
  return Array.from(new Uint8Array(signature))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
}

export async function signSellerSession(secret: string): Promise<string> {
  return hmacSha256Hex(secret, SESSION_MARKER)
}

export async function verifySellerSessionCookie(
  value: string | undefined,
  secret: string
): Promise<boolean> {
  if (!value || !secret) return false
  const expected = await signSellerSession(secret)
  return timingSafeEqual(value, expected)
}

function readCookieValue(cookieHeader: string | null, name: string): string | undefined {
  if (!cookieHeader) return undefined
  for (const part of cookieHeader.split(';')) {
    const [rawName, ...rest] = part.trim().split('=')
    if (rawName === name) return rest.join('=')
  }
  return undefined
}

export async function hasSellerSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const value = cookieStore.get(SELLER_COOKIE_NAME)?.value
  return verifySellerSessionCookie(value, siteConfig.sellerSecret)
}

export async function hasSellerSessionFromRequest(request: Request): Promise<boolean> {
  const value = readCookieValue(request.headers.get('cookie'), SELLER_COOKIE_NAME)
  return verifySellerSessionCookie(value, siteConfig.sellerSecret)
}

export function sellerCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 90) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  }
}

export function clearSellerCookieOptions() {
  return {
    ...sellerCookieOptions(0),
    maxAge: 0,
    expires: new Date(0),
  }
}
