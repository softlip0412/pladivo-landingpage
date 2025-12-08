import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import EmailVerificationCode from "@/models/EmailVerificationCode";
import { signAccessToken } from "@/lib/auth";

export async function POST(request) {
  await connectDB();
  const { user_id, code } = await request.json();

  if (!user_id || !code) {
    return Response.json({ error: "User ID và mã xác minh là bắt buộc" }, { status: 400 });
  }

  // Kiểm tra mã xác minh
  const record = await EmailVerificationCode.findOne({ user_id, code });
  if (!record) {
    return Response.json({ error: "Mã xác minh không hợp lệ" }, { status: 400 });
  }

  // Kiểm tra hết hạn
  if (record.expires_at < new Date()) {
    await EmailVerificationCode.deleteOne({ _id: record._id });
    return Response.json({ error: "Mã xác minh đã hết hạn" }, { status: 400 });
  }

  // Tìm user
  const user = await User.findById(user_id);
  if (!user) {
    return Response.json({ error: "Không tìm thấy người dùng" }, { status: 404 });
  }

  // Cập nhật trạng thái user
  user.status = "verified";
  await user.save();

  // Xóa mã đã sử dụng
  await EmailVerificationCode.deleteOne({ _id: record._id });

  // Tạo temporary access token cho bước hoàn tất hồ sơ
  const accessToken = signAccessToken({
    user_id: user._id,
    email: user.email,
    role: user.role,
    status: user.status,
  });

  return Response.json({ 
    message: "Xác minh thành công",
    accessToken,
    user: {
      user_id: user._id,
      email: user.email,
      status: user.status
    }
  }, { status: 200 });
}
