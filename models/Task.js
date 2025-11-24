import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    staff_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StaffProfile",
      required: true,
    },
    title: String,
    description: String,
    status: {
      type: String,
      enum: ["todo", "in_progress", "done"],
      default: "todo",
    },
    deadline: Date,
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
