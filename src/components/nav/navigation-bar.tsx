import { NotebookPen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { jetbrainsMono } from '@/lib/fonts'
import UserButton from './user-button'

export default function NavigationBar() {
  return (
    <header className="flex justify-between items-center">
      <div className="inline-flex gap-2 items-center">
        <div className="inline-flex gap-1 items-center select-none">
          <NotebookPen className="size-5" />
          <span className={cn('tracking-tight', jetbrainsMono.className)}>
            logbook
          </span>
        </div>
      </div>
      <UserButton />
    </header>
  )
}
