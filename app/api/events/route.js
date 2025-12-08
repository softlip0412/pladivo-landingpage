import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Booking, TicketSaleConfig, EventPlan, Partner } from "@/models";

// Lấy danh sách sự kiện công khai (bookings có bán vé)
export async function GET() {
  try {
    await connectDB();

    // Lấy tất cả bookings có ticket_sale = true
    const bookings = await Booking.find({ 
      ticket_sale: true,
      booking_status: { $ne: "cancelled" } // Không hiển thị booking đã hủy
    })
      .sort({ event_date: 1 })
      .lean();

    if (!bookings || bookings.length === 0) {
      return NextResponse.json({ 
        success: true, 
        data: [] 
      });
    }

    // Lấy tất cả TicketSaleConfig cho các bookings này
    const bookingIds = bookings.map(b => b._id);
    const ticketConfigs = await TicketSaleConfig.find({
      booking_id: { $in: bookingIds },
      status: "active"
    }).lean();

    // Lấy tất cả EventPlan cho các bookings này
    const eventPlans = await EventPlan.find({
      booking_id: { $in: bookingIds }
    }).lean();

    // Tạo map để dễ tra cứu
    const configsByBooking = {};
    ticketConfigs.forEach(config => {
      const bookingId = config.booking_id.toString();
      if (!configsByBooking[bookingId]) {
        configsByBooking[bookingId] = [];
      }
      configsByBooking[bookingId].push(config);
    });

    const plansByBooking = {};
    eventPlans.forEach(plan => {
      const bookingId = plan.booking_id.toString();
      plansByBooking[bookingId] = plan;
    });

    const now = new Date();
    
    // Xử lý từng booking để thêm thông tin về ticket sale và event plan
    const enrichedBookings = bookings.map(booking => {
      const bookingId = booking._id.toString();
      const configs = configsByBooking[bookingId] || [];
      const eventPlan = plansByBooking[bookingId];
      
      // Phân loại tickets theo trạng thái bán
      const ticketsOnSale = [];
      const ticketsUpcoming = [];
      const ticketsEnded = [];
      
      configs.forEach(config => {
        if (config.ticket_types && Array.isArray(config.ticket_types)) {
          config.ticket_types.forEach(ticket => {
            const saleStart = new Date(ticket.sale_start_date);
            const saleEnd = new Date(ticket.sale_end_date);
            
            const ticketInfo = {
              ticket_id: ticket._id,
              ticket_type: ticket.type,
              sale_start_date: ticket.sale_start_date,
              sale_end_date: ticket.sale_end_date,
              price: ticket.price,
              quantity: ticket.quantity,
              sold: ticket.sold || 0
            };
            
            if (now >= saleStart && now <= saleEnd) {
              // Đang bán
              ticketsOnSale.push(ticketInfo);
            } else if (now < saleStart) {
              // Sắp mở bán
              ticketsUpcoming.push(ticketInfo);
            } else {
              // Đã kết thúc
              ticketsEnded.push(ticketInfo);
            }
          });
        }
      });
      
      return {
        ...booking,
        id: booking._id,
        ticketSaleStatus: {
          onSale: ticketsOnSale,
          upcoming: ticketsUpcoming,
          ended: ticketsEnded,
          hasTicketsOnSale: ticketsOnSale.length > 0
        },
        eventPlan: eventPlan ? {
          status: eventPlan.status,
          theme: eventPlan.step3?.theme,
          mainColor: eventPlan.step3?.mainColor,
          style: eventPlan.step3?.style,
          message: eventPlan.step3?.message,
          startDate: eventPlan.step2?.startDate,
          endDate: eventPlan.step2?.endDate,
          partnerId: eventPlan.step2?.selectedPartner,
          totalEstimatedCost: eventPlan.step3_5?.totalEstimatedCost,
          goal: eventPlan.step1?.goal,
          audience: eventPlan.step1?.audience,
          eventCategory: eventPlan.step1?.eventCategory
        } : null
      };
    });

    // Chỉ trả về các booking có ít nhất 1 loại vé đang bán hoặc sắp bán
    const activeBookings = enrichedBookings.filter(
      b => b.ticketSaleStatus.onSale.length > 0 || b.ticketSaleStatus.upcoming.length > 0
    );

    return NextResponse.json({ 
      success: true, 
      data: activeBookings 
    });

  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

