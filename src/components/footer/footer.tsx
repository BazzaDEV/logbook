import Link from 'next/link'
import { Copyright } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import BazzaDEV from '@/../public/bazzadev.png'

export default function Footer() {
  return (
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
          Copyright <Copyright className="size-3" /> {new Date().getFullYear()}{' '}
          by{' '}
          <Link
            className="text-primary"
            href="https://bazza.dev"
          >
            bazza.dev
          </Link>
        </span>
      </div>
    </footer>
  )
}
