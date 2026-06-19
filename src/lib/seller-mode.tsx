'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type ViewMode = 'seller' | 'buyer'

const STORAGE_KEY = 'vendo_view_mode'

type SellerModeContextValue = {
  isSellerAuthenticated: boolean
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  toggleViewMode: () => void
}

const SellerModeContext = createContext<SellerModeContextValue | null>(null)

function readStoredViewMode(): ViewMode {
  if (typeof window === 'undefined') return 'seller'
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'buyer' ? 'buyer' : 'seller'
}

export function SellerModeProvider({ children }: { children: ReactNode }) {
  const [isSellerAuthenticated, setIsSellerAuthenticated] = useState(false)
  const [viewMode, setViewModeState] = useState<ViewMode>('seller')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    fetch('/api/seller/session')
      .then(response => {
        if (cancelled) return
        if (!response.ok) {
          setIsSellerAuthenticated(false)
          setReady(true)
          return
        }
        setIsSellerAuthenticated(true)
        setViewModeState(readStoredViewMode())
        setReady(true)
      })
      .catch(() => {
        if (!cancelled) {
          setIsSellerAuthenticated(false)
          setReady(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode)
    localStorage.setItem(STORAGE_KEY, mode)
  }, [])

  const toggleViewMode = useCallback(() => {
    setViewModeState(current => {
      const next: ViewMode = current === 'seller' ? 'buyer' : 'seller'
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      isSellerAuthenticated: ready && isSellerAuthenticated,
      viewMode,
      setViewMode,
      toggleViewMode,
    }),
    [ready, isSellerAuthenticated, viewMode, setViewMode, toggleViewMode]
  )

  return (
    <SellerModeContext.Provider value={value}>
      {children}
    </SellerModeContext.Provider>
  )
}

export function useSellerMode() {
  const context = useContext(SellerModeContext)
  if (!context) {
    throw new Error('useSellerMode must be used within SellerModeProvider')
  }
  return context
}
