import { NextAuthOptions, User as NextAuthUser, Session } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { getDataSource } from "./app/api/connection";
import { UsersService } from "./app/api/services/user.service";
import { CreateUser } from "./lib/types/user";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      id: "email-otp",
      name: "OTP Code",
      credentials: {
        email: { label: "Email", type: "text" },
        otp: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) return null;

        try {
          const ds = await getDataSource();
          const userService = new UsersService(ds);

          const user = await userService.verifyOtp(
            credentials.email,
            credentials.otp,
          );

          if (user) {
            return {
              id: user.id.toString(),
              name: user.name,
              email: user.email,
            };
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Github({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  session: { strategy: "jwt" as const }, // ili "jwt" za credentials-only

  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user || !user.email) return false;
      if (account?.provider !== "email-otp") {
        try {
          const ds = await getDataSource();
          const userService = new UsersService(ds);

          const userData: CreateUser = {
            name: user.name ?? "",
            email: user.email,
            emailVerified: new Date(),
          };

          await userService.findOrCreateByEmail(userData);

          return true;
        } catch (error) {
          console.error("Greška pri čuvanju:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }: { token: DefaultJWT; user: NextAuthUser }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: DefaultJWT }) {
      if (session.user) {
        session.user.name = token.name as string;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
