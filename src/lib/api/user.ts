'use server'

import { getUser } from '@/lib/auth'
import db from '@/lib/db'

export async function getTimezone() {
  const user = await getUser()

  if (!user) {
    return
  }

  return user.timezone
}
