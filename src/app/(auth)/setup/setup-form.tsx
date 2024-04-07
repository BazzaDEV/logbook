'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { timezones } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { CommandList } from 'cmdk'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useConfigStore } from '@/lib/stores/config-store'
import { updateUserDetails } from './actions'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  username: z
    .string()
    .min(1, 'You need a username - sorry.')
    .min(4, 'Your username needs to be at least 4 characters.')
    .max(16, 'Your username is too long - maximum 16 characters.')
    .regex(
      new RegExp('^[a-zA-Z0-9-_]+$'),
      'Username must only use letters, numbers, dashes, and underscores.',
    )
    .toLowerCase(),
  timezone: z
    .string()
    .refine(
      (val) => timezones.find((tz) => tz.value === val),
      'This is not a valid timezone.',
    ),
})

export default function SetupForm() {
  const config = useConfigStore()
  const router = useRouter()

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    const data = await updateUserDetails(values)

    if ('error' in data) {
      return form.setError('username', {
        type: 'custom',
        message: 'This username is already taken.',
      })
    }

    config.setTimezone(values.timezone)
    console.log(data)

    router.push(`/${data.username}/today`)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="bazzadev"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your public display name and unique namespace on the
                application.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Timezone</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'inline-flex items-center justify-between',
                        'font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      <span>
                        {field.value
                          ? timezones.find((tz) => tz.value === field.value)
                              ?.name
                          : 'Select timezone'}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[--radix-popover-trigger-width]">
                  <Command>
                    <CommandInput placeholder="Search timezones..." />
                    <CommandList className="w-full">
                      <ScrollArea className="max-h-[300px] overflow-auto">
                        <CommandEmpty>No timezone found.</CommandEmpty>
                        <CommandGroup>
                          {timezones.map((tz) => (
                            <CommandItem
                              value={tz.value}
                              key={tz.value}
                              onSelect={() => {
                                form.setValue('timezone', tz.value)
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  tz.value === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {tz.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </ScrollArea>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This will make sure you see dates and times in your own
                timezone.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
