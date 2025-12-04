import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password_hash: { type: String }, // Optional for OAuth users
    email: { type: String, unique: true },
    phone: String,
    role: {
      type: String,
      enum: ["customer", "staff", "manager", "admin"],
      default: "customer",
    },
    status: {
      type: String,
      enum: ["pending", "verified", "active", "inactive"],
      default: "pending",
    },
    // OAuth fields
    provider: {
      type: String,
      enum: ["email", "google"],
      default: "email",
    },
    provider_id: { type: String }, // Google user ID
    image: { type: String }, // Profile picture URL
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
