"use client"

interface Props {

}

export default function SessionControl() {
  const [stopwatch, setStopwatch] = useState<StopwatchValue>({ seconds: 0, minutes: 0, hours: 0 })
  return <div className="flex flex-col">
    <div className="bg-zinc-100 p-8 flex flex-col items-center rounded-3xl shadow-inner">
      <Stopwatch values={stopwatch} />
    </div>
    <Controls />
  </div>
}

import { Button } from "@/components/ui/button";
//************ Stopwatch *************//

import { jetbrainsMono } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface StopwatchValue {
  seconds: number;
  minutes: number;
  hours: number;
}

interface Props {
  values: StopwatchValue;
}

function formatTime(time: number): string {
  return time < 10 ? `0${time}` : time.toString();
}

const Time = ({ t }: { t: string }) => (
  <span className="text-8xl font-bold tracking-tighter">{t}</span>
);

const Separator = ({
  variant,
}: {
  variant: "seconds" | "minutes" | "hours";
}) => (
  <span className="text-8xl text-zinc-300">
    {variant === "seconds" ? "s" : variant === "minutes" ? "m" : "h"}
  </span>
);

const Stopwatch = ({ values }: Props) => {
  const ss = formatTime(values.seconds);
  const mm = formatTime(values.minutes);
  const hh = formatTime(values.hours);

  return (
    <div
      className={cn("inline-flex items-center gap-2", jetbrainsMono.className)}
    >
      <div>
        <Time t={hh} />
        <Separator variant="hours" />
      </div>
      <div>
        {" "}
        <Time t={mm} />
        <Separator variant="minutes" />
      </div>
      <div>
        <Time t={ss} />
        <Separator variant="seconds" />
      </div>
    </div>
  );
}

//********* Controls ***********//

const Controls = () => {
  return <div>
    <Button>Start</Button>
    <Button>Stop</Button>
  </div>
}
