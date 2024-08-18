import NextAuth, { DefaultSession, User } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {

        // logic to verify if the user exists
        const res = await fetch('http://localhost:3002/api/auth/local/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials)
        });
        const result = await res.json();
        return {
          accessToken: result.access_token,
          user: result.user,
        } as User;
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin'
  },
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user.user;
        token.accessToken = user.accessToken;
      }
      return token
    },
    session({ session, token, user }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      return session;
    },
  },
})