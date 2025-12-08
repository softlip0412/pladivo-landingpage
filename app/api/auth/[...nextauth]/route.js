import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import crypto from "crypto"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("🔵 signIn callback triggered", { 
        provider: account?.provider, 
        email: user?.email 
      })
      
      if (account.provider === "google") {
        await connectDB()
        
        // Check if user exists
        let existingUser = await User.findOne({ email: user.email })
        console.log("🔍 Existing user found:", existingUser ? "YES" : "NO")
        
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
          console.log("✅ New Google user created:", existingUser._id)
        } else if (existingUser.provider === "email") {
          // Link Google account to existing email user
          existingUser.provider_id = account.providerAccountId
          existingUser.image = user.image
          await existingUser.save()
          console.log("🔗 Linked Google to existing email user")
        }
        
        return true
      }
      return true
    },
    async jwt({ token, user, account }) {
      console.log("🟡 jwt callback triggered", { 
        hasAccount: !!account, 
        email: token?.email 
      })
      
      // Initial sign in - populate token with user data from database
      if (account) {
        await connectDB()
        const dbUser = await User.findOne({ email: token.email })
        console.log("🔍 DB User found in jwt:", dbUser ? "YES" : "NO")
        
        if (dbUser) {
          token.id = dbUser._id.toString()
          token.role = dbUser.role
          token.status = dbUser.status
          token.username = dbUser.username
          console.log("✅ Token populated with user data:", { 
            id: token.id, 
            role: token.role 
          })
        } else {
          console.log("❌ No user found for email:", token.email)
        }
      }
      return token
    },
    async session({ session, token }) {
      console.log("🟢 session callback triggered", { 
        hasToken: !!token,
        tokenId: token?.id 
      })
      
      // Add user data from token to session
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.status = token.status
        session.user.username = token.username
        console.log("✅ Session created with user data:", { 
          id: session.user.id, 
          role: session.user.role 
        })
      } else {
        console.log("❌ No token in session callback")
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
