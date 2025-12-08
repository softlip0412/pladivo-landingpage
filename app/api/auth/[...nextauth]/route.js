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
      
      if (account?.provider === "google") {
        try {
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
            console.log("✅ New Google user created:", existingUser._id.toString())
          } else if (existingUser.provider === "email") {
            // Link Google account to existing email user
            existingUser.provider_id = account.providerAccountId
            existingUser.image = user.image
            await existingUser.save()
            console.log("🔗 Linked Google to existing email user")
          } else {
            console.log("👤 Existing Google user logging in")
          }
          
          // IMPORTANT: Attach user ID to the user object for jwt callback
          user.id = existingUser._id.toString()
          user.role = existingUser.role
          user.status = existingUser.status
          user.username = existingUser.username
          
          return true
        } catch (error) {
          console.error("❌ Error in signIn callback:", error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account, trigger }) {
      console.log("🟡 jwt callback triggered", { 
        hasAccount: !!account,
        hasUser: !!user,
        trigger,
        email: token?.email 
      })
      
      // Initial sign in - user object is available
      if (user) {
        console.log("👤 User object available in jwt callback")
        token.id = user.id
        token.role = user.role
        token.status = user.status
        token.username = user.username
        console.log("✅ Token populated from user object:", { 
          id: token.id, 
          role: token.role 
        })
      }
      
      // If no user object but we have account (shouldn't happen but fallback)
      if (!user && account) {
        console.log("⚠️ Fallback: querying database in jwt callback")
        await connectDB()
        const dbUser = await User.findOne({ email: token.email })
        
        if (dbUser) {
          token.id = dbUser._id.toString()
          token.role = dbUser.role
          token.status = dbUser.status
          token.username = dbUser.username
          console.log("✅ Token populated from database:", { 
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
      if (token && token.id) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.status = token.status
        session.user.username = token.username
        console.log("✅ Session created with user data:", { 
          id: session.user.id, 
          role: session.user.role 
        })
      } else {
        console.log("❌ No token or token.id in session callback")
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: true, // Enable debug mode for troubleshooting
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
