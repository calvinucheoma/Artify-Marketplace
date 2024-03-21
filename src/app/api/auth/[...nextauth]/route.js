import GoogleProvider from 'next-auth/providers/google';
import NextAuth from 'next-auth';
import { connectToDatabase } from '@/mongodb/database';
import User from '@/models/User';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      async authorize(credentials, req) {
        await connectToDatabase();

        const { email, password } = credentials;

        // check if the user exists
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error('Invalid email or password');
        }

        // Compare password
        const isMatch = await compare(password, user.password);

        if (!isMatch) {
          throw new Error('Invalid email or password');
        }

        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({ email: session.user.email });
      session.user.id = sessionUser._id.toString();

      session.user = { ...session.user, ...sessionUser._doc };
      // returns all the user properties in the mongoDB user model to the session.user, which contained only email and id properties before
      return session;
    },
    async signIn({ account, profile }) {
      if (account.provider === 'google') {
        try {
          await connectToDatabase();

          // check if the user exists
          let user = await User.findOne({ email: profile.email }); //profile includes all the information we get from google

          if (!user) {
            user = await User.create({
              email: profile.email,
              username: profile.name,
              profileImagePath: profile.picture,
              wishList: [],
              cart: [],
              order: [],
              work: [],
            });
          }
          return user;
        } catch (error) {
          console.log('Error checking if user exists', error.message);
        }
      }
      return true; // for other login verifications like when using credentials
    },
  },
});

export { handler as GET, handler as POST };
