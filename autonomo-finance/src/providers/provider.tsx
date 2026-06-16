"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { NavProvider } from "@/context/navContex";

const queryClient = new QueryClient();

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <NavProvider>{children}</NavProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
