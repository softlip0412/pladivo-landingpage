import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import UserProfile from "@/models/UserProfile";
import { verifyAccessToken, signAccessToken, signRefreshToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request) {
  await connectDB();
  
  // Verify authentication
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const token = authHeader.split(" ")[1];
  const decoded = verifyAccessToken(token);
  
  if (!decoded) {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }

  const { username, full_name, phone, date_of_birth, gender, address } = await request.json();

  // Validate required fields
  if (!username || !full_name || !phone) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Check if username is taken (if changed)
  const existingUser = await User.findOne({ username, _id: { $ne: decoded.user_id } });
  if (existingUser) {
    return Response.json({ error: "Username already taken" }, { status: 400 });
  }

  // Update User
  const user = await User.findById(decoded.user_id);
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  user.username = username;
  user.phone = phone;
  user.status = "active"; // Activate account
  await user.save();

  // Create or Update UserProfile
  await UserProfile.findOneAndUpdate(
    { user_id: user._id },
    {
      user_id: user._id,
      full_name,
      date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
      gender,
      address,
      verified: true // Mark profile as verified/completed
    },
    { upsert: true, new: true }
  );

  // Generate final tokens
  const accessToken = signAccessToken({
    user_id: user._id,
    email: user.email,
    role: user.role,
    status: user.status,
  });

  const refreshToken = signRefreshToken({
    user_id: user._id,
  });

  // Set cookies
  const cookieStore = cookies();
  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 15, // 15 mins
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return Response.json({
    message: "Profile completed successfully",
    user: {
      user_id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
    }
  }, { status: 200 });
}
