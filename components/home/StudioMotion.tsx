'use client'

import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from 'react'

const MotionContext = createContext({ enabled: false, available: false, toggle: () => {} })

function subscribeMotionPreference(update: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  query.addEventListener('change', update)
  return () => query.removeEventListener('change', update)
}
const getMotionPreference = () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches
const getServerMotionPreference = () => false

export function StudioMotion({ children }: { children: ReactNode }) {
  const available = useSyncExternalStore(subscribeMotionPreference, getMotionPreference, getServerMotionPreference)
  const [paused, setPaused] = useState(false)
  const enabled = available && !paused

  return (
    <MotionContext.Provider value={{ enabled, available, toggle: () => setPaused(value => !value) }}>
      <div className="studio" data-motion={enabled ? 'on' : 'off'}>{children}</div>
    </MotionContext.Provider>
  )
}

export function useStudioMotion() {
  return useContext(MotionContext)
}

export function MotionToggle() {
  const { enabled, available, toggle } = useStudioMotion()
  return (
    <button className="motion-toggle" type="button" onClick={toggle} aria-pressed={!enabled} disabled={!available} title={!available ? 'Motion is paused by your device preference' : undefined}>
      <span className="motion-toggle__mark" aria-hidden="true"><i /><i /><i /></span>
      {enabled ? 'Pause motion' : 'Motion paused'}
    </button>
  )
}
