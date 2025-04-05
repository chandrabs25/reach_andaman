// src/types/next-auth.d.ts (or similar path)
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

// Define your user role type
type UserRole = 'admin' | 'user' | 'vendor';

// Extend the JWT type
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string; // Add the user ID
    role?: UserRole; // Add your custom role property
  }
}

// Extend the Session type
declare module "next-auth" {
  interface Session {
    user?: {
      id?: string; // Add the user ID
      role?: UserRole; // Add your custom role property
    } & DefaultSession["user"]; // Keep the default properties like name, email, image
  }

  // Extend the User type (used in callbacks like authorize, signIn)
  interface User extends DefaultUser {
      role?: UserRole; // Add your custom role property
  }
}