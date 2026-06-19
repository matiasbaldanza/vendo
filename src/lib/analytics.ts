import { isbot } from 'isbot'
import { kv } from '@vercel/kv'
import type { AnalyticsEvent, DeviceType, TrackPayload } from './types'

const EVENTS_KEY = 'vendo:events'
const MAX_EVENTS = 5000
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000

const LLM_CRAWLER_PATTERNS = [
  /GPTBot/i,
  /ClaudeBot/i,
  /anthropic-ai/i,
  /Google-Extended/i,
  /CCBot/i,
  /Bytespider/i,
  /ChatGPT-User/i,
  /PerplexityBot/i,
]

export function isBlockedRequest(userAgent: string | null, secPurpose: string | null): boolean {
  if (secPurpose === 'prefetch') return true
  if (!userAgent || userAgent.length < 10) return true
  if (isbot(userAgent)) return true
  return LLM_CRAWLER_PATTERNS.some(pattern => pattern.test(userAgent))
}

export function parseDevice(userAgent: string): DeviceType {
  const ua = userAgent.toLowerCase()
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(userAgent)) return 'tablet'
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile'
  return 'desktop'
}

function truncateReferrer(referrer: string | null): string | undefined {
  if (!referrer) return undefined
  return referrer.slice(0, 200)
}

export async function appendEvent(
  payload: TrackPayload,
  userAgent: string,
  referrer: string | null
): Promise<void> {
  const event: AnalyticsEvent = {
    ts: new Date().toISOString(),
    type: payload.type,
    path: payload.path,
    slug: payload.slug,
    device: parseDevice(userAgent),
    referrer: truncateReferrer(referrer),
    platform: payload.platform,
  }

  await kv.lpush(EVENTS_KEY, JSON.stringify(event))
  await trimEvents()
}

async function trimEvents(): Promise<void> {
  const cutoff = Date.now() - MAX_AGE_MS

  const raw = await kv.lrange(EVENTS_KEY, 0, MAX_EVENTS * 2)
  if (!raw || raw.length === 0) return

  const events: AnalyticsEvent[] = raw
    .map(item => {
      try {
        return typeof item === 'string' ? JSON.parse(item) : item
      } catch {
        return null
      }
    })
    .filter((e): e is AnalyticsEvent => e !== null)

  const filtered = events.filter(e => new Date(e.ts).getTime() >= cutoff).slice(0, MAX_EVENTS)

  if (filtered.length === events.length && events.length <= MAX_EVENTS) return

  await kv.del(EVENTS_KEY)
  if (filtered.length > 0) {
    await kv.rpush(EVENTS_KEY, ...filtered.map(e => JSON.stringify(e)))
  }
}

export async function getEvents(): Promise<AnalyticsEvent[]> {
  try {
    const raw = await kv.lrange(EVENTS_KEY, 0, MAX_EVENTS - 1)
    if (!raw) return []
    return raw
      .map(item => {
        try {
          return typeof item === 'string' ? JSON.parse(item) : item
        } catch {
          return null
        }
      })
      .filter((e): e is AnalyticsEvent => e !== null)
  } catch {
    return []
  }
}

export type StatsAggregates = {
  totalEvents: number
  byDay: Record<string, number>
  byType: Record<string, number>
  byDevice: Record<string, number>
  whatsappClicks: number
  copyCrosspost: Record<string, number>
  recent: AnalyticsEvent[]
}

export function aggregateEvents(events: AnalyticsEvent[]): StatsAggregates {
  const byDay: Record<string, number> = {}
  const byType: Record<string, number> = {}
  const byDevice: Record<string, number> = {}
  const copyCrosspost: Record<string, number> = {}
  let whatsappClicks = 0

  for (const event of events) {
    const day = event.ts.slice(0, 10)
    byDay[day] = (byDay[day] ?? 0) + 1
    byType[event.type] = (byType[event.type] ?? 0) + 1
    byDevice[event.device] = (byDevice[event.device] ?? 0) + 1

    if (event.type === 'whatsapp_click') whatsappClicks++
    if (event.type === 'copy_crosspost' && event.platform) {
      copyCrosspost[event.platform] = (copyCrosspost[event.platform] ?? 0) + 1
    }
  }

  return {
    totalEvents: events.length,
    byDay,
    byType,
    byDevice,
    whatsappClicks,
    copyCrosspost,
    recent: events.slice(0, 50),
  }
}
