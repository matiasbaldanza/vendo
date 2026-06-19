'use client'

import type { TrackPayload } from './types'
import { isTrackingEnabled } from './tracking-enabled'

const seenPageviews = new Set<string>()

export function track(payload: TrackPayload) {
  if (!isTrackingEnabled()) return

  if (payload.type === 'pageview') {
    const key = `${payload.path}:${payload.slug ?? ''}`
    if (seenPageviews.has(key)) return
    seenPageviews.add(key)
  }

  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {})
}
