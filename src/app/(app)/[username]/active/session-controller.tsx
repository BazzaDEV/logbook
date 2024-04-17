'use client'

import Editor, { defaultExtensions } from '@/components/editor/editor'
import { JSONContent, Editor as TiptapEditor } from '@tiptap/react'
import { WorkSession, WorkSessionEvent } from '@prisma/client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useActiveSessionStore } from '@/lib/stores/active-session-store'
import { useCallback, useEffect, useState } from 'react'
import {
  createSession,
  endSession,
  pauseSession,
  resumeSession,
  updateSessionNotes,
} from '@/lib/api/sessions'
import Stopwatch from '@/components/session/stopwatch'
import { useDebounceCallback } from '@/lib/hooks/use-debounce'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

function calcStopwatch(elapsedSeconds: number) {
  const elapsedMins = elapsedSeconds / 60
  const elapsedHrs = elapsedMins / 60

  return {
    seconds: Math.floor(elapsedSeconds % 60),
    minutes: Math.floor(elapsedMins % 60),
    hours: Math.floor(elapsedHrs),
  }
}

interface Props {
  session: (WorkSession & { events: WorkSessionEvent[] }) | null
}

export default function SessionController({ session }: Props) {
  const store = useActiveSessionStore((state) => state)
  const { elapsedTime, sessionId, editor, initialize, setEditor } = store

  const _updateNotes = useCallback(
    async (json: JSONContent) => {
      console.log('Updating notes in DB')
      const notes = JSON.stringify(json)
      await updateSessionNotes({ id: sessionId as string, notes })
    },
    [sessionId],
  )

  const updateNotes = useDebounceCallback(_updateNotes, 3000)

  useEffect(() => {
    if (session && sessionId === null) {
      console.log('initializing session from props')
      console.log('FROM DB:', session)
      initialize(session)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    console.log(store)
    console.log('useeffect main')
    console.log('setting editor')
    setEditor(
      new TiptapEditor({
        extensions: [...defaultExtensions],
        ...(session?.notes && { content: JSON.parse(session.notes) }),
        content: editor?.getJSON(),
        onUpdate: ({ editor }) => {
          if (sessionId) {
            updateNotes(editor.getJSON())
          }
        },
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.notes, sessionId, updateNotes, setEditor, initialize])

  return (
    <div className="flex flex-col space-y-4">
      <div className="bg-zinc-100 p-8 flex flex-col items-center rounded-3xl shadow-inner">
        <Stopwatch values={calcStopwatch(elapsedTime)} />
      </div>
      <Controls />
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Session Notes</CardTitle>
          <CardDescription>
            Write about what you are working on this session.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          <Editor editor={editor} />
        </CardContent>
      </Card>
    </div>
  )
}

//********* Controls ***********//

const Controls = () => {
  const { status, sessionId, setSessionId, editor, start, end, pause, resume } =
    useActiveSessionStore((state) => state)

  const [loading, setLoading] = useState<boolean>(false)

  async function handleStart() {
    // Set loading state
    setLoading(true)

    try {
      // Create new session in database
      const session = await createSession({
        startTime: new Date(),
        notes: JSON.stringify(editor?.getJSON()),
      })

      // Set session ID in state
      setSessionId(session.id)

      console.log(session)
    } catch (error) {
      console.log(error)
    }

    // Done loading
    setLoading(false)

    // Start session locally
    start()
  }

  async function handlePause() {
    // Set loading state
    setLoading(true)

    try {
      // Create pause event in database
      await pauseSession({ sessionId: sessionId as string, time: new Date() })
    } catch (error) {
      console.log(error)
    }

    // Done loading
    setLoading(false)

    // Pause timer
    pause()
  }

  async function handleResume() {
    // Set loading state
    setLoading(true)

    try {
      // Create resume event in database
      await resumeSession({ sessionId: sessionId as string, time: new Date() })
    } catch (error) {
      console.log(error)
    }

    // Done loading
    setLoading(false)

    // Resume timer
    resume()
  }

  async function handleEnd() {
    // Set loading state
    setLoading(true)

    try {
      // Save session (end time, notes) in database
      await endSession({
        id: sessionId as string,
        endTime: new Date(),
        notes: JSON.stringify(editor?.getJSON()),
      })
    } catch (error) {
      console.log(error)
    }

    // Done loading
    setLoading(false)

    // End session locally
    end()
  }

  return (
    <div
      className={cn('grid *:rounded-none rounded-xl overflow-hidden', {
        'grid-cols-2': status === 'PAUSED',
        'grid-cols-1': status !== 'PAUSED',
      })}
    >
      {(status === 'NOT_CREATED' || status === 'ENDED') && (
        <Button
          className="w-full h-16"
          onClick={handleStart}
          disabled={loading}
        >
          Start
        </Button>
      )}
      {status === 'ACTIVE' && (
        <Button
          className="w-full h-16"
          onClick={handlePause}
          disabled={loading}
        >
          Pause
        </Button>
      )}
      {status === 'PAUSED' && (
        <>
          <Button
            className="w-full h-16"
            onClick={handleResume}
            disabled={loading}
          >
            Resume
          </Button>
          <Button
            variant="destructive"
            className="w-full h-16"
            onClick={handleEnd}
            disabled={loading}
          >
            End
          </Button>
        </>
      )}
    </div>
  )
}
