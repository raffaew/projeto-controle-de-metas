import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createToken } from "@/lib/api";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // 1 — dispara após o Google autenticar
    async signIn({ user }) {
      try {
        const data = await createToken({
          nome:   user.name!,
          email:  user.email!,
          imagem: user.image ?? undefined,
        })

        // guarda para os próximos callbacks
        user.backendToken = data.token
        user.backendId    = data.user.id

        return true
      } catch (e) {
    console.error('Erro no signIn:', e) 
    return false
  }
    },

    // 2 — copia do user para o token (persiste)
    async jwt({ token, user }) {
      if (user) {
        token.backendToken = user.backendToken
        token.backendId    = user.backendId
      }
      return token
    },

    async session({ session, token }) {
      session.backendToken = token.backendToken as string
      session.backendId    = token.backendId    as string
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET!,
}