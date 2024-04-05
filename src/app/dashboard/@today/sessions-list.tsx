'use client'

import { cn } from '@/lib/utils'
import { WorkSession } from '@prisma/client'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import { LocalTime } from '@/components/misc/date-time'
import { Editor as TiptapEditor } from '@tiptap/react'
import Editor, { defaultExtensions } from '@/components/editor/editor'
import { useEffect, useState } from 'react'

interface Props {
  sessions: WorkSession[]
}

const NO_SESSION_NOTES_MESSAGE =
  "You didn't take any notes during this session."

const SessionListItem = ({
  session,
  index,
}: {
  session: WorkSession
  index: number
}) => {
  const [editor, setEditor] = useState<TiptapEditor | null>(null)
  const [hasNotes, setHasNotes] = useState<boolean>(false)
  const active = session.endTime === null

  useEffect(() => {
    const newEditor = new TiptapEditor({
      extensions: [...defaultExtensions],
      editable: false,
      content: session?.notes ? JSON.parse(session.notes) : undefined,
    })

    if (newEditor.getText().length > 0) {
      setHasNotes(true)
    }

    setEditor(newEditor)
  }, [session.notes])

  editor

  return (
    <li className="ms-4 space-y-2">
      <div
        className={cn(
          'absolute w-3 h-3 rounded-full -start-1.5 border',
          active ? 'bg-green-500 border-green-500' : 'bg-accent border-border',
        )}
      />
      <div className="mb-1 text-sm leading-none text-slate-400 flex gap-1 items-center">
        <span>
          <LocalTime date={session.startTime} />
        </span>
        <ArrowRight className="size-4 text-slate-500" />
        <span className={cn(active && 'text-green-500')}>
          {session.endTime === null ? (
            'Now'
          ) : (
            <LocalTime date={session.endTime} />
          )}
        </span>
      </div>
      <h3 className="text-lg font-semibold inline-flex items-center gap-2">
        <span>Session {index + 1}</span>
        {active && (
          <Badge className="bg-green-500 hover:bg-green-500/80">Active</Badge>
        )}
      </h3>
      {active ? (
        <div className="flex flex-col"></div>
      ) : hasNotes ? (
        <Editor editor={editor} />
      ) : (
        <p className="text-slate-400">{NO_SESSION_NOTES_MESSAGE}</p>
      )}
    </li>
  )
}

export default function SessionsList({ sessions }: Props) {
  return (
    <ol className="relative border-s border-gray-200 dark:border-gray-700 space-y-10">
      {sessions.map((session, index) => (
        <SessionListItem
          key={session.id}
          session={session}
          index={index}
        />
      ))}
    </ol>
  )
}
