import type { Metadata } from "next";
import "@/app/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NavigationBar from "@/components/navigation-bar";
import { cn } from "@/lib/utils";
import Providers from "@/components/providers";
import { inter } from "@/app/fonts";

export const metadata: Metadata = {
  title: "Dashboard | logbook",
  description: "Ready to make today productive?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <body>
          <div
            vaul-drawer-wrapper=""
            className={cn(
              inter.className,
              "min-h-screen flex flex-col gap-10 p-4 bg-background",
            )}
          >
            <NavigationBar />
            <div className="flex-1">{children}</div>
          </div>
        </body>
      </html>
    </Providers>
  );
}