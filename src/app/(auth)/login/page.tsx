import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { validateRequest } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { KeySquare, NotebookPen } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Page() {
  const { user } = await validateRequest()

  if (user) {
    return redirect('/dashboard')
  }

  return (
    <div
      className={cn(
        'bg-gradient-to-tr from-fuchsia-600 to-pink-600',
        'flex flex-col h-full',
        'lg:grid lg:grid-cols-2',
      )}
    >
      <div className="lg:bg-background/90 lg:backdrop-blur lg:rounded-r-3xl h-full flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-10 p-10">
          <Alert className="max-w-lg">
            <KeySquare className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              We only support authenticating via Google at the moment.
            </AlertDescription>
          </Alert>

          <Card className="w-full max-w-lg py-10 rounded-3xl">
            <CardHeader className="items-center">
              <div className="pb-8">
                <NotebookPen className="size-14" />
              </div>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>Please enter your credentials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-10">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Email address</Label>
                  <Input disabled />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input disabled />
                </div>
                <Button
                  disabled
                  className="w-full"
                >
                  Sign In
                </Button>
              </div>
              <Separator />
              <Link href="/login/google">
                <Button className="w-full shadow-md">Login with Google</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="lg:hidden"></div>
    </div>
  )
}
