import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Mock user database - use plaintext passwords only for testing!
const users = [
  {
    id: "1",
    email: "admin@tablein.uz",
    password: "password123", // plaintext for testing
    name: "Admin User",
    role: "admin"
  },
  {
    id: "2",
    email: "user@example.uz",
    password: "password123", // plaintext for testing
    name: "Regular User",
    role: "user"
  }
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = users.find(u => u.email === credentials.email);
        if (!user) {
          return null;
        }

        // DEV ONLY: Bypass bcrypt for testing
        const isPasswordValid = credentials.password === user.password;
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub || "";
      session.user.role = token.role as string;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};


// Helper function to hash passwords
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Helper function to create a new user (mock implementation)
export async function createUser(email: string, password: string, name: string) {
  const hashedPassword = await hashPassword(password);
  const newUser = {
    id: String(users.length + 1),
    email,
    password: hashedPassword,
    name,
    role: "user"
  };

  users.push(newUser);
  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
  };
}

// Helper function to find user by email
export function findUserByEmail(email: string) {
  return users.find(user => user.email === email);
}
