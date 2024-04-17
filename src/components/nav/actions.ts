'use server'

import { User } from 'lucia'
import { timeZonesNames as tzNames } from '@vvo/tzdb'
import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import db from '@/lib/db'

export async function updateTimezone(data: Pick<User, 'timezone'>) {
  const user = await getUser()

  if (!user) {
    return redirect('/login')
  }

  if (!tzNames.includes(data.timezone)) {
    return {
      error: 'This is not a valid timezone.',
    }
  }

  const updatedUser = await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      timezone: data.timezone,
    },
  })

  return {
    id: updatedUser.id,
    timezone: updatedUser.timezone,
  }
}
