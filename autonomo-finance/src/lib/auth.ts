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

    async signIn({ user }) {
      try {

        const data = await createToken({
          nome:   user.name!,
          email:  user.email!,
          imagem: user.image ?? undefined,
        })

        user.backendToken = data.token
        user.userId    = data.user.id

        return true
      } catch (e) {
    console.error('Erro no signIn:', e) 
    return false
  }
    },


    async jwt({ token, user }) {
      if (user) {
        token.backendToken = user.backendToken
      }
      return token
    },

    async session({ session, token }) {
      session.backendToken = token.backendToken as string
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET!,
}