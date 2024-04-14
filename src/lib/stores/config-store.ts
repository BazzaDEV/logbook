import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getTimezone } from '@/lib/api/user'

export type ConfigState = {
  tz: string
}

export type ConfigActions = {
  setTimezone: (tz: string) => void
  fetch: () => Promise<void>
}

export type ConfigStore = ConfigState & ConfigActions

export const useConfigStore = create(
  persist<ConfigStore>(
    (set, get) => ({
      tz: 'America/New_York',
      setTimezone: (newTz: string) => set({ tz: newTz }),
      fetch: async () => set({ tz: await getTimezone() }),
    }),
    {
      name: 'logbook-config-storage',
    },
  ),
)
