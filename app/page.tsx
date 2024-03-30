import { ClerkLoading, SignInButton, auth } from "@clerk/nextjs";
import { jetbrainMono } from "./fonts";
import { cn } from "@/lib/utils";
import { NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

const Logbook = () => (
  <span
    className={cn(
      jetbrainMono.className,
      "tracking-tight",
      "inline-flex gap-2 items-center",
    )}
  >
    <NotebookPen className="size-20" /> logbook
  </span>
);

const CTA = () => (
  <Button
    variant="ghost"
    className="rounded-3xl shadow-xl hover:shadow-2xl transition-shadow bg-gradient-to-r from-fuchsia-600 to-pink-600 text-background hover:text-background hover:underline duration-300 text-6xl tracking-tight inline-flex items-center gap-4 h-auto py-4 px-8"
  >
    <span>Start using</span>
    <Logbook />
    <span>today.</span>
  </Button>
);

export default async function Page() {
  const { userId } = auth();

  if (userId) {
    return redirect("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center gap-16 h-full w-full">
      <h1 className="text-8xl font-bold tracking-tighter text-center">
        Ready to make today
        <br />
        <span className="bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent px-6">
          productive?
        </span>
      </h1>
      <ClerkLoading>
        <CTA />
      </ClerkLoading>
      <SignInButton afterSignUpUrl="/dashboard" afterSignInUrl="/dashboard">
        <CTA />
      </SignInButton>
    </div>
  );
}
