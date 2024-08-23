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
      blocked: boolean;
      roleId: number;
      role: {
        id: number,
        name: string,
      }
    }
    & DefaultSession["user"];
  }
}