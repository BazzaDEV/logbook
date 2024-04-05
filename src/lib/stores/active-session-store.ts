import { Editor } from '@tiptap/react'
import { create } from 'zustand'
import { WorkSession, WorkSessionEvent } from '@prisma/client'
import { totalTimePaused } from '../utils'

export type ActiveSessionState = {
  sessionId: string | null
  status: 'NOT_CREATED' | 'ACTIVE' | 'PAUSED' | 'ENDED'
  elapsedTime: number
  timerId: NodeJS.Timeout | null
  sessionNotes: string | null
  editor: Editor | null
}

export type ActiveSessionActions = {
  initialize: (session: WorkSession & { events: WorkSessionEvent[] }) => void
  setSessionId: (id: string) => void
  setEditor: (editor: Editor) => void
  start: () => void
  end: () => void
  pause: () => void
  resume: () => void
}

export type ActiveSessionStore = ActiveSessionState & ActiveSessionActions

export const useActiveSessionStore = create<ActiveSessionStore>((set) => ({
  sessionId: null,
  status: 'NOT_CREATED',
  elapsedTime: 0,
  timerId: null,
  sessionNotes: null,
  editor: null,
  initialize: (session) =>
    set((state) => {
      if (!session) {
        return { ...state }
      }

      if (state.timerId) {
        clearInterval(state.timerId)
      }

      const sessionId = session.id

      const latestEvent = session.events.at(-1) as WorkSessionEvent
      const status: ActiveSessionState['status'] =
        latestEvent.type === 'START' || latestEvent.type === 'RESUME'
          ? 'ACTIVE'
          : 'PAUSED'

      const totalSessionTime =
        (new Date().getTime() - session.startTime.getTime()) / 1000
      const elapsedTime = totalSessionTime - totalTimePaused(session)

      const timerId =
        status === 'ACTIVE'
          ? setInterval(() => {
              set(({ elapsedTime }) => ({ elapsedTime: elapsedTime + 1 }))
            }, 1000)
          : null

      const sessionNotes = session.notes

      return { ...state, sessionId, status, elapsedTime, timerId, sessionNotes }
    }),
  setSessionId: (id) => set({ sessionId: id }),
  setEditor: (newEditor) => set({ editor: newEditor }),
  start: () =>
    set((state) => {
      if (state.timerId) {
        clearInterval(state.timerId)
      }

      const timerId = setInterval(() => {
        set(({ elapsedTime }) => ({ elapsedTime: elapsedTime + 1 }))
      }, 1000)

      return { ...state, status: 'ACTIVE', elapsedTime: 0, timerId }
    }),
  end: () =>
    set((state) => {
      if (state.timerId) clearInterval(state.timerId)
      return { ...state, status: 'ENDED', elapsedTime: 0, timerId: null }
    }),
  pause: () =>
    set((state) => {
      if (state.timerId) clearInterval(state.timerId)
      return { ...state, status: 'PAUSED', timerId: null }
    }),
  resume: () =>
    set((state) => {
      if (state.status === 'PAUSED') {
        const timerId = setInterval(() => {
          set(({ elapsedTime }) => ({ elapsedTime: elapsedTime + 1 }))
        }, 1000)

        return { status: 'ACTIVE', timerId }
      }

      return { ...state }
    }),
}))
