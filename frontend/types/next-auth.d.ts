import NextAuth, { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      username: string;
      name: string;
      email: string;
      image: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    accessToken: string;
    refreshToken: string;
  }
}