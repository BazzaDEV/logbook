'use server'

import { getUser } from '@/lib/auth'
import db from '@/lib/db'
import { User } from '@prisma/client'
import { timeZonesNames as tzNames } from '@vvo/tzdb'

type ErrorResult = { error: string | Record<string, string> }

export async function updateUserDetails(
  data: Pick<User, 'username' | 'timezone'>,
): Promise<User | ErrorResult> {
  const user = await getUser()

  if (!user) {
    return {
      error: 'Unauthenticated',
    }
  }

  const existingUser = await db.user.findFirst({
    where: {
      username: data.username,
    },
  })

  if (existingUser) {
    return {
      error: {
        username: 'This username is already taken.',
      },
    }
  }

  if (!tzNames.includes(data.timezone)) {
    return {
      error: {
        timezone: 'This is not a valid timezone.',
      },
    }
  }

  const updatedUser = await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      username: data.username,
      timezone: data.timezone,
      isSetup: true,
    },
  })

  return updatedUser
}
