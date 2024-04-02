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

  const greeting = getGreeting()

  return (
    <div className="max-w-screen-lg m-auto w-full h-full">
      <div className="space-y-4 flex flex-col">
        <h1 className="pb-1.5 bg-gradient-to-r from-fuchsia-600 to-pink-600 inline-block text-transparent bg-clip-text font-bold text-6xl tracking-tighter">
          {greeting}, {user.firstName}
        </h1>
        <h1 className="bg-gradient-to-r from-slate-300 to-slate-200 inline-block text-transparent bg-clip-text text-4xl font-bold tracking-tighter">
          Ready to make today productive?
        </h1>
      </div>
    </div>
  )
}

type Greeting = 'Good morning' | 'Good afternoon' | 'Good evening'

function getGreeting(): Greeting {
  const hour = new Date().getHours() // Get the current hour

  if (hour < 12) {
    return 'Good morning'
  } else if (hour < 18) {
    return 'Good afternoon'
  } else {
    return 'Good evening'
  }
}
