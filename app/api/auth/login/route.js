import { connectDB } from "@/lib/mongodb";
import { User } from "@/models";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request) {
  await connectDB();
  const { username, email, password } = await request.json();

  // Tìm user với email hoặc username (bỏ filter status active)
  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    return Response.json({ error: "Tài khoản không tồn tại" }, { status: 401 });
  }

  // So sánh mật khẩu
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return Response.json({ error: "Mật khẩu không đúng" }, { status: 401 });
  }

  // Check status
  if (user.status === "inactive") {
    return Response.json({ error: "Tài khoản đã bị khóa" }, { status: 403 });
  }

  if (user.status === "pending") {
    return Response.json({ 
      error: "Vui lòng xác minh email trước khi đăng nhập",
      status: "pending" 
    }, { status: 403 });
  }

  // Nếu status là verified (đã xác minh email nhưng chưa hoàn tất hồ sơ)
  // Hoặc active (đã hoàn tất)
  
  const isVerifiedOnly = user.status === "verified";

  // Tạo token
  const accessToken = signAccessToken({
    user_id: user._id,
    email: user.email,
    role: user.role,
    status: user.status,
  });

  const refreshToken = signRefreshToken({
    user_id: user._id,
  });

  // Nếu chỉ mới verified, chưa active -> Trả về token để client dùng gọi API complete-profile
  // Không set cookie session dài hạn (hoặc có thể set nhưng client sẽ redirect)
  
  if (isVerifiedOnly) {
    return Response.json({
      message: "Vui lòng hoàn tất hồ sơ",
      redirect: "/complete-profile",
      accessToken, // Client sẽ lưu cái này để gọi API complete-profile
      user: {
        user_id: user._id,
        email: user.email,
        status: user.status,
      }
    }, { status: 200 });
  }

  // Active user -> Set cookie
  const cookieStore = cookies();

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    path: "/",
    maxAge: 60 * 15, // 15 phút
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 ngày
  });

  // Trả response
  return Response.json(
    {
      message: "Login successful",
      user: {
        user_id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
    },
    { status: 200 }
  );
}
