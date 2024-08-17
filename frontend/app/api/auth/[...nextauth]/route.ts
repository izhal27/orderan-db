import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const res = await fetch("http://localhost:3002/api/auth/local/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const user = await res.json();
        console.log(user);

        if (res.ok && user) {
          console.log(user);
          return user;
        } else {
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token, user }) {
      console.log(JSON.stringify(token, null, 4));

      if (token) {
        session.accessToken = token.accessToken;
      }
      return session;
    },
    async jwt({ session, token, user }) {
      console.log(JSON.stringify(user, null, 4));
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
