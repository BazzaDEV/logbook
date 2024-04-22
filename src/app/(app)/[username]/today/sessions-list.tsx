'use client'

import { LocalTime } from '@/components/misc/date-time'
import { cn } from '@/lib/utils'
import { WorkSession } from '@prisma/client'
import { ArrowRight, Trash } from 'lucide-react'
import { HTMLAttributes } from 'react'
import { Badge } from '@/components/ui/badge'
import Editor, { defaultExtensions } from '@/components/editor/editor'
import { Editor as TiptapEditor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { deleteSession } from '@/lib/api/sessions'
import { toast } from 'sonner'

const SessionListItem = ({
  session,
  index,
  ...props
}: {
  session: WorkSession
  index: number
} & HTMLAttributes<HTMLDivElement>) => {
  const { startTime, endTime } = session

  const editor = new TiptapEditor({
    extensions: [...defaultExtensions],
    editable: false,
    ...(session.notes && { content: JSON.parse(session.notes) }),
  })

  async function handleDelete() {
    await deleteSession({ id: session.id })
    toast.success('Session deleted.')
  }

  return (
    <div className="flex flex-col gap-6 py-6 px-8 border border-accent shadow-sm hover:shadow-md transition-shadow rounded-3xl">
      <div className="flex justify-between">
        <div className="inline-flex gap-4 items-center">
          <div className="w-[160px] inline-flex items-center gap-1 text-sm">
            <LocalTime date={startTime} />
            <ArrowRight className="size-4" />
            <LocalTime date={endTime as Date} />
          </div>
          <div className="h-fit">
            <Badge variant="secondary">PROJECT GOES HERE</Badge>
          </div>
          <div className="w-[100px] h-fit">
            <span className="font-medium text-sm">Session {index}</span>
          </div>
        </div>
        <div>
          <Button
            variant="destructive"
            className="p-2 h-fit"
            onClick={handleDelete}
          >
            <Trash className="size-4" />
          </Button>
        </div>
      </div>
      <div className="px-4">
        {editor.getText().length > 0 ? (
          <Editor editor={editor} />
        ) : (
          <span className="text-zinc-400">
            {`You didn't take any notes during this session.`}
          </span>
        )}
      </div>
    </div>
  )
}

interface Props {
  sessions: WorkSession[]
}

export default function SessionsList({ sessions }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {sessions.map((s, i) => (
        <SessionListItem
          key={s.id}
          index={i + 1}
          session={s}
        />
      ))}
    </div>
  )
}
