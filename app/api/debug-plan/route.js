import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import EventPlan from "@/models/EventPlan";
import Staff from "@/models/Staff";

export async function GET() {
  try {
    await connectDB();
    // Fetch the most recent event plan
    const eventPlan = await EventPlan.findOne().sort({ updatedAt: -1 })
      .populate("step2.staffAssign.manager.id", "full_name avatar_url");
      
    return NextResponse.json({ 
      success: true, 
      data: eventPlan 
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
