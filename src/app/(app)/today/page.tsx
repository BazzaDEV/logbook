import { getUserOrRedirect } from '@/lib/auth'
import { getTodaySessions } from './actions'
import { dist, totalTimePaused } from '@/lib/utils'
import StatisticsPanel from './statistics-panel'
import SessionsList from './sessions-list'
import { headers } from 'next/headers'

export default async function Page() {
  const user = await getUserOrRedirect()

  console.log(headers())

  const sessions = await getTodaySessions({ id: user.id })
  const completedSessions = sessions.filter((s) => s.endTime !== null)

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
      <StatisticsPanel data={statistics} />
      <div>
        <h1 className="text-3xl -ml-0.5 font-semibold tracking-tighter">
          Today&apos;s Sessions
        </h1>
        <p className="mt-2 text-muted-foreground">
          Here&apos;s what you&apos;ve been up to today.
        </p>
        <SessionsList sessions={completedSessions} />
      </div>
    </div>
  )
}
