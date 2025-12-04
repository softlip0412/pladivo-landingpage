import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import EventContract from "@/models/EventContract";
import Booking from "@/models/booking";
import EventPlan from "@/models/EventPlan";
import { authenticateToken } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectDB();

    // Get authenticated user
    let user;
    try {
      user = authenticateToken(request);
    } catch (authError) {
      console.error("Authentication error:", authError.message);
      return NextResponse.json(
        { success: false, message: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    if (!user || !user.user_id) {
      return NextResponse.json(
        { success: false, message: "Invalid user data" },
        { status: 401 }
      );
    }

    const userId = user.user_id;
    console.log("Fetching contracts for user:", userId);

    // First, get all bookings for this user
    const userBookings = await Booking.find({ user_id: userId }).select("_id");
    const bookingIds = userBookings.map((b) => b._id);
    console.log("Found bookings:", bookingIds.length);

    // Then get all event contracts for these bookings
    const contracts = await EventContract.find({
      booking_id: { $in: bookingIds },
    })
      .populate({
        path: "booking_id",
        populate: {
          path: "services.service_id partner_id",
        },
      })
      .populate("event_plan_id")
      .sort({ createdAt: -1 });

    console.log("Found contracts:", contracts.length);

    return NextResponse.json({
      success: true,
      data: contracts,
    });
  } catch (error) {
    console.error("Error fetching event contracts:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
