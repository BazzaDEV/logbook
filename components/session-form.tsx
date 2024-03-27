"use client";

import { Button } from "@/components/ui/button";
import { WorkSession } from "@prisma/client";

export default function SessionForm({ session }: { session?: WorkSession }) {
  console.log("Active session:", session);

  const active = Boolean(session && !session.endTime);
  console.log("Has active session?", active);

  return (
    <div className="flex flex-col gap-4">
      <Button className="py-10 w-full">Start Session</Button>
    </div>
  );
}
