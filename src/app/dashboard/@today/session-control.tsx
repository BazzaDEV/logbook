'use client'

import Editor, { defaultExtensions } from '@/components/editor/editor'
import { Editor as TiptapEditor } from '@tiptap/react'
import { WorkSession, WorkSessionEvent } from '@prisma/client'

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
  session?: WorkSession & { events: WorkSessionEvent[] }
}

export default function SessionControl({ session }: Props) {
  const { elapsedTime, editor, initialize, setEditor } = useActiveSessionStore(
    (state) => state,
  )

  useEffect(() => {
    if (session) {
      initialize(session)
    }
    setEditor(
      new TiptapEditor({
        extensions: [...defaultExtensions],
        onUpdate: ({ editor }) => {
          console.log(editor.getJSON())
        },
      }),
    )
  }, [session, setEditor, initialize])

  return (
    <div className="flex flex-col">
      <div className="bg-zinc-100 p-8 flex flex-col items-center rounded-t-3xl shadow-inner">
        <Stopwatch values={calcStopwatch(elapsedTime)} />
      </div>
      <Controls />
      <Editor editor={editor} />
    </div>
  )
}

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useActiveSessionStore } from '@/lib/stores/active-session-store'
import { useEffect, useState } from 'react'
import {
  createSession,
  endSession,
  pauseSession,
  resumeSession,
} from '@/lib/api/sessions'
import Stopwatch from '@/components/session/stopwatch'

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
      className={cn('grid *:rounded-none rounded-b-xl overflow-hidden', {
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
