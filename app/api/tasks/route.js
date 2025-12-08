import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import Booking from "@/models/booking";
import { authenticateToken } from "@/lib/auth";

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

    // Verify booking belongs to user
    const booking = await Booking.findById(booking_id);
    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy đơn đặt" },
        { status: 404 }
      );
    }

    // Check ownership
    if (booking.user_id.toString() !== user.user_id) {
      return NextResponse.json(
        { success: false, message: "Bạn không có quyền xem tiến độ đơn này" },
        { status: 403 }
      );
    }

    // Fetch tasks
    const tasks = await Task.find({ booking_id })
      .sort({ deadline: 1, createdAt: 1 }) // Sort by deadline then created date
      .populate("staff_id", "full_name"); // Optional: populate staff info if needed

    return NextResponse.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy danh sách công việc", error: error.message },
      { status: 500 }
    );
  }
}
