import clientPromise from "@/lib/mongodb";
import { Admin } from "@/models/Admin";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { mongooseConnect } from "@/lib/mongoose";

//Setting admins from Admins pages
async function isAdminEmail(email) {
  mongooseConnect();
  return !!(await Admin.findOne({ email }));
  
}

export const authOptions = {
  //fix vercel server error: adding secret
  secret: process.env.GOOGLE_ID,
  providers: [
    // OAuth authentication providers...

    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      prompt: "select_account",
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: async ({ session }) => {
      if (await isAdminEmail(session?.user?.email)) {
        return session;
      } else {
        console.log("erreur, vous n'etes pas admin");
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
