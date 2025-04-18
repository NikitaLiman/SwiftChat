import { UserRole } from "@prisma/client";
import { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../prisma/prisma-client";
import { compare } from "bcrypt";
import { hashSync } from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name || profile.login,
          email: profile.email,
          image: profile?.avatar_url,
          role: "USER" as UserRole,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name || profile.login,
          email: profile.email,
          image: profile?.avatar_url,
          role: "USER" as UserRole,
        };
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      // @ts-expect-error: The id type must be a string, and Prisma returns it as a number
      async authorize(credentials) {
        if (!credentials) return null;
        const user = await prisma.user.findFirst({
          where: { email: credentials.email },
        });
        if (!user) {
          return null;
        }
        if (!user.password) {
          return null;
        }

        const validPassword = await compare(
          credentials.password,
          user.password
        );

        if (!validPassword) {
          return null;
        }
        if (!user.verified) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullname,
          role: user.role,
          avatar: user.avatar,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // @ts-expect-error: signIn must return boolean or string, ignore undefined for now
    async signIn({ account, user }) {
      try {
        if (account?.provider === "credentials") return true;
        if (!user.email) return false;

        const findUser = await prisma.user.findFirst({
          where: {
            OR: [
              {
                provider: account?.provider,
                providerId: account?.providerAccountId,
              },
              { email: user?.email },
            ],
          },
        });
        if (findUser) {
          await prisma.user.update({
            where: {
              id: findUser.id,
            },
            data: {
              provider: account?.provider,
              providerId: account?.providerAccountId,
              avatar: user.image || findUser.avatar,
            },
          });
          return true;
        }

        await prisma.user.create({
          data: {
            email: user?.email,
            fullname: user?.name || "User #" + user.id,
            password: hashSync(user.id.toString(), 10),
            verified: new Date(),
            // @ts-expect-error: avatar exists on extended user object but TS infers 'never' here
            avatar: user.image || findUser?.avatar,
            provider: account?.provider,
            providerId: account?.providerAccountId,
          },
        });
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async jwt({ token }) {
      if (!token.email) return token;
      const findUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (findUser) {
        token.id = String(findUser.id);
        token.email = findUser.email;
        token.fullName = findUser.fullname;
        token.avatar = findUser.avatar;
        token.role = findUser.role;
      }

      return token;
    },

    session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.avatar = token.avatar;
        session.user.fullName = token.fullname;
      }
      return session;
    },
  },
};
