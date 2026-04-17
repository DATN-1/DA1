import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import crypto from 'crypto';
import { createSocialUser, findUserByEmail, updateUserProfileById } from '@/app/models/user.model';

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

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
          throw new Error('Vui lòng nhập email và mật khẩu.');
        }

        const user = await findUserByEmail(credentials.email);
        if (!user) {
          throw new Error('Email hoặc mật khẩu không đúng.');
        }

        if (user.status !== 'active') {
          throw new Error('Tài khoản chưa kích hoạt hoặc bị chặn.');
        }

        const passwordHash = hashPassword(credentials.password);
        if (passwordHash !== user.password) {
          throw new Error('Email hoặc mật khẩu không đúng.');
        }

        return {
          id: String(user.id),
          email: user.email,
          name: user.full_name,
          role: user.role,
        };
      }
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!account || !['google', 'facebook'].includes(account.provider)) {
        return true;
      }

      const email = String(user?.email || '').trim().toLowerCase();
      if (!email) {
        return false;
      }

      const full_name = String(user?.name || email.split('@')[0] || 'Khach hang').trim();
      const avatar = user?.image || null;

      const existing = await findUserByEmail(email);
      if (!existing) {
        await createSocialUser({ full_name, email, avatar });
      } else {
        await updateUserProfileById({
          userId: existing.id,
          full_name,
          avatar,
          status: 'active',
        });
      }

      return true;
    },
    async jwt({ token, user, account }) {
      // First sign-in: set token custom properties from the returned user
      if (user) {
        (token as any).id = user.id;
        (token as any).role = (user as any).role || 'customer';
        (token as any).full_name = user.name;
      }

      // For social logins, we must fetch the DB to get their role and latest info
      if ((account?.provider === 'google' || account?.provider === 'facebook') && token.email) {
        const dbUser = await findUserByEmail(String(token.email).toLowerCase());
        if (dbUser) {
          (token as any).id = dbUser.id;
          (token as any).role = dbUser.role;
          (token as any).full_name = dbUser.full_name;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: (token as any).id,
        role: (token as any).role || 'customer',
        full_name: (token as any).full_name || session.user?.name || null,
      } as any;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
