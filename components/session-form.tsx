"use client";

import { Button } from "@/components/ui/button";
import { WorkSession } from "@prisma/client";
import { endSession, startSession, updateSession } from "@/api/sessions";
import { useCallback, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useAtom } from "jotai";
import { activeWorkSessionAtom, editorAtom } from "@/lib/atoms";
import { useDebounceCallback } from "usehooks-ts";
import { getTimeFromDate } from "@/lib/utils";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("./editor"), { ssr: false });

export default function SessionForm({ session }: { session?: WorkSession }) {
  const [editor] = useAtom(editorAtom);
  const [activeSession, setActiveSession] = useAtom(activeWorkSessionAtom);
  const { userId } = useAuth();

  if (!userId) {
    return null;
  }

  const _updateSessionNotes = useCallback(
    async (notes: string) => {
      if (!activeSession) {
        console.log("No active session to update.");
        return;
      }

      const newWorkSession = await updateSession({
        id: activeSession!.id,
        notes,
      });

      console.log("Synced notes to database.");
      console.log(newWorkSession.notes);
    },
    [activeSession],
  );

  const updateSessionNotes = useDebounceCallback(_updateSessionNotes, 3000);

  async function handleStartSession() {
    console.log("Starting session...");

    const notesJson = JSON.stringify(editor?.getJSON());
    console.log("userId:", userId);

    try {
      const session = await startSession({
        userId: userId!,
        notes: notesJson,
      });

      setActiveSession(session);

      console.log(session);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleEndSession() {
    if (!activeSession) {
      console.log("No active session to end.");
      return;
    }

    console.log("Ending session...");

    try {
      const notes = JSON.stringify(editor?.getJSON());
      await _updateSessionNotes(notes);
      await endSession({
        id: activeSession!.id,
      });

      setActiveSession(undefined);

      console.log(session);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setActiveSession(session);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {activeSession && (
        <div className="inline-flex gap-1">
          <span>{getTimeFromDate(activeSession?.startTime)}</span>
          <span>-</span>
          <span>
            {activeSession?.endTime
              ? getTimeFromDate(activeSession.endTime)
              : "Now"}
          </span>
        </div>
      )}
      <Editor updateSessionNotes={updateSessionNotes} />
      {!activeSession && (
        <Button className="py-10 w-full" onClick={handleStartSession}>
          Start Session
        </Button>
      )}
      {activeSession && (
        <Button
          className="py-10 w-full"
          variant="destructive"
          onClick={handleEndSession}
        >
          End Session
        </Button>
      )}
    </div>
  );
}
