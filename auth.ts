import { TypeORMLegacyAdapter } from "@next-auth/typeorm-legacy-adapter";
import { User as NextAuthUser, Session } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";
import EmailProvider from "next-auth/providers/email";
import Github from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { createTransport } from "nodemailer";
import { AppDataSourceOptions } from "./app/api/connection";

export const authOptions = {
  providers: [
    EmailProvider({
      from: process.env.EMAIL_SERVER_FROM || "noreply@remenex.com",
      maxAge: 10 * 60,
      sendVerificationRequest: async ({ identifier: email, url, provider }) => {
        const transporter = createTransport({
          host: process.env.EMAIL_SERVER_HOST,
          port: Number(process.env.EMAIL_SERVER_PORT),
          secure: true,
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        });

        await transporter.sendMail({
          to: email,
          from: provider.from,
          subject: "Your sign-in link",
          html: `<p>Sign in using this link: <a href="${url}">${url}</a></p>`,
        });
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

  adapter: TypeORMLegacyAdapter(AppDataSourceOptions),

  session: { strategy: "jwt" as const }, // ili "jwt" za credentials-only

  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },

  callbacks: {
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
