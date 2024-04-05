export const dynamic = 'force-dynamic'

import { validateRequest } from '@/lib/auth'
import { getTodaySessions } from './actions'
import SessionsList from './sessions-list'
import SessionControl from './session-control'
import head from 'lodash.head'
import SessionStatistics from './session-statistics'
import { dist, totalTimePaused } from '@/lib/utils'

export default async function Slot() {
  const { user } = await validateRequest()

  if (!user) {
    return <div>Error: Unauthenticated</div>
  }

  const sessions = await getTodaySessions({ id: user.id })
  const completedSessions = sessions.filter((s) => s.endTime !== null)

  const activeSession = head(sessions.filter((s) => s.endTime === null))

  const statistics = {
    today: {
      totalTime: completedSessions.reduce(
        (acc, curr) =>
          acc + dist(curr.endTime as Date, curr.startTime, { unit: 'ms' }),
        0,
      ),
      sessionsLogged: completedSessions.length,
      timeDistracted: completedSessions.reduce(
        (acc, curr) => acc + totalTimePaused(curr) * 1000,
        0,
      ),
    },
  }

  return (
    <div className="flex flex-col gap-8">
      <SessionStatistics data={statistics} />
      <SessionControl session={activeSession} />
      <SessionsList sessions={sessions} />
    </div>
  )
}
