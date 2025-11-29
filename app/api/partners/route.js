import { connectDB } from "@/lib/mongodb";
import Partner from "@/models/Partner";

export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const partnerType = searchParams.get("partner_type");

    let query = {};
    
    // Filter by partner_type if provided
    if (partnerType) {
      query.partner_type = partnerType;
    }

    const partners = await Partner.find(query)
      .populate("service")
      .sort({ company_name: 1 });

    return Response.json(
      {
        success: true,
        data: partners,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching partners:", error);
    return Response.json(
      {
        success: false,
        error: "Lỗi khi lấy danh sách đối tác",
      },
      { status: 500 }
    );
  }
}
