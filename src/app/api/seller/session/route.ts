import { NextResponse } from 'next/server'
import { hasSellerSessionFromRequest } from '@/lib/seller-auth'

export async function GET(request: Request) {
  if (!await hasSellerSessionFromRequest(request)) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}
