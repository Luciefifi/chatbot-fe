import { useEffect, useState } from 'react'
import { getHealth } from '../lib/chatApi'

export type HealthState =
  | { status: 'checking' }
  | { status: 'online'; model: string }
  | { status: 'offline' }

// Asks the backend's /health endpoint once, when the component first appears.
export function useHealth(): HealthState {
  const [health, setHealth] = useState<HealthState>({ status: 'checking' })

  useEffect(() => {
    let cancelled = false
    getHealth()
      .then((h) => !cancelled && setHealth({ status: 'online', model: h.model }))
      .catch(() => !cancelled && setHealth({ status: 'offline' }))
    return () => {
      cancelled = true
    }
  }, [])

  return health
}
