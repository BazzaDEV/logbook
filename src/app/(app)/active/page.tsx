export const dynamic = 'force-dynamic'

import { getUserOrRedirect } from '@/lib/auth'
import SessionController from '../today/session-controller'
import { getActiveSession } from './actions'

export default async function Page() {
  const user = await getUserOrRedirect()

  const activeSession = await getActiveSession({ id: user.id })

  return (
    <div>
      <SessionController session={activeSession} />
    </div>
  )
}
