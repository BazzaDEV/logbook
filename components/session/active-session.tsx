"use client";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { activeWorkSessionAtom, editorAtom } from "@/lib/atoms";
import { useCallback, useEffect, useState } from "react";
import Stopwatch, { StopwatchValue } from "./stopwatch";
import Editor from "../editor/editor";
import { endSession, updateSession } from "@/api/sessions";
import { useDebounceCallback } from "usehooks-ts";

export default function ActiveSession() {
  const [activeSession, setActiveSession] = useAtom(activeWorkSessionAtom);
  const [editor] = useAtom(editorAtom);
  const [stopwatch, setStopwatch] = useState<StopwatchValue>({
    seconds: 0,
    minutes: 0,
    hours: 0,
  });

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
      editor?.commands.clearContent();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (activeSession) {
      const interval = setInterval(() => {
        const startTime = activeSession.startTime;

        const diff = new Date().getTime() - startTime.getTime();

        const diffSeconds = diff / 1000;
        const diffMinutes = diffSeconds / 60;
        const diffHours = diffMinutes / 60;

        setStopwatch({
          seconds: Math.floor(diffSeconds % 60),
          minutes: Math.floor(diffMinutes % 60),
          hours: Math.floor(diffHours),
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [activeSession]);

  return (
    <Drawer shouldScaleBackground>
      <DrawerTrigger asChild>
        <Button variant="secondary">Enter Session</Button>
      </DrawerTrigger>
      <DrawerContent className="h-[75vh]">
        <div className="h-full w-full px-4 py-10 gap-10 flex flex-col items-center justify-center">
          <Stopwatch values={stopwatch} />
          <Editor updateSessionNotes={updateSessionNotes} />
          <Button
            size="lg"
            variant="destructive"
            className="w-full max-w-screen-lg"
            onClick={handleEndSession}
          >
            Stop
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
