import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import EmailVerificationCode from "@/models/EmailVerificationCode";
import nodemailer from "nodemailer";

export async function POST(request) {
  await connectDB();

  const { email } = await request.json();

  if (!email) {
    return Response.json({ error: "Email là bắt buộc" }, { status: 400 });
  }

  // Find user by email
  const user = await User.findOne({ email });
  
  // For security, always return success even if email doesn't exist
  if (!user) {
    return Response.json({ 
      message: "Nếu email tồn tại, mã xác minh đã được gửi" 
    }, { status: 200 });
  }

  // Delete old OTP codes for password reset
  await EmailVerificationCode.deleteMany({ 
    purpose: 'password_reset',
    'metadata.email': email
  });

  // Generate OTP code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  console.log('📝 Creating password reset OTP:');
  console.log('Email:', email);
  console.log('Code:', code);
  
  // Create verification code with email in metadata
  await EmailVerificationCode.create({
    user_id: user._id,
    code,
    purpose: 'password_reset',
    metadata: {
      email
    },
    expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  });

  // Send email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { getPasswordResetOTPTemplate } = await import("@/lib/emailTemplates");

  await transporter.sendMail({
    from: `"Pladivo" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Mã xác minh đặt lại mật khẩu - Pladivo",
    html: getPasswordResetOTPTemplate(code, email),
  });

  return Response.json({ 
    message: "Mã xác minh đã được gửi đến email của bạn" 
  }, { status: 200 });
}
