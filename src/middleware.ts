import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  SELLER_COOKIE_NAME,
  clearSellerCookieOptions,
  isValidSellerToken,
  sellerCookieOptions,
  signSellerSession,
} from '@/lib/seller-auth'

export async function middleware(request: NextRequest) {
  const secret = process.env.SELLER_SECRET ?? ''
  const { pathname, searchParams } = request.nextUrl

  if (pathname === '/seller/logout') {
    const response = NextResponse.redirect(new URL('/', request.url))
    response.cookies.set(SELLER_COOKIE_NAME, '', clearSellerCookieOptions())
    return response
  }

  const isUnlockRoute = pathname === '/seller/unlock'
  const token = isUnlockRoute ? searchParams.get('token') : searchParams.get('seller')

  if (isUnlockRoute && !token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!token) return NextResponse.next()

  const url = request.nextUrl.clone()
  if (isUnlockRoute) {
    url.pathname = '/'
    url.search = ''
  } else {
    url.searchParams.delete('seller')
  }

  const response = NextResponse.redirect(url)

  if (!isValidSellerToken(token, secret)) {
    if (isUnlockRoute) {
      url.searchParams.set('seller_unlock', 'invalid')
      return NextResponse.redirect(url)
    }
    return response
  }

  const signed = await signSellerSession(secret)
  response.cookies.set(SELLER_COOKIE_NAME, signed, sellerCookieOptions())

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|products/).*)'],
}
