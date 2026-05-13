"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { NavProvider } from "@/context/navContex";

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <NavProvider>
           {children}
      </NavProvider>
   
    </SessionProvider>
  );
}