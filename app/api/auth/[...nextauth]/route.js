import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import crypto from "crypto"

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        await connectDB()
        
        // Check if user exists
        let existingUser = await User.findOne({ email: user.email })
        
        if (!existingUser) {
          // Create new user for Google OAuth
          const username = user.email.split("@")[0] + "_" + crypto.randomBytes(3).toString("hex")
          
          existingUser = await User.create({
            username,
            email: user.email,
            provider: "google",
            provider_id: account.providerAccountId,
            image: user.image,
            role: "customer",
            status: "verified", // Google users are auto-verified
          })
        } else if (existingUser.provider === "email") {
          // Link Google account to existing email user
          existingUser.provider_id = account.providerAccountId
          existingUser.image = user.image
          await existingUser.save()
        }
        
        return true
      }
      return true
    },
    async session({ session, token }) {
      if (token) {
        await connectDB()
        const user = await User.findOne({ email: token.email })
        if (user) {
          session.user.id = user._id.toString()
          session.user.role = user.role
          session.user.status = user.status
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/signup",
    error: "/signup",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
