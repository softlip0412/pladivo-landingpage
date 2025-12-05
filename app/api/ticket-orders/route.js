import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { TicketOrder, Booking, TicketSaleConfig } from "@/models";
import crypto from "crypto";

// POST: Create new ticket order
export async function POST(request) {
  try {
    await connectDB();

    const {
      bookingId,
      customerName,
      customerEmail,
      customerPhone,
      ticketType,
      ticketArea,
      quantity,
    } = await request.json();

    // Validate required fields
    if (
      !bookingId ||
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !ticketType ||
      !ticketArea ||
      !quantity
    ) {
      return NextResponse.json(
        { success: false, message: "Vui lòng điền đầy đủ thông tin" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return NextResponse.json(
        { success: false, message: "Email không hợp lệ" },
        { status: 400 }
      );
    }

    // Validate quantity
    if (quantity < 1) {
      return NextResponse.json(
        { success: false, message: "Số lượng vé phải lớn hơn 0" },
        { status: 400 }
      );
    }

    // Get booking information
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy sự kiện" },
        { status: 404 }
      );
    }

    // Get ticket sale config for this booking and ticket type
    const ticketConfig = await TicketSaleConfig.findOne({
      booking_id: bookingId,
    });

    if (!ticketConfig) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy cấu hình bán vé" },
        { status: 404 }
      );
    }

    // Find the specific ticket type in the config
    const ticketTypeConfig = ticketConfig.ticket_types.find(
      (tt) => tt.type === ticketType
    );

    if (!ticketTypeConfig) {
      return NextResponse.json(
        { success: false, message: "Loại vé không tồn tại" },
        { status: 404 }
      );
    }

    // Check if ticket area exists
    const areaExists = ticketTypeConfig.seating_areas.some(
      (area) => area.area_name === ticketArea
    );

    if (!areaExists) {
      return NextResponse.json(
        { success: false, message: "Khu vực không tồn tại" },
        { status: 404 }
      );
    }

    // Check if tickets are on sale
    const now = new Date();
    const saleStart = new Date(ticketTypeConfig.sale_start_date);
    const saleEnd = new Date(ticketTypeConfig.sale_end_date);

    if (now < saleStart) {
      return NextResponse.json(
        { success: false, message: "Vé chưa mở bán" },
        { status: 400 }
      );
    }

    if (now > saleEnd) {
      return NextResponse.json(
        { success: false, message: "Đã hết thời gian bán vé" },
        { status: 400 }
      );
    }

    // Check ticket availability
    const availableTickets = ticketTypeConfig.quantity - ticketTypeConfig.sold;
    if (quantity > availableTickets) {
      return NextResponse.json(
        {
          success: false,
          message: `Chỉ còn ${availableTickets} vé. Vui lòng chọn số lượng nhỏ hơn.`,
        },
        { status: 400 }
      );
    }

    // Calculate prices
    const unitPrice = ticketTypeConfig.price;
    const totalPrice = unitPrice * quantity;

    // Generate unique order code
    const orderCode = `ORD-${Date.now()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

    // Create ticket order
    const ticketOrder = new TicketOrder({
      order_code: orderCode,
      booking_id: bookingId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      ticket_type: ticketType,
      ticket_area: ticketArea,
      quantity: quantity,
      unit_price: unitPrice,
      total_price: totalPrice,
      payment_status: "pending",
      payment_method: "bank_transfer",
      // Event info for quick access
      event_name: booking.customer_name,
      event_date: booking.event_date,
      event_location: booking.address,
    });

    await ticketOrder.save();

    return NextResponse.json(
      {
        success: true,
        message: "Tạo đơn hàng thành công",
        data: {
          orderId: ticketOrder._id,
          orderCode: ticketOrder.order_code,
          totalPrice: ticketOrder.total_price,
          paymentUrl: `/payment/ticket/${ticketOrder._id}`,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating ticket order:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi tạo đơn hàng: " + error.message },
      { status: 500 }
    );
  }
}
