import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { TicketSaleConfig } from "@/models";

// GET: Get ticket sale config by booking ID
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("bookingId");

    if (!bookingId) {
      return NextResponse.json(
        { success: false, message: "Missing bookingId parameter" },
        { status: 400 }
      );
    }

    const config = await TicketSaleConfig.findOne({
      booking_id: bookingId,
    });

    if (!config) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy cấu hình bán vé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: config,
    });
  } catch (error) {
    console.error("Error fetching ticket sale config:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy thông tin vé" },
      { status: 500 }
    );
  }
}
