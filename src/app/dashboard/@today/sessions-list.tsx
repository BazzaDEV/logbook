import { WorkSession } from '@prisma/client'

interface Props {
  sessions: WorkSession[]
}

export default function SessionsList({ sessions }: Props) {
  return <div>
    {JSON.stringify(sessions, null, 2)}
  </div>

}
