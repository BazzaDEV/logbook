import type { Metadata } from 'next'
import '@/app/globals.css'
import NavigationBar from '@/components/nav/navigation-bar'
import Footer from '@/components/footer/footer'
import DashboardTabs from '@/components/nav/dashboard-tabs'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Logbook',
  description: 'Generated by create next app',
}

type LayoutProps = Readonly<{
  children: React.ReactNode
}>

export default async function RootLayout({ children }: LayoutProps) {
  const user = await getUser()

  if (!user) {
    return redirect('/login')
  }

  if (!user.isSetup) {
    return redirect('/setup')
  }

  return (
    <div className="flex flex-col min-h-screen w-full p-4">
      <NavigationBar />
      <div className="flex-1 max-w-screen-lg h-full w-full m-auto py-8 flex flex-col gap-10">
        <DashboardTabs />
        {children}
      </div>
      <Footer />
    </div>
  )
}
