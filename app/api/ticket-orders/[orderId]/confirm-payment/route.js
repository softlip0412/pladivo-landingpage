import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { TicketOrder, TicketSaleConfig } from "@/models";
import { generateOrderQRCodes } from "@/lib/qrcode";
import { getTicketConfirmationEmailTemplate } from "@/lib/emailTemplates";
import nodemailer from "nodemailer";

// POST: Confirm payment for ticket order
export async function POST(request, { params }) {
  try {
    await connectDB();

    const { orderId } = params;

    // Get the order
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

    // Check if already paid
    if (order.payment_status === "paid") {
      return NextResponse.json(
        { success: false, message: "Đơn hàng đã được thanh toán" },
        { status: 400 }
      );
    }

    // Generate QR codes for tickets
    const qrCodes = await generateOrderQRCodes(
      {
        orderId: order._id.toString(),
        orderCode: order.order_code,
        ticketType: order.ticket_type,
        ticketArea: order.ticket_area,
        customerName: order.customer_name,
      },
      order.quantity
    );

    // Update order status
    order.payment_status = "paid";
    order.paid_at = new Date();
    order.qr_codes = qrCodes;
    await order.save();

    // Update ticket sale config - increment sold count
    const ticketConfig = await TicketSaleConfig.findOne({
      booking_id: order.booking_id,
    });

    if (ticketConfig) {
      const ticketTypeIndex = ticketConfig.ticket_types.findIndex(
        (tt) => tt.type === order.ticket_type
      );

      if (ticketTypeIndex !== -1) {
        ticketConfig.ticket_types[ticketTypeIndex].sold += order.quantity;
        await ticketConfig.save();
      }
    }

    // Send confirmation email
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const emailHtml = getTicketConfirmationEmailTemplate({
        orderCode: order.order_code,
        customerName: order.customer_name,
        eventName: order.event_name,
        eventDate: order.event_date,
        eventLocation: order.event_location,
        ticketType: order.ticket_type,
        ticketArea: order.ticket_area,
        quantity: order.quantity,
        unitPrice: order.unit_price,
        totalPrice: order.total_price,
        qrCodes: order.qr_codes,
        paidAt: order.paid_at,
      });

      await transporter.sendMail({
        from: `"Pladivo Events" <${process.env.EMAIL_USER}>`,
        to: order.customer_email,
        subject: `✅ Xác nhận đặt vé thành công - ${order.order_code}`,
        html: emailHtml,
      });

      console.log(`Confirmation email sent to ${order.customer_email}`);
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Thanh toán thành công! Vui lòng kiểm tra email để nhận vé.",
      data: {
        orderId: order._id,
        orderCode: order.order_code,
        paymentStatus: order.payment_status,
        qrCodesCount: order.qr_codes.length,
      },
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi xác nhận thanh toán: " + error.message },
      { status: 500 }
    );
  }
}
