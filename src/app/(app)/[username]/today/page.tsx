import { getUserOrRedirect } from '@/lib/auth'
import { dist, totalTimePaused } from '@/lib/utils'
import StatisticsPanel from './statistics-panel'
import SessionsList from './sessions-list'
import { getSessionsFromToday } from '@/lib/api/sessions'

export default async function Page() {
  await getUserOrRedirect()

  const sessions = await getSessionsFromToday()
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
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl -ml-0.5 font-semibold tracking-tighter">
            Today&apos;s Sessions
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what you&apos;ve been up to today.
          </p>
        </div>
        <SessionsList sessions={completedSessions} />
      </div>
    </div>
  )
}
