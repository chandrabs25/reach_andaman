// Path: .\src\app\api\auth\[...nextauth]\route.ts
import NextAuth, { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/database'; // Assuming db is correctly initialized D1Database
import bcrypt from 'bcryptjs';

// Define types based on your schema for better type safety
// Type for raw DB result
interface DbUserSchema {
  id: number;
  email: string;
  password_hash?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  role_id: number;
  profile_image?: string | null;
  created_at: string;
  updated_at: string;
  provider?: string | null;
  provider_id?: string | null;
}

// Type for DB result after joining with roles
interface UserWithRoleFromDb extends DbUserSchema {
  role: string; // Role name from the roles table
}

// Define your user role type (matches next-auth.d.ts)
type UserRole = 'admin' | 'user' | 'vendor';

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" }
      },
      // The return type Promise<NextAuthUser | null> uses the *augmented* User type now
      async authorize(credentials): Promise<NextAuthUser | null> {
        if (!credentials?.email || !credentials?.password) {
          console.error("Authorize: Missing email or password");
          return null;
        }

        try {
          // Find user and their role using D1 prepare, bind, first
          const userFromDb = await db
            .prepare(`
              SELECT u.*, r.name as role
              FROM users u
              JOIN roles r ON u.role_id = r.id
              WHERE u.email = ?
            `)
            .bind(credentials.email)
            .first<UserWithRoleFromDb>(); // Use the specific DB type here

          if (!userFromDb) {
            console.log(`Authorize: User not found for email: ${credentials.email}`);
            return null;
          }

          if (!userFromDb.password_hash) {
            console.log(`Authorize: User ${credentials.email} has no password set (likely OAuth).`);
            return null;
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, userFromDb.password_hash);

          if (!isPasswordValid) {
            console.log(`Authorize: Invalid password for user: ${credentials.email}`);
            return null;
          }

          // Construct the user object conforming to the *augmented* NextAuth User type
          const authorizedUser: NextAuthUser = {
            id: userFromDb.id.toString(), // NextAuth expects id as string
            email: userFromDb.email,
            name: `${userFromDb.first_name || ''} ${userFromDb.last_name || ''}`.trim() || userFromDb.email, // Fallback to email if no name
            // Now we can add the role directly because the User type is augmented
            role: userFromDb.role as UserRole, // Cast role string to UserRole type
          };
           console.log("Authorize successful, returning:", authorizedUser);
          return authorizedUser; // TypeScript should no longer complain here

        } catch (error) {
          console.error('Error during authorization:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    // `user` here is the object returned by `authorize` or from OAuth provider
    async signIn({ user, account, profile }) {
       if (!user.email) {
          console.error("SignIn callback: User email is missing.");
          return false;
       }

      if (account && (account.provider === 'google' || account.provider === 'facebook')) {
        try {
          const existingUser = await db
            .prepare('SELECT id, role_id FROM users WHERE email = ?')
            .bind(user.email)
            .first<{ id: number; role_id: number }>();

          let userId: number;
          let roleId: number;

          if (!existingUser) {
             console.log(`SignIn: Creating new user for ${user.email} via ${account.provider}`);
            const defaultUserRoleId = 2; // Role ID for 'user'
             const nameParts = user.name?.split(' ') || [];
             const firstName = nameParts[0] || 'User';
             const lastName = nameParts.slice(1).join(' ') || '';

            const insertResult = await db
              .prepare(`
                INSERT INTO users (email, first_name, last_name, role_id, provider, provider_id, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                RETURNING id, role_id
              `)
              .bind(
                user.email,
                firstName,
                lastName,
                defaultUserRoleId,
                account.provider,
                account.providerAccountId
              )
              .first<{ id: number; role_id: number }>();

              if (!insertResult) {
                  console.error(`SignIn: Failed to insert or retrieve new user for ${user.email}`);
                  return false;
              }
              userId = insertResult.id;
              roleId = insertResult.role_id;
              console.log(`SignIn: New user created with ID: ${userId}, Role ID: ${roleId}`);
          } else {
             console.log(`SignIn: User ${user.email} already exists. Updating provider info.`);
            await db
              .prepare('UPDATE users SET provider = ?, provider_id = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?')
              .bind(account.provider, account.providerAccountId, user.email)
              .run();
              userId = existingUser.id;
              roleId = existingUser.role_id;
          }

           const roleResult = await db.prepare('SELECT name FROM roles WHERE id = ?').bind(roleId).first<{ name: string }>();
           const roleName = roleResult?.name || 'user';

           // Attach id and role to the user object *before* it goes to the JWT callback
           user.id = userId.toString();
           user.role = roleName as UserRole; // Attach role (now known by TypeScript)

        } catch (error) {
          console.error(`Error during OAuth sign-in (${account.provider}):`, error);
          return false;
        }
      }
       // Ensure user object has id and role even for credentials flow (it should from authorize)
       if (!user.id || !user.role) {
         console.warn("SignIn callback: User object missing id or role after processing. User:", user);
         // Optionally fetch again, but ideally authorize should provide it
       }
      return true;
    },

    // `user` object here contains what `authorize` or `signIn` returned/modified
    async jwt({ token, user }) {
      if (user) {
        // Persist the id and role from the user object to the JWT token
        token.id = user.id;
        token.role = user.role; // Directly access role (type is augmented)
         console.log("JWT Callback: Populating token from user object", { userId: token.id, userRole: token.role });
      }
       console.log("JWT Callback: Returning token", token);
      return token;
    },

    async session({ session, token }) {
      // Add properties from the JWT token to the session object
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
         console.log("Session Callback: Populating session from token", { sessionId: session.user.id, sessionRole: session.user.role });
      } else {
          console.log("Session Callback: Token or session.user missing", { tokenExists: !!token, sessionUserExists: !!session.user });
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };