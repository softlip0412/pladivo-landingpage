import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import EmailVerificationCode from "@/models/EmailVerificationCode";
import bcrypt from "bcryptjs";

export async function POST(request) {
  await connectDB();

  const { email, code, new_password } = await request.json();

  console.log('🔐 Password reset verification:', { email, code });

  if (!email || !code || !new_password) {
    return Response.json({ 
      error: "Email, mã xác minh và mật khẩu mới là bắt buộc" 
    }, { status: 400 });
  }

  // Validate password length
  if (new_password.length < 6) {
    return Response.json({ 
      error: "Mật khẩu mới phải có ít nhất 6 ký tự" 
    }, { status: 400 });
  }

  // Find verification code
  const record = await EmailVerificationCode.findOne({ 
    code,
    purpose: 'password_reset',
    'metadata.email': email
  });

  if (!record) {
    console.log('❌ No verification record found');
    return Response.json({ error: "Mã xác minh không hợp lệ" }, { status: 400 });
  }

  // Check expiration
  if (record.expires_at < new Date()) {
    await EmailVerificationCode.deleteOne({ _id: record._id });
    return Response.json({ error: "Mã xác minh đã hết hạn" }, { status: 400 });
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return Response.json({ error: "Không tìm thấy người dùng" }, { status: 404 });
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(new_password, 10);
  
  // Update password
  user.password_hash = hashedPassword;
  await user.save();

  // Delete used verification code
  await EmailVerificationCode.deleteOne({ _id: record._id });

  console.log('✅ Password reset successful for:', email);

  return Response.json({ 
    message: "Đặt lại mật khẩu thành công" 
  }, { status: 200 });
}
