import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    user: {
      id: string;
      username: string;
      name: string;
      email: string;
      image: string;
      blocked: boolean;
      roleId: number;
      role: string;
    } & DefaultSession["user"];
  }
  interface CustomJWT {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    user: {
      id: string;
      username: string;
      name: string;
      email: string;
      image: string;
      blocked: boolean;
      roleId: number;
      role: string;
    };
  }
}
