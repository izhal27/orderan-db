import NextAuth, { CustomJWT, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

const baseUrl = process.env.AUTH_API_URL || "http://localhost:3002/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        const url = `${baseUrl}/auth/local/signin`;
        // logic to verify if the user exists
        const res = await fetch(url, {
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
            refreshToken: result.refresh_token,
            user: result.user,
            expiresAt: result.expires_at,
          } as User;
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
    async jwt({ token, user, trigger, session }) {
      const customToken = token as unknown as CustomJWT;
      if (user) {
        customToken.user = (user as any).user;
        customToken.accessToken = (user as any).accessToken;
        customToken.refreshToken = (user as any).refreshToken;
        customToken.expiresAt = (user as any).expiresAt;
      }
      if (trigger === "update" && session?.user) {
        customToken.user = session.user;
      }
      if (Date.now() > customToken.expiresAt) {
        try {
          const { accessToken, refreshToken, user, expiresAt } = await refreshAccessToken(customToken.refreshToken as string);
          customToken.accessToken = accessToken;
          customToken.refreshToken = refreshToken;
          customToken.user = user;
          customToken.expiresAt = expiresAt;
        } catch (error) {
          console.error("Failed to refresh access token:", error);
          throw new Error("Failed to refresh access token");
        }
      }
      return customToken as unknown as JWT;
    },
    session({ session, token }: { session: Session; token: JWT }) {
      session.user = token.user as any;
      session.accessToken = token.accessToken as any;
      session.refreshToken = token.refreshToken as any;
      session.expiresAt = token.expiresAt as any;
      return session;
    },
  },
});

async function refreshAccessToken(refreshToken: string) {
  const url = `${baseUrl}/auth/refresh`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${refreshToken}`,
    },
  });
  if (res.ok) {
    const result = await res.json();
    return {
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      user: result.user,
      expiresAt: result.expires_at,
    };
  }
  throw new Error("Failed to refresh access token");
}