import { connectDB } from "@/lib/mongodb";
import { User, EmailVerificationToken } from "@/models";
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
    return Response.json({ error: "User không tồn tại" }, { status: 404 });
  }

  if (user.status === "active" || user.status === "verified") {
    return Response.json(
      { message: "Tài khoản đã được xác minh, không cần gửi lại." },
      { status: 200 }
    );
  }

  // Delete old tokens
  await EmailVerificationToken.deleteMany({ user_id: user._id });

  // Create new token
  const token = crypto.randomBytes(32).toString("hex");
  await EmailVerificationToken.create({
    user_id: user._id,
    token,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
  });

  // Send verification email
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { getVerificationEmailTemplate } = await import("@/lib/emailTemplates");

  await transporter.sendMail({
    from: `"Pladivo" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Xác minh tài khoản Pladivo của bạn 🎉",
    html: getVerificationEmailTemplate(verifyUrl, email),
  });

  return Response.json(
    {
      message: "Đã gửi lại email xác minh. Vui lòng kiểm tra hộp thư.",
    },
    { status: 200 }
  );
}
