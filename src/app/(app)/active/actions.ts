'use server'

import db from '@/lib/db'
import { User } from 'lucia'

export async function getActiveSession({ id }: Pick<User, 'id'>) {
  const data = await db.workSession.findFirst({
    where: {
      userId: id,
      endTime: null,
    },
    include: {
      events: {
        orderBy: {
          time: 'asc',
        },
      },
    },
  })

  return data
}
