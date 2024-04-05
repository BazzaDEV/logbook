import { jetbrainsMono } from '@/lib/fonts'
import { cn } from '@/lib/utils'

export interface StopwatchValue {
  seconds: number
  minutes: number
  hours: number
}

interface Props {
  values: StopwatchValue
}

function formatTime(time: number): string {
  return time < 10 ? `0${time}` : time.toString()
}

const Time = ({ t }: { t: string }) => (
  <span className="text-8xl font-bold tracking-tighter">{t}</span>
)

const Separator = ({
  variant,
}: {
  variant: 'seconds' | 'minutes' | 'hours'
}) => (
  <span className="text-8xl text-zinc-300">
    {variant === 'seconds' ? 's' : variant === 'minutes' ? 'm' : 'h'}
  </span>
)

const Stopwatch = ({ values }: Props) => {
  const ss = formatTime(values.seconds)
  const mm = formatTime(values.minutes)
  const hh = formatTime(values.hours)

  return (
    <div
      className={cn('inline-flex items-center gap-2', jetbrainsMono.className)}
    >
      <div>
        <Time t={hh} />
        <Separator variant="hours" />
      </div>
      <div>
        {' '}
        <Time t={mm} />
        <Separator variant="minutes" />
      </div>
      <div>
        <Time t={ss} />
        <Separator variant="seconds" />
      </div>
    </div>
  )
}

export default Stopwatch
