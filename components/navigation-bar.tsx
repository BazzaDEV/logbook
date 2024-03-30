import { UserButton } from "@clerk/nextjs";
import { ChevronRight, NotebookPen } from "lucide-react";
import Image from "next/image";
import BazzaDEV from "@/public/bazzadev.png";
import { cn } from "@/lib/utils";
import { jetbrainMono } from "@/app/fonts";
import Link from "next/link";

export default function NavigationBar() {
  return (
    <header className="flex justify-between items-center min-h-8">
      <div className="inline-flex gap-2 items-center">
        <Link href="https://bazza.dev">
          <Image src={BazzaDEV} alt="bazza.dev" className="size-7" />
        </Link>
        <span className="">/</span>
        <div className="inline-flex gap-1 items-center select-none">
          <NotebookPen className="size-5" />
          <span className={cn("tracking-tight", jetbrainMono.className)}>
            logbook
          </span>
        </div>
      </div>
      <UserButton afterSignOutUrl="/" />
    </header>
  );
}
