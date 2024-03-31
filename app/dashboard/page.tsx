import { getSessions } from "@/api/sessions";
import SessionForm from "@/components/session/session-form";
import SessionsList from "@/components/session/sessions-list";
import { getGreeting, isSameDay } from "@/lib/utils";
import { currentUser, redirectToSignIn } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const workSessions = await getSessions(user.id);

  const todaySessions = workSessions
    .filter((s) => isSameDay(new Date(), s.startTime))
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  const activeSession = todaySessions.filter((s) => !s.endTime).at(0);

  const greeting = getGreeting();

  return (
    <div className="max-w-screen-lg m-auto">
      <div className="flex flex-col gap-10">
        <div className="space-y-4">
          <h1 className="pb-1.5 bg-gradient-to-r from-fuchsia-600 to-pink-600 inline-block text-transparent bg-clip-text font-bold text-6xl tracking-tighter">
            {greeting}, {user.firstName}
          </h1>
          <h1 className="bg-gradient-to-r from-slate-300 to-slate-200 inline-block text-transparent bg-clip-text text-4xl font-bold tracking-tighter">
            Ready to make today productive?
          </h1>
        </div>
        {todaySessions.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tighter">Today</h2>
            <SessionsList sessions={todaySessions} />
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
