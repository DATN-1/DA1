import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import { createSocialUser, findUserByEmail, updateUserProfileById } from '@/app/models/user.model';

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
      if ((account?.provider === 'google' || account?.provider === 'facebook') && user?.email) {
        const dbUser = await findUserByEmail(String(user.email).toLowerCase());
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
