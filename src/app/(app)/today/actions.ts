'use server'

import db from '@/lib/db'
import { User } from 'lucia'

export async function getTodaySessions({ id }: Pick<User, 'id'>) {
  const data = await db.workSession.findMany({
    where: {
      userId: id,
    },
    include: {
      events: {
        orderBy: {
          time: 'asc',
        },
      },
    },
    orderBy: {
      startTime: 'asc',
    },
  })

  return data
}
