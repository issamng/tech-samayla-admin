import clientPromise from "@/lib/mongodb";
import { Admin } from "@/models/Admin";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// const adminEmails = ["razmakus@gmail.com"];


//Setting admins from Admins pages
async function isAdminEmail(email) {
  //  return true;
  return !! (await Admin.findOne({ email }));
}

export const authOptions = {
  //fix vercel server error: adding secret 
  secret: process.env.GOOGLE_ID,
  providers: [
    // OAuth authentication providers...

    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: async ({ session, token, user }) => {
      if (await isAdminEmail(session?.user?.email)) {
        return session;
      } else {
        return false;
      }
    },
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!(await isAdminEmail(session?.user?.email))) {
    res.status(401);
    res.end();
    throw "Connectez-vous en tant qu'Admin";
  }
}
