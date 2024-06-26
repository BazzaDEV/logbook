export const dynamic = 'force-dynamic'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { logout, validateRequest } from '@/lib/auth'
import { Globe, LogOut } from 'lucide-react'
import TimezoneCombobox from './timezone-combobox'
import { cn } from '@/lib/utils'

export default async function UserButton() {
  const { user } = await validateRequest()

  const logoutAction = async () => {
    'use server'
    await logout()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          {user?.picture && <AvatarImage src={user.picture} />}
          <AvatarFallback>
            {user?.firstName[0].toUpperCase()}
            {user?.lastName[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="rounded-xl"
        align="end"
      >
        <DropdownMenuLabel className="flex gap-4 items-center px-4">
          <Avatar className="size-6 shadow-md">
            {user?.picture && <AvatarImage src={user.picture} />}
            <AvatarFallback>
              {user?.firstName[0].toUpperCase()}
              {user?.lastName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col w-full gap-1">
            <div>
              {user?.firstName} {user?.lastName}
            </div>
            <div className="font-normal text-muted-foreground">
              {user?.email}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div
          className={cn(
            'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            'inline-flex w-full gap-4 rounded-lg py-2',
          )}
        >
          <div className="inline-flex items-center gap-1.5">
            <Globe className="size-4" />
            <span>Timezone</span>
          </div>
          <TimezoneCombobox />
        </div>
        <DropdownMenuSeparator />
        <form action={logoutAction}>
          <DropdownMenuItem
            asChild
            className="inline-flex w-full gap-1.5 rounded-lg py-2 text-destructive focus:text-destructive focus:bg-destructive/5"
          >
            <button>
              <LogOut className="size-4" />
              <span>Sign Out</span>
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
