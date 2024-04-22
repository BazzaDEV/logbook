'use client'

import { LocalTime } from '@/components/misc/date-time'
import { WorkSession } from '@prisma/client'
import { ArrowRight, Trash } from 'lucide-react'
import { HTMLAttributes, forwardRef } from 'react'
import { Badge } from '@/components/ui/badge'
import Editor, { defaultExtensions } from '@/components/editor/editor'
import { Editor as TiptapEditor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { deleteSession } from '@/lib/api/sessions'
import { toast } from 'sonner'
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion'

type SessionListItemProps = {
  session: WorkSession
  index: number
} & HTMLAttributes<HTMLDivElement>

const SessionListItem = forwardRef<
  HTMLDivElement,
  SessionListItemProps & HTMLMotionProps<'div'>
>(({ session, index }, ref) => {
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
    <motion.div
      ref={ref}
      layout
      initial={{ scale: 0.8, opacity: 0, filter: 'blur(4px)' }}
      animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
      exit={{
        scale: 0.8,
        opacity: 0,
        filter: 'blur(4px)',
        transition: { duration: 0.15 },
      }}
      transition={{ type: 'spring', bounce: 0.3 }}
      className="flex flex-col gap-6 py-6 px-8 border border-accent shadow-sm hover:shadow-md transition-shadow rounded-3xl"
    >
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
    </motion.div>
  )
})

SessionListItem.displayName = 'SessionListItem'

interface Props {
  sessions: WorkSession[]
}

export default function SessionsList({ sessions }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence
        mode="popLayout"
        initial={false}
      >
        {sessions.map((s, i) => (
          <SessionListItem
            key={s.id}
            index={i + 1}
            session={s}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
