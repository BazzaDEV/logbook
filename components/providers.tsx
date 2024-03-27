"use client";

import { Provider as JotaiProvider } from "jotai";

export default function Providers({
  children,
}: {
  children?: React.ReactNode;
}) {
  return <JotaiProvider>{children}</JotaiProvider>;
}
