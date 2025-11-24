import mongoose from "mongoose";

const UserProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    full_name: {
      type: String,
      default: null,
    },
    date_of_birth: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: '{VALUE} is not a valid gender'
      },
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    company_name: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    tax_code: {
      type: String,
      default: null,
    },
    payment_info: {
      type: String,
      default: null,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for faster queries
UserProfileSchema.index({ user_id: 1 });

export default mongoose.models.UserProfile ||
  mongoose.model("UserProfile", UserProfileSchema);
