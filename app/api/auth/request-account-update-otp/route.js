import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import EmailVerificationCode from "@/models/EmailVerificationCode";
import { authenticateToken } from "@/lib/auth";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export async function POST(request) {
  await connectDB();

  // Authenticate user
  let userData;
  try {
    userData = authenticateToken();
  } catch (err) {
    return Response.json({ error: err.message }, { status: 401 });
  }

  const { field, new_value, old_password } = await request.json();

  // Validate field
  if (!['username', 'phone', 'password'].includes(field)) {
    return Response.json({ error: "Field không hợp lệ" }, { status: 400 });
  }

  if (!new_value) {
    return Response.json({ error: "Giá trị mới là bắt buộc" }, { status: 400 });
  }

  // Get user
  const user = await User.findById(userData.user_id);
  if (!user) {
    return Response.json({ error: "Không tìm thấy người dùng" }, { status: 404 });
  }

  // Special validation for password change
  if (field === 'password') {
    if (!old_password) {
      return Response.json({ error: "Vui lòng nhập mật khẩu cũ" }, { status: 400 });
    }

    // Verify old password
    const isValidPassword = await bcrypt.compare(old_password, user.password_hash);
    if (!isValidPassword) {
      return Response.json({ error: "Mật khẩu cũ không đúng" }, { status: 400 });
    }

    // Validate new password
    if (new_value.length < 6) {
      return Response.json({ error: "Mật khẩu mới phải có ít nhất 6 ký tự" }, { status: 400 });
    }
  }

  // Validate username
  if (field === 'username') {
    if (new_value.length < 3 || new_value.length > 20) {
      return Response.json({ error: "Username phải có từ 3-20 ký tự" }, { status: 400 });
    }

    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(new_value)) {
      return Response.json({ 
        error: "Username chỉ được chứa chữ cái, số, gạch dưới (_) và gạch ngang (-)" 
      }, { status: 400 });
    }

    // Check if username is already taken
    const existingUser = await User.findOne({ username: new_value, _id: { $ne: user._id } });
    if (existingUser) {
      return Response.json({ error: "Username đã được sử dụng" }, { status: 400 });
    }
  }

  // Validate phone
  if (field === 'phone') {
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(new_value)) {
      return Response.json({ error: "Số điện thoại không hợp lệ" }, { status: 400 });
    }
  }

  // Delete old OTP codes for this user and purpose
  await EmailVerificationCode.deleteMany({ 
    user_id: user._id, 
    purpose: 'account_update' 
  });

  // Generate OTP code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  console.log('📝 Creating verification code record:');
  console.log('User ID:', user._id);
  console.log('Code:', code);
  console.log('Purpose:', 'account_update');
  console.log('Metadata:', { field, new_value: field === 'password' ? null : new_value });
  
  // Create verification code with metadata
  const verificationRecord = await EmailVerificationCode.create({
    user_id: user._id,
    code,
    purpose: 'account_update',
    metadata: {
      field,
      new_value: field === 'password' ? null : new_value,
    },
    expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  });

  console.log('✅ Verification record created:', verificationRecord._id);

  // Send email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { getAccountUpdateOTPTemplate } = await import("@/lib/emailTemplates");

  const fieldNames = {
    username: 'tên đăng nhập',
    phone: 'số điện thoại',
    password: 'mật khẩu'
  };

  await transporter.sendMail({
    from: `"Pladivo" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `Mã xác minh thay đổi ${fieldNames[field]} - Pladivo`,
    html: getAccountUpdateOTPTemplate(code, user.email, fieldNames[field]),
  });

  return Response.json({ 
    message: "Đã gửi mã xác minh đến email của bạn" 
  }, { status: 200 });
}
