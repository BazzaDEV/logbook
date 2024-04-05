'use client'

import { createContext, useRef, useContext } from 'react'
import { type StoreApi, useStore } from 'zustand'

import {
  type ActiveSessionStore,
  createActiveSessionStore,
} from '@/lib/stores/active-session-store'

export const ActiveSessionStoreContext =
  createContext<StoreApi<ActiveSessionStore> | null>(null)

export type ActiveSessionStoreProviderProps =
  React.PropsWithChildren<ActiveSessionStore>

export const ActiveSessionStoreProvider = ({
  children,
  ...props
}: ActiveSessionStoreProviderProps) => {
  const storeRef = useRef<StoreApi<ActiveSessionStore>>()

  if (!storeRef.current) {
    storeRef.current = createActiveSessionStore(props)
  }

  return (
    <ActiveSessionStoreContext.Provider value={storeRef.current}>
      {children}
    </ActiveSessionStoreContext.Provider>
  )
}

export const useActiveSessionStore = <T,>(
  selector: (store: ActiveSessionStore) => T,
): T => {
  const activeSessionStoreContext = useContext(ActiveSessionStoreContext)

  if (!activeSessionStoreContext) {
    throw new Error(
      'useActiveSessionStore must be used within ActiveSessionStoreProvider',
    )
  }

  return useStore(activeSessionStoreContext, selector)
}
