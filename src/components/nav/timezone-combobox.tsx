'use client'

import { useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useConfigStore } from '@/lib/stores/config-store'
import { timezones } from '@/lib/constants'
import { updateTimezone } from './actions'
import { toast } from 'sonner'

export default function TimezoneCombobox() {
  const [open, setOpen] = useState(false)
  const config = useConfigStore()

  async function onTimezoneSelect(val: string) {
    const res = await updateTimezone({ timezone: val })

    if ('error' in res) {
      return toast.error('Timezone has not been updated.', {
        description: res.error,
      })
    }

    config.setTimezone(res.timezone)
    setOpen(false)

    toast.success('Timezone has been updated.', {
      description: `Your new timezone is ${timezones.find((tz) => tz.value === res.timezone)?.name}.`,
    })
  }

  useEffect(() => {
    // Only run this when the component first loads
    console.log('Loading tz from database...')
    config.fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-fit h-0 justify-between text-xs"
        >
          <span>
            {config.tz
              ? timezones.find((tz) => config.tz === tz.value)?.name
              : 'Select timezone...'}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-fit p-0"
        align="end"
      >
        <Command>
          <CommandInput placeholder="Search timezones..." />
          <CommandList>
            <CommandEmpty>No timezones found.</CommandEmpty>
            <CommandGroup>
              {timezones.map((tz) => (
                <CommandItem
                  key={tz.value}
                  value={tz.value}
                  onSelect={onTimezoneSelect}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      config.tz === tz.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {tz.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
