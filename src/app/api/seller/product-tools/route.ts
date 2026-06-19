import { NextRequest, NextResponse } from 'next/server'
import { aggregateEventsForSlug, getEvents } from '@/lib/analytics'
import { hasSellerSessionFromRequest } from '@/lib/seller-auth'

export async function GET(request: NextRequest) {
  if (!await hasSellerSessionFromRequest(request)) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const slug = request.nextUrl.searchParams.get('slug')
  if (!slug) {
    return NextResponse.json({ ok: false, reason: 'missing_slug' }, { status: 400 })
  }

  const events = await getEvents()
  const stats = aggregateEventsForSlug(events, slug)

  return NextResponse.json({ ok: true, stats })
}
