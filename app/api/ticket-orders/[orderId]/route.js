import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { TicketOrder } from "@/models";

// GET: Get ticket order by ID
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { orderId } = params;

    const order = await TicketOrder.findById(orderId).populate(
      "booking_id",
      "customer_name event_date address event_time"
    );

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy đơn hàng" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching ticket order:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy thông tin đơn hàng" },
      { status: 500 }
    );
  }
}
