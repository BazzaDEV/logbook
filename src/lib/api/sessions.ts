'use server'

import { WorkSession, WorkSessionEvent } from '@prisma/client'
import db from '@/lib/db'
import { generateId } from 'lucia'
import { getUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { fromZonedTime, toZonedTime } from 'date-fns-tz'
import { add, set } from 'date-fns'

export async function getSessionsFromToday() {
  const user = await getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { id: userId, timezone } = user

  const serverNow = new Date()

  const userNow = toZonedTime(serverNow, timezone)

  const userMidnight = set(userNow, { hours: 0, minutes: 0, seconds: 0 })
  const userNextMidnight = add(userMidnight, { hours: 24 })

  const userMidnightUTC = fromZonedTime(userMidnight, timezone)
  const userNextMidnightUTC = fromZonedTime(userNextMidnight, timezone)

  const filteredSessions = await db.workSession.findMany({
    where: {
      userId,
      startTime: {
        gte: userMidnightUTC,
        lt: userNextMidnightUTC,
      },
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

  console.log(filteredSessions)

  return filteredSessions
}

export async function createSession(
  data: Pick<WorkSession, 'startTime' | 'notes'>,
) {
  const user = await getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const newSession = await db.workSession.create({
    data: {
      ...data,
      id: generateId(15),
      userId: user.id,
    },
  })

  await db.workSessionEvent.create({
    data: {
      id: generateId(15),
      sessionId: newSession.id,
      type: 'START',
    },
  })

  revalidatePath(`/${user.username}/today`)

  return newSession
}

export async function updateSessionNotes(
  data: Pick<WorkSession, 'id' | 'notes'>,
) {
  const user = await getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const updatedSession = await db.workSession.update({
    where: {
      id: data.id,
    },
    data: {
      ...data,
    },
  })

  return updatedSession
}

export async function pauseSession(
  data: Pick<WorkSessionEvent, 'time' | 'sessionId'>,
) {
  const user = await getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  await db.workSessionEvent.create({
    data: {
      id: generateId(15),
      sessionId: data.sessionId,
      type: 'PAUSE',
    },
  })
}

export async function resumeSession(
  data: Pick<WorkSessionEvent, 'time' | 'sessionId'>,
) {
  const user = await getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  await db.workSessionEvent.create({
    data: {
      id: generateId(15),
      sessionId: data.sessionId,
      type: 'RESUME',
    },
  })
}

export async function endSession(
  data: Pick<WorkSession, 'id' | 'endTime' | 'notes'>,
) {
  const user = await getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const updatedSession = await db.workSession.update({
    where: {
      id: data.id,
    },
    data: {
      ...data,
      userId: user.id,
    },
  })

  await db.workSessionEvent.create({
    data: {
      id: generateId(15),
      sessionId: updatedSession.id,
      type: 'END',
    },
  })

  revalidatePath(`/${user.username}/today`)

  return updatedSession
}

export async function deleteSession(data: Pick<WorkSession, 'id'>) {
  const user = await getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const deletedSession = await db.workSession.delete({
    where: {
      id: data.id,
      userId: user.id,
    },
  })

  revalidatePath(`/${user.username}/today`)

  return deletedSession
}
