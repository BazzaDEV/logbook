import { getSessions } from "@/api/sessions";
import Editor from "@/components/editor/editor";
import Session from "@/components/session";
import SessionForm from "@/components/session-form";
import { MakeRequired, getTimeFromDate, isSameDay } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import { WorkSession } from "@prisma/client";

function hasNonNullEndTime(
  session: WorkSession,
): session is WorkSession & { endTime: Date } {
  return session.endTime !== null;
}

export default async function Home() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const workSessions = await getSessions(userId);

  const todaySessions = workSessions.filter((s) =>
    isSameDay(new Date(), s.startTime),
  );

  const todayPastSessions = todaySessions.filter(hasNonNullEndTime);

  const activeSession = todaySessions.filter((s) => !s.endTime).at(0);

  return (
    <div className="max-w-screen-lg m-auto">
      <div className="flex flex-col gap-10">
        <h1 className="text-6xl font-bold tracking-tighter">Today</h1>
        <div className="flex flex-col gap-2">
          {todayPastSessions
            .sort((a, b) => a.startTime.getTime() - b.endTime.getTime())
            .map((session, index) => (
              <Session key={session.id} i={index + 1} session={session} />
            ))}
        </div>
        <SessionForm session={activeSession} />
      </div>
    </div>
  );
}
