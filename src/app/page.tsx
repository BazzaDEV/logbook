import { redirect } from 'next/navigation'
import { logout, validateRequest } from '@/lib/auth'

export default async function Page() {
  const { user } = await validateRequest()

  if (!user) {
    return redirect('/login')
  }

  const logoutAction = async () => {
    'use server'
    await logout()
  }

  return (
    <div>
      <h1>Hi, {user.email}!</h1>
      <form action={logoutAction}>
        <button>Sign out</button>
      </form>
    </div>
  )
}
