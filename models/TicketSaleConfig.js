import mongoose from "mongoose";

const TicketSaleConfigSchema = new mongoose.Schema(
  {
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
    },
    ticket_types: [
      {
        type: { type: String, required: true }, 
        price: { type: Number, required: true, min: 0 }, 
        quantity: { type: Number, required: true, min: 0 },
        sold: { type: Number, default: 0 }, 
        seating_areas: [
          {
            area_name: { type: String, required: true },
            seat_count: { type: Number, required: true, min: 0 }, 
          },
        ],
        sale_start_date: { type: Date, required: true },
        sale_end_date: { type: Date, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["active", "paused", "ended", "pending"],
      default: "pending",
    },
  },
  { timestamps: true }
);

if (mongoose.models.TicketSaleConfig) {
  delete mongoose.models.TicketSaleConfig;
}

export default mongoose.model("TicketSaleConfig", TicketSaleConfigSchema);
