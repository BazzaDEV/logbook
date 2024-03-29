import { getSessions } from "@/api/sessions";
import SessionForm from "@/components/session-form";
import SessionsList from "@/components/session/sessions-list";
import { isSameDay } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { WorkSession } from "@prisma/client";

function hasNonNullEndTime(
  session: WorkSession,
): session is WorkSession & { endTime: Date } {
  return session.endTime !== null;
}

export default async function Home() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const workSessions = await getSessions(user.id);

  const todaySessions = workSessions.filter((s) =>
    isSameDay(new Date(), s.startTime),
  );

  const todayPastSessions = todaySessions.filter(hasNonNullEndTime);

  const activeSession = todaySessions.filter((s) => !s.endTime).at(0);

  return (
    <div className="max-w-screen-lg m-auto">
      <div className="flex flex-col gap-10">
        <div className="space-y-4">
          <h1 className="bg-gradient-to-r from-fuchsia-600 to-pink-600 inline-block text-transparent bg-clip-text font-bold text-6xl tracking-tighter">
            Good afternoon, {user.firstName}
          </h1>
          <h1 className="bg-gradient-to-r from-slate-300 to-slate-200 inline-block text-transparent bg-clip-text text-4xl font-bold tracking-tighter">
            Ready to make today productive?
          </h1>
        </div>
        {todayPastSessions.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tighter">Today</h2>
            <SessionsList sessions={todayPastSessions} />
          </div>
        ) : (
          <p className="text-xl font-medium text-muted-foreground tracking-tighter">
            No sessions logged today.{" "}
            <span className="text-primary">
              What will your first achievement be?
            </span>
          </p>
        )}
        <SessionForm session={activeSession} />
      </div>
    </div>
  );
}

// {todayPastSessions
//   .sort((a, b) => a.startTime.getTime() - b.endTime.getTime())
//   .map((session, index) => (
//     <Session key={session.id} i={index + 1} session={session} />
//   ))}
