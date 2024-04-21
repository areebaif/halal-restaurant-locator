import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { SessionStrategy } from "next-auth";
import { prisma } from "@/db/prisma";
//import { User } from "@prisma/client";
import { User } from "next-auth";

if (
  !process.env.EMAIL_SERVER_HOST ||
  !process.env.EMAIL_SERVER_PORT ||
  !process.env.EMAIL_SERVER_USER ||
  !process.env.EMAIL_SERVER_PASSWORD ||
  !process.env.EMAIL_FROM
) {
  throw new Error("no environemnt variables exit");
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt" as SessionStrategy,
    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge: 30 * 24 * 60 * 60, // 30 days
    // Seconds - Throttle how frequently to write to database to extend a session.
  },
  jwt: {
    // The maximum age of the NextAuth.js issued JWT in seconds.
    // Defaults to `session.maxAge`.
    maxAge: 60 * 60 * 24 * 30,
  },
  callbacks: {
    async signIn(props: { user: User & { verifiedUser?: boolean } }) {
      const { user } = props;
      if (!user.verifiedUser) {
        return false;
      }
      return true;
    },
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const res = await fetch("/auth/sigin", {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });
        // TODO: 
        const user = await res.json();

        // If no error and we have user data, return it
        if (res.ok && user) {
          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/user/signin",
    signOut: "/user/signout",
  },
};
export default NextAuth(authOptions);
