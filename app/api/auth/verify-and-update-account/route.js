import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import EmailVerificationCode from "@/models/EmailVerificationCode";
import { authenticateToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request) {
  console.log('🚀 verify-and-update-account API called');
  await connectDB();

  // Authenticate user
  let userData;
  try {
    userData = authenticateToken();
    console.log('✅ User authenticated:', userData.user_id);
  } catch (err) {
    console.log('❌ Authentication failed:', err.message);
    return Response.json({ error: err.message }, { status: 401 });
  }

  const { code, field, new_value } = await request.json();
  console.log('📥 Request data:', { code, field, new_value });

  if (!code || !field || !new_value) {
    console.log('❌ Missing required fields');
    return Response.json({ 
      error: "Mã xác minh, field và giá trị mới là bắt buộc" 
    }, { status: 400 });
  }

  // Validate field
  if (!['username', 'phone', 'password'].includes(field)) {
    console.log('❌ Invalid field:', field);
    return Response.json({ error: "Field không hợp lệ" }, { status: 400 });
  }

  // Find verification code
  console.log('🔍 Searching for verification record with:');
  console.log('user_id:', userData.user_id);
  console.log('code:', code);
  console.log('purpose:', 'account_update');
  
  const record = await EmailVerificationCode.findOne({ 
    user_id: userData.user_id, 
    code,
    purpose: 'account_update'
  });

  console.log('🔍 Found verification record:', record ? 'Yes' : 'No');
  if (record) {
    console.log('Record details:', {
      _id: record._id,
      user_id: record.user_id,
      code: record.code,
      purpose: record.purpose,
      metadata: record.metadata,
      expires_at: record.expires_at
    });
  } else {
    // Try to find ANY record for this user
    const anyRecord = await EmailVerificationCode.findOne({ user_id: userData.user_id });
    console.log('Any record for user?', anyRecord ? 'Yes' : 'No');
    if (anyRecord) {
      console.log('Found record with different criteria:', {
        code: anyRecord.code,
        purpose: anyRecord.purpose
      });
    }
  }

  if (!record) {
    console.log('❌ No verification record found');
    return Response.json({ error: "Mã xác minh không hợp lệ" }, { status: 400 });
  }

  // Check expiration
  if (record.expires_at < new Date()) {
    await EmailVerificationCode.deleteOne({ _id: record._id });
    return Response.json({ error: "Mã xác minh đã hết hạn" }, { status: 400 });
  }

  // Debug logging
  console.log('🔍 Verification Debug:');
  console.log('Field:', field);
  console.log('New Value:', new_value);
  console.log('Record Metadata:', record.metadata);

  // Verify metadata matches (except for password)
  if (field !== 'password') {
    if (!record.metadata || record.metadata.field !== field || record.metadata.new_value !== new_value) {
      console.log('❌ Metadata mismatch!');
      console.log('Expected field:', field, 'Got:', record.metadata?.field);
      console.log('Expected new_value:', new_value, 'Got:', record.metadata?.new_value);
      return Response.json({ 
        error: "Thông tin xác minh không khớp" 
      }, { status: 400 });
    }
  } else {
    // For password, just check field matches
    if (!record.metadata || record.metadata.field !== 'password') {
      return Response.json({ 
        error: "Thông tin xác minh không khớp" 
      }, { status: 400 });
    }
  }

  // Get user
  const user = await User.findById(userData.user_id);
  if (!user) {
    return Response.json({ error: "Không tìm thấy người dùng" }, { status: 404 });
  }

  // Update user based on field
  if (field === 'username') {
    user.username = new_value;
  } else if (field === 'phone') {
    user.phone = new_value;
  } else if (field === 'password') {
    const hashedPassword = await bcrypt.hash(new_value, 10);
    user.password_hash = hashedPassword;
  }

  await user.save();

  // Delete used verification code
  await EmailVerificationCode.deleteOne({ _id: record._id });

  const fieldNames = {
    username: 'tên đăng nhập',
    phone: 'số điện thoại',
    password: 'mật khẩu'
  };

  return Response.json({ 
    message: `Cập nhật ${fieldNames[field]} thành công`,
    user: {
      user_id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
    }
  }, { status: 200 });
}
