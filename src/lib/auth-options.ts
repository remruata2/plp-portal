import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "./db";
// Import UserRole from the generated Prisma client
import { UserRole } from "../generated/prisma";

// Define custom types for NextAuth
type AppUser = {
  id: string;
  role: UserRole;
  username: string;
  email: string;
  name: string;
  facility_id?: string; // Add facility_id for facility users
};

declare module "next-auth" {
  interface User extends AppUser {}

  interface Session {
    user: AppUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends AppUser {}
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Try to find user by username or email
        const user = await db.user.findFirst({
          where: {
            OR: [
              { username: credentials.username },
              { email: credentials.username },
            ],
          },
        });

        if (!user || !user.password_hash) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password_hash
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: String(user.id),
          username: user.username,
          role: user.role,
          email: user.email || user.username, // Use actual email or fallback to username
          name: user.username, // Use username as name for NextAuth compatibility
          facility_id: user.facility_id || undefined, // Include facility_id for facility users, convert null to undefined
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
        token.facility_id = user.facility_id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role as UserRole;
        session.user.username = token.username;
        session.user.facility_id = token.facility_id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle role-based redirects
      if (url.startsWith(baseUrl)) {
        // If it's a relative URL, let NextAuth handle it
        return url;
      }
      // For external URLs, redirect to base URL
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};

// UserRole is now imported from @prisma/client
