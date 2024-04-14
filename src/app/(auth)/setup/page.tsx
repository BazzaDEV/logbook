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
    <div className="p-4 flex flex-col h-full gap-8 max-w-screen-sm justify-center mx-auto">
      <h1 className="text-4xl font-semibold tracking-tighter flex flex-col gap-2">
        <span className="text-zinc-300">{`You're almost done.`}</span>
        <span>We just need a few more details.</span>
      </h1>
      <SetupForm />
    </div>
  )
}
