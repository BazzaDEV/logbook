'use server'

import { getUser } from '@/lib/auth'
import db from '@/lib/db'
import { User } from '@prisma/client'

type ErrorResult = { error: string }

export async function updateUserDetails(
  data: Pick<User, 'username'>,
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
      error: 'This username is already taken.',
    }
  }

  const updatedUser = await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      username: data.username,
      isSetup: true,
    },
  })

  return updatedUser
}
