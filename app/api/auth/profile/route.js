import { connectDB } from "@/lib/mongodb";
import { UserProfile } from "@/models";
import { authenticateToken } from "@/lib/auth";

// Helper function to sanitize profile data
function sanitizeProfileData(data) {
  const sanitized = {};

  // Assign non-empty trimmed strings
  const assignIfPresent = (key) => {
    if (
      data[key] !== undefined &&
      data[key] !== null &&
      typeof data[key] === "string" &&
      data[key].trim()
    ) {
      sanitized[key] = data[key].trim();
    }
  };

  assignIfPresent("full_name");
  assignIfPresent("company_name");
  assignIfPresent("address");
  assignIfPresent("tax_code");
  assignIfPresent("payment_info");
  assignIfPresent("image");
  assignIfPresent("bio");

  // Date of birth: convert to Date if valid
  if (data.date_of_birth) {
    const d = new Date(data.date_of_birth);
    if (!isNaN(d)) {
      sanitized.date_of_birth = d;
    }
  }

  // Gender: allow only specific values
  if (
    data.gender &&
    ["male", "female", "other"].includes(data.gender.trim())
  ) {
    sanitized.gender = data.gender.trim();
  }

  return sanitized;
}

export async function POST(request) {
  await connectDB();

  let userData;
  try {
    userData = authenticateToken();
  } catch (err) {
    return Response.json({ error: err.message }, { status: 401 });
  }

  const body = await request.json();
  const profileData = sanitizeProfileData(body);

  const existingProfile = await UserProfile.findOne({ user_id: userData.user_id });
  if (existingProfile) {
    return Response.json({ error: "Profile đã tồn tại" }, { status: 400 });
  }

  const newProfile = new UserProfile({
    user_id: userData.user_id,
    ...profileData,
  });

  await newProfile.save();

  return Response.json(
    { message: "Tạo profile thành công", profile: newProfile },
    { status: 201 }
  );
}

export async function PUT(request) {
  await connectDB();

  let userData;
  try {
    userData = authenticateToken();
  } catch (err) {
    return Response.json({ error: err.message }, { status: 401 });
  }

  const body = await request.json();
  console.log("📥 Received data:", body);

  const profileData = sanitizeProfileData(body);
  console.log("✨ Sanitized data:", profileData);

  let profile = await UserProfile.findOne({ user_id: userData.user_id });

  if (!profile) {
    // Create new profile if it doesn't exist
    console.log("📝 Creating new profile...");
    profile = new UserProfile({
      user_id: userData.user_id,
      ...profileData,
    });
  } else {
    // Update existing profile with sanitized data
    console.log("🔄 Updating existing profile...");
    Object.keys(profileData).forEach((key) => {
      profile[key] = profileData[key];
      console.log(`  ✓ Updated ${key}:`, profileData[key]);
    });
  }

  console.log("💾 Profile before save:", profile.toObject());

  try {
    await profile.save();
    console.log("✅ Profile saved successfully");
    console.log("📤 Profile after save:", profile.toObject());
  } catch (saveError) {
    console.error("❌ Error saving profile:", saveError);
    return Response.json(
      { error: "Lỗi khi lưu profile", details: saveError.message },
      { status: 500 }
    );
  }

  return Response.json(
    { message: "Cập nhật profile thành công", profile },
    { status: 200 }
  );
}
