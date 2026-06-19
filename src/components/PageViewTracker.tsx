'use client'

import { useEffect } from 'react'
import { track } from '@/lib/track'

export default function PageViewTracker({ path, slug }: { path: string, slug?: string }) {
  useEffect(() => {
    track({ type: 'pageview', path, slug })
  }, [path, slug])

  return null
}
