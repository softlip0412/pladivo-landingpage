import mongoose from "mongoose";

const ContractSchema = new mongoose.Schema(
  {
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    file_url: String,
    status: {
      type: String,
      enum: ["draft", "signed", "cancelled"],
      default: "draft",
    },
    signed_date: Date,
  },
  { timestamps: true }
);

export default mongoose.models.Contract ||
  mongoose.model("Contract", ContractSchema);
