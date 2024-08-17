import NextAuth, { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      name: string;
      email: string;
      image: string;
      accessToken: string;
      refreshToken: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    accessToken: string;
    refreshToken: string;
  }
}