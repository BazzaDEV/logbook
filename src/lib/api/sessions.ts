'use server'

import 'server-only'
import { WorkSession, WorkSessionEvent } from '@prisma/client'
import db from '@/lib/db'
import { generateId } from 'lucia'
import { getUser } from '@/lib/auth'

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

  return newSession
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

  return updatedSession
}
