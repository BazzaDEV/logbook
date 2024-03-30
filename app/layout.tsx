import type { Metadata } from "next";
import "@/app/globals.css";
import Providers from "@/components/providers";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "logbook",
  description: "Ready to make today productive?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en">
          <body className="h-screen">{children}</body>
        </html>
      </Providers>
    </ClerkProvider>
  );
}
