import { NextRequest, NextResponse } from 'next/server'
import { appendEvent, isBlockedRequest } from '@/lib/analytics'
import { hasSellerSessionFromRequest } from '@/lib/seller-auth'
import { isTrackingEnabled } from '@/lib/tracking-enabled'
import type { TrackPayload } from '@/lib/types'

const PUBLIC_TYPES = new Set(['pageview', 'whatsapp_click'])
const SELLER_TYPES = new Set(['copy_crosspost'])

export async function POST(request: NextRequest) {
  if (!isTrackingEnabled()) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  const userAgent = request.headers.get('user-agent')
  const secPurpose = request.headers.get('sec-purpose')

  if (isBlockedRequest(userAgent, secPurpose)) {
    return NextResponse.json({ ok: false, reason: 'blocked' }, { status: 403 })
  }

  let payload: TrackPayload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ ok: false, reason: 'invalid' }, { status: 400 })
  }

  const isPublicType = PUBLIC_TYPES.has(payload.type)
  const isSellerType = SELLER_TYPES.has(payload.type)

  if ((!isPublicType && !isSellerType) || !payload.path) {
    return NextResponse.json({ ok: false, reason: 'invalid' }, { status: 400 })
  }

  if (isSellerType && !await hasSellerSessionFromRequest(request)) {
    return NextResponse.json({ ok: false, reason: 'unauthorized' }, { status: 401 })
  }

  try {
    await appendEvent(payload, userAgent ?? '', request.headers.get('referer'))
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, reason: 'storage' }, { status: 503 })
  }
}
