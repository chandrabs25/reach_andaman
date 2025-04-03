import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/database';
import bcrypt from 'bcryptjs';
export const runtime = 'edge';
export const authOptions = {
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
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find user
          const users = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [credentials.email]
          );
          
          if (!users || users.length === 0) {
            return null;
          }
          
          const user = users[0];
          
          // Check password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            return null;
          }
          
          // Remove password from response
          const { password: _, ...userWithoutPassword } = user;
          
          return userWithoutPassword;
        } catch (error) {
          console.error('Error during authentication:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google' || account.provider === 'facebook') {
        try {
          // Check if user exists
          const existingUsers = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [user.email]
          );
          
          if (!existingUsers || existingUsers.length === 0) {
            // Create new user
            await db.execute(
              `INSERT INTO users (
                name, email, role, provider, provider_id, created_at
              ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
              [user.name, user.email, 'user', account.provider, account.providerAccountId]
            );
          } else {
            // Update provider info if needed
            await db.execute(
              `UPDATE users SET provider = ?, provider_id = ? WHERE email = ?`,
              [account.provider, account.providerAccountId, user.email]
            );
          }
        } catch (error) {
          console.error('Error during social login:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
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
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
