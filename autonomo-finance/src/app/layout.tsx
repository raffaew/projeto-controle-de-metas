import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import "./globals.css";

import { Providers } from "@/providers/provider";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth";

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'AutoFinance — Controle financeiro para autônomos',
  description: 'Acompanhe seus ganhos diários e bata suas metas mensais',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session: Session | null = await getServerSession(authOptions);
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
        />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} antialiased bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100`}>
        <Providers session={session}>
        {children}
        </Providers>
      </body>
    </html>
  )
}
