import { NextRequest, NextResponse } from 'next/server'
import { appendEvent, isBlockedRequest } from '@/lib/analytics'
import { isTrackingEnabled } from '@/lib/tracking-enabled'
import type { TrackPayload } from '@/lib/types'

const VALID_TYPES = new Set(['pageview', 'whatsapp_click', 'copy_crosspost'])

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

  if (!VALID_TYPES.has(payload.type) || !payload.path) {
    return NextResponse.json({ ok: false, reason: 'invalid' }, { status: 400 })
  }

  try {
    await appendEvent(payload, userAgent ?? '', request.headers.get('referer'))
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, reason: 'storage' }, { status: 503 })
  }
}
