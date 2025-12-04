import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import EmailVerificationToken from "@/models/EmailVerificationToken";
import { signAccessToken } from "@/lib/auth";

export async function POST(request) {
  await connectDB();
  const { token } = await request.json();

  if (!token) {
    return Response.json({ error: "Verification token required" }, { status: 400 });
  }

  const record = await EmailVerificationToken.findOne({ token });
  if (!record) {
    return Response.json({ error: "Invalid or expired token" }, { status: 400 });
  }

  if (record.expires_at < new Date()) {
    await EmailVerificationToken.deleteOne({ _id: record._id });
    return Response.json({ error: "Token expired" }, { status: 400 });
  }

  const user = await User.findById(record.user_id);
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  // Update user status to 'verified' (intermediate state)
  user.status = "verified";
  await user.save();

  await EmailVerificationToken.deleteOne({ _id: record._id });

  // Generate temporary access token for profile completion
  const accessToken = signAccessToken({
    user_id: user._id,
    email: user.email,
    role: user.role,
    status: user.status, // verified
  });

  return Response.json({ 
    message: "Email verified successfully",
    accessToken,
    user: {
        user_id: user._id,
        email: user.email,
        status: user.status
    }
  }, { status: 200 });
}
