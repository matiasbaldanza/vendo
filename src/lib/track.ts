'use client'

import type { TrackPayload } from './types'

const seenPageviews = new Set<string>()

export function track(payload: TrackPayload) {
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
