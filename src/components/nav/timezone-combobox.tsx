'use client'

import * as React from 'react'
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

const timeZones = Intl.supportedValuesOf('timeZone')

export default function TimezoneCombobox() {
  const [open, setOpen] = React.useState(false)
  const config = useConfigStore()

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
          className="w-fit h-0 justify-between"
        >
          {config.tz
            ? timeZones.find((tz) => config.tz === tz)
            : 'Select timezone...'}
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
              {timeZones.map((tz) => (
                <CommandItem
                  key={tz}
                  value={tz}
                  onSelect={(val) => {
                    config.setTimezone(val)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      config.tz === tz ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {tz}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
