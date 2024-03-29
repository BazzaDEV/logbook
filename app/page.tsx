import { getSessions } from "@/api/sessions";
import SessionForm from "@/components/session-form";
import { getTimeFromDate, isSameDay } from "@/lib/utils";
import { auth } from "@clerk/nextjs";

export default async function Home() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const workSessions = await getSessions(userId);

  const todaySessions = workSessions.filter((s) =>
    isSameDay(new Date(), s.startTime),
  );

  const todayPastSessions = todaySessions.filter((s) => s.endTime !== null);

  const activeSession = todaySessions.filter((s) => !s.endTime).at(0);

  return (
    <div className="max-w-screen-lg m-auto">
      <div className="flex flex-col gap-10">
        <h1 className="text-6xl font-bold tracking-tighter">Today</h1>
        {todayPastSessions
          .sort((a, b) => a.startTime.getTime() - b.endTime!.getTime())
          .map((session) => (
            <div key={session.id}>
              <div className="inline-flex gap-1">
                <span>{getTimeFromDate(session.startTime)}</span>
                <span>-</span>
                <span>{getTimeFromDate(session.endTime!)}</span>
              </div>
              <div>{JSON.stringify(session.notes)}</div>
            </div>
          ))}
        <SessionForm session={activeSession} />
      </div>
    </div>
  );
}
