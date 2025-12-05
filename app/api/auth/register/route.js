import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import EmailVerificationToken from "@/models/EmailVerificationToken"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import nodemailer from "nodemailer"

export async function POST(request) {
  await connectDB()
  const { email, password } = await request.json()

  if (!email || !password) {
    return Response.json(
      { error: "Vui lòng nhập đầy đủ email và mật khẩu" },
      { status: 400 }
    )
  }

  // Check user tồn tại
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return Response.json(
      { error: "Email đã tồn tại" },
      { status: 400 }
    )
  }

  if (!email.includes("@")) {
    return Response.json({ error: "Email không hợp lệ" }, { status: 400 })
  }
  if (password.length < 6) {
    return Response.json(
      { error: "Mật khẩu phải có ít nhất 6 ký tự" },
      { status: 400 }
    )
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  // Generate temporary username
  const tempUsername = `user_${crypto.randomBytes(4).toString("hex")}`

  const newUser = new User({
    username: tempUsername,
    email,
    password_hash: hashedPassword,
    provider: "email",
    role: "customer",
    status: "pending",
  })
  await newUser.save()

  // Tạo token xác minh email
  const token = crypto.randomBytes(32).toString("hex")
  await EmailVerificationToken.create({
    user_id: newUser._id,
    token,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
  })

  // Link verify
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`

  // Gửi email xác minh
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  const { getVerificationEmailTemplate } = await import("@/lib/emailTemplates")

  await transporter.sendMail({
    from: `"Pladivo" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Xác minh tài khoản Pladivo của bạn 🎉",
    html: getVerificationEmailTemplate(verifyUrl, email),
  })

  return Response.json(
    {
      message:
        "Đăng ký thành công. Vui lòng kiểm tra email để xác minh tài khoản.",
      user: {
        user_id: newUser._id,
        email: newUser.email,
        status: newUser.status,
      },
    },
    { status: 201 }
  )
}
