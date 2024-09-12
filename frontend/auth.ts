import NextAuth, { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        // logic to verify if the user exists
        const res = await fetch("http://localhost:3002/api/auth/local/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });
        if (res.ok) {
          const result = await res.json();
          return {
            accessToken: result.access_token,
            user: result.user,
          } as User;
        }
        throw new Error("User not found.");
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = (user as any).user;
        token.accessToken = (user as any).accessToken;
        console.log(JSON.stringify(token.user, null, 4));
      }
      if (trigger === "update" && session?.user) {
        token.user = session.user;
      }
      return token;
    },
    session({ session, token }: { session: Session; token: JWT }) {
      session.user = token.user as any;
      session.accessToken = token.accessToken as any;
      return session;
    },
  },
});
