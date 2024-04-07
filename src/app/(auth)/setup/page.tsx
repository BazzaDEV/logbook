import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import SetupForm from './setup-form'

export default async function Page() {
  const user = await getUser()

  if (!user) {
    return redirect('/login')
  }

  if (user.isSetup) {
    return redirect(`/${user.username}/today`)
  }

  return (
    <div className="flex flex-col h-full gap-8 max-w-screen-sm justify-center mx-auto">
      <h1 className="text-4xl font-semibold tracking-tighter">
        We need a few more details.
      </h1>
      <SetupForm />
    </div>
  )
}
