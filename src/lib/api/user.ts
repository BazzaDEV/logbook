'use server'

import { getUser } from '@/lib/auth'

export async function getTimezone() {
  const user = await getUser()

  if (!user) {
    return
  }

  return user.timezone
}
