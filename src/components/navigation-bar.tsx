import { NotebookPen } from 'lucide-react'
import Image from 'next/image'
import BazzaDEV from '@/../public/bazzadev.png'
import { cn } from '@/lib/utils'
import { jetbrainsMono } from '@/lib/fonts'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { validateRequest } from '@/lib/auth'

export default async function NavigationBar() {
  const { user } = await validateRequest()

  return (
    <header className="flex justify-between items-center">
      <div className="inline-flex gap-2 items-center">
        <Link href="https://bazza.dev">
          <Image
            src={BazzaDEV}
            alt="bazza.dev"
            className="size-7"
          />
        </Link>
        <span className="">/</span>
        <div className="inline-flex gap-1 items-center select-none">
          <NotebookPen className="size-5" />
          <span className={cn('tracking-tight', jetbrainsMono.className)}>
            logbook
          </span>
        </div>
      </div>
      <Avatar>
        {user?.picture && <AvatarImage src={user.picture} />}
        <AvatarFallback>
          {user?.firstName[0].toUpperCase()}
          {user?.lastName[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </header>
  )
}
