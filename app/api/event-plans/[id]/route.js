import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import EventPlan from "@/models/EventPlan";
import Booking from "@/models/booking";
import { authenticateToken } from "@/lib/auth";

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const user = authenticateToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    const { status, comment } = await request.json();

    // Find the event plan
    const eventPlan = await EventPlan.findById(id);
    if (!eventPlan) {
      return NextResponse.json(
        { success: false, message: "Event plan not found" },
        { status: 404 }
      );
    }

    // Verify ownership via booking
    const booking = await Booking.findById(eventPlan.booking_id);
    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    // Check if the user owns the booking
    if (booking.user_id.toString() !== user.user_id) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    // Update status
    // Allow updating to customer_approved_demo if current status is pending_customer_demo
    // Or allow updating to customer_approved if current status is pending_customer
    // For now, just update the status as requested
    
    eventPlan.status = status;
    
    // If approving, we might want to update the approval timestamp
    if (status === 'customer_approved' || status === 'customer_approved_demo') {
        if (!eventPlan.approvals) eventPlan.approvals = {};
        if (!eventPlan.approvals.customer) eventPlan.approvals.customer = {};
        
        eventPlan.approvals.customer.approved = true;
        eventPlan.approvals.customer.approvedAt = new Date();
        if (comment) {
          eventPlan.approvals.customer.comment = comment;
        }
    }

    await eventPlan.save();

    return NextResponse.json({
      success: true,
      data: eventPlan,
      message: "Cập nhật trạng thái thành công",
    });
  } catch (error) {
    console.error("Error updating event plan:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
