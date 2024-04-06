import { cn } from '@/lib/utils'
import { NotebookPen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { jetbrainsMono } from '@/lib/fonts'
import Link from 'next/link'
import { validateRequest } from '@/lib/auth'
import { redirect } from 'next/navigation'

const Logbook = () => (
  <span
    className={cn(
      jetbrainsMono.className,
      'tracking-tight',
      'inline-flex gap-1 md:gap-1.5 lg:gap-2 items-center',
    )}
  >
    <NotebookPen className="size-8 sm:size-12 md:size-16 lg:size-20" /> logbook
  </span>
)

const CTA = () => (
  <Link href="/login">
    <Button
      variant="ghost"
      className={cn(
        'text-xl sm:text-3xl md:text-4xl lg:text-5xl transition-shadow bg-gradient-to-r from-fuchsia-600 to-pink-600 text-background hover:text-background hover:underline duration-300 tracking-tight',
        'rounded-full shadow-xl hover:shadow-2xl',
        'inline-flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 h-auto px-4 sm:py-4 sm:px-8',
      )}
    >
      <span>Start using</span>
      <Logbook />
      <span>today.</span>
    </Button>
  </Link>
)

export default async function Page() {
  const { user } = await validateRequest()

  if (user) {
    return redirect('/today')
  }

  return (
    <div className="flex flex-col items-center justify-center gap-16 h-full w-full">
      <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-center">
        Ready to make today
        <br />
        <span className="bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent px-6">
          productive?
        </span>
      </h1>
      <CTA />
    </div>
  )
}
