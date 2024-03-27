import { getSessions } from "@/api/sessions";
import SessionForm from "@/components/session-form";
import { isSameDay } from "@/lib/utils";
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

  const activeSession = todaySessions.filter((s) => !s.endTime).at(0);

  return (
    <div className="max-w-screen-lg m-auto">
      <div className="flex flex-col gap-10">
        <h1 className="text-6xl font-bold tracking-tighter">Today</h1>
        {todaySessions.length === 0 ? (
          <div>You haven't logged any work today.</div>
        ) : (
          <div>{JSON.stringify(todaySessions)}</div>
        )}
        <SessionForm session={activeSession} />
      </div>
    </div>
  );
}
