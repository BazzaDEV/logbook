import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ConfigState = {
  tz: string
}

export type ConfigActions = {
  setTimezone: (tz: string) => void
}

export type ConfigStore = ConfigState & ConfigActions

export const useConfigStore = create(
  persist<ConfigStore>(
    (set, get) => ({
      tz: 'America/New_York',
      setTimezone: (newTz: string) => set({ tz: newTz }),
    }),
    {
      name: 'logbook-config-storage',
    },
  ),
)
