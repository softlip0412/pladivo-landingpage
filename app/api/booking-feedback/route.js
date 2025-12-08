import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BookingFeedback from "@/models/BookingFeedback";
import Booking from "@/models/booking";
import { authenticateToken } from "@/lib/auth";

// POST - Create new booking feedback
export async function POST(req) {
  try {
    await connectDB();
    const user = authenticateToken(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Không được phép truy cập" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      booking_id,
      feedback_type,
      rating,
      message,
      attachments,
      priority,
    } = body;

    // Validate required fields
    if (!booking_id || !message) {
      return NextResponse.json(
        { success: false, message: "Thiếu thông tin bắt buộc" },
        { status: 400 }
      );
    }

    // Verify booking exists and belongs to the user
    const booking = await Booking.findById(booking_id);
    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy đơn đặt" },
        { status: 404 }
      );
    }

    // Check if user is the owner of the booking
    if (booking.user_id.toString() !== user.user_id) {
      return NextResponse.json(
        { success: false, message: "Bạn không có quyền báo cáo đơn này" },
        { status: 403 }
      );
    }

    // Create feedback
    const feedback = await BookingFeedback.create({
      booking_id,
      customer_name: booking.customer_name,
      customer_email: user.email || booking.customer_email,
      customer_phone: booking.customer_phone,
      feedback_type: feedback_type || "question",
      rating: rating || null,
      message,
      attachments: attachments || [],
      priority: priority || "medium",
      status: "new",
    });

    return NextResponse.json({
      success: true,
      message: "Đã gửi báo cáo thành công",
      data: feedback,
    });
  } catch (error) {
    console.error("Error creating booking feedback:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi tạo báo cáo", error: error.message },
      { status: 500 }
    );
  }
}

// GET - Get feedback for a booking
export async function GET(req) {
  try {
    await connectDB();
    const user = authenticateToken(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Không được phép truy cập" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const booking_id = searchParams.get("booking_id");

    if (!booking_id) {
      return NextResponse.json(
        { success: false, message: "Thiếu thông tin booking_id" },
        { status: 400 }
      );
    }

    // Verify booking exists and belongs to the user
    const booking = await Booking.findById(booking_id);
    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy đơn đặt" },
        { status: 404 }
      );
    }

    if (booking.user_id.toString() !== user.user_id) {
      return NextResponse.json(
        { success: false, message: "Bạn không có quyền xem báo cáo này" },
        { status: 403 }
      );
    }

    // Get all feedback for this booking
    const feedbacks = await BookingFeedback.find({ booking_id })
      .sort({ createdAt: -1 })
      .populate("responded_by", "full_name email");

    return NextResponse.json({
      success: true,
      data: feedbacks,
    });
  } catch (error) {
    console.error("Error fetching booking feedback:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy danh sách báo cáo", error: error.message },
      { status: 500 }
    );
  }
}
