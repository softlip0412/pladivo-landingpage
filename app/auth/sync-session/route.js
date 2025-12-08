import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { signAccessToken, signRefreshToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return redirect("/login?error=NoSession");
  }

  // Create payload for JWT
  const payload = {
    user_id: session.user.id,
    email: session.user.email,
    role: session.user.role || "customer",
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // Set cookies
  const cookieStore = cookies();
  
  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 5, // 5 days
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  // Also set a client-readable cookie for UI state if needed, 
  // though AuthContext usually fetches /api/auth/me which relies on the httpOnly cookie.
  
  return redirect("/");
}
