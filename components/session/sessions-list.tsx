import { getTimeFromDate } from "@/lib/utils";
import { WorkSession } from "@prisma/client";
import Editor from "../editor/editor";

interface PastWorkSession extends WorkSession {
  endTime: Date;
}

interface Props {
  sessions: PastWorkSession[];
}
export default function SessionsList({ sessions }: Props) {
  return (
    <ol className="relative border-s border-gray-200 dark:border-gray-700 space-y-10">
      {sessions.map((session, index) => (
        <li className="ms-4">
          <div className="absolute w-3 h-3 bg-accent rounded-full -start-1.5 border border-border" />
          <div className="mb-1 text-sm leading-none text-slate-400">
            {getTimeFromDate(session.startTime)} -{" "}
            {getTimeFromDate(session.endTime)}
          </div>
          <h3 className="text-lg font-semibold">Session {index + 1}</h3>
          {session.notes ? (
            <Editor initialContent={session.notes} viewOnly />
          ) : (
            <p className="text-slate-400">
              You didn't take any notes during this session.
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
