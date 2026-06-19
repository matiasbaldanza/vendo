export function isTrackingEnabled() {
  return process.env.NEXT_PUBLIC_TRACKING_DISABLED !== 'true'
}
