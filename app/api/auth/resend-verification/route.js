import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import EmailVerificationCode from "@/models/EmailVerificationCode";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(request) {
  await connectDB();
  const { email } = await request.json();

  if (!email) {
    return Response.json({ error: "Email là bắt buộc" }, { status: 400 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return Response.json({ error: "Email không tồn tại" }, { status: 404 });
  }

  if (user.status === "active") {
    return Response.json({ error: "Tài khoản đã được kích hoạt" }, { status: 400 });
  }

  // Xóa mã cũ nếu có
  await EmailVerificationCode.deleteMany({ user_id: user._id });

  // Tạo mã OTP 6 số mới
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await EmailVerificationCode.create({
    user_id: user._id,
    code,
    purpose: 'registration',
    expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10 phút
  });

  // Gửi email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { getVerificationCodeEmailTemplate } = await import("@/lib/emailTemplates");

  await transporter.sendMail({
    from: `"Pladivo" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Mã xác minh tài khoản Pladivo của bạn 🎉",
    html: getVerificationCodeEmailTemplate(code, email),
  });

  return Response.json({ message: "Đã gửi lại mã xác minh" }, { status: 200 });
}
