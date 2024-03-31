"use client";

import { Suspense } from "react";
import { useHydration } from "@/lib/hooks/useHydration";
import { getTimeFromDate } from "@/lib/utils";

export function LocalTime({ date }: { date: Date | string | number }) {
  const hydrated = useHydration();
  return (
    <Suspense key={hydrated ? "local" : "utc"}>
      <time dateTime={new Date(date).toISOString()}>
        {getTimeFromDate(new Date(date))}
        {hydrated ? "" : " (UTC)"}
      </time>
    </Suspense>
  );
}
