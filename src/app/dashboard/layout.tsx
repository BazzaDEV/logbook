import type { Metadata } from 'next'
import '@/app/globals.css'
import Image from 'next/image'
import BazzaDEV from '@/../public/bazzadev.png'
import NavigationBar from '@/components/nav/navigation-bar'
import Link from 'next/link'
import { Copyright } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: 'Logbook',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col h-full w-full p-4">
      <NavigationBar />
      <div className="flex-1 py-8">{children}</div>
      <footer className="flex flex-col items-center">
        <Separator className="mb-4" />
        <div className="inline-flex items-center gap-2">
          <Link href="https://bazza.dev">
            <Image
              src={BazzaDEV}
              alt="bazza.dev"
              className="size-5"
            />
          </Link>
          <span className="text-sm text-muted-foreground inline-flex gap-1 items-center">
            Copyright <Copyright className="size-3" />{' '}
            {new Date().getFullYear()} by{' '}
            <Link
              className="text-primary"
              href="https://bazza.dev"
            >
              bazza.dev
            </Link>
          </span>
        </div>
      </footer>
    </div>
  )
}
