import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/booking";
import EventPlan from "@/models/EventPlan";
import Staff from "@/models/Staff";
import { authenticateToken } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectDB();
    const user = authenticateToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const bookings = await Booking.find({ user_id: user.user_id })
      .sort({ createdAt: -1 })
      .populate("services.service_id")
      .populate("partner_id")
      .lean();

    // Fetch event plans for each booking
    const bookingsWithEventPlans = await Promise.all(
      bookings.map(async (booking) => {
        const eventPlan = await EventPlan.findOne({ booking_id: booking._id })
          .populate("step2.staffAssign.manager.id", "full_name avatar_url")
          .lean();
        return {
          ...booking,
          eventPlan: eventPlan || null,
        };
      })
    );

    return NextResponse.json({ success: true, data: bookingsWithEventPlans });
  } catch (error) {
    console.error("Error fetching my bookings:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
