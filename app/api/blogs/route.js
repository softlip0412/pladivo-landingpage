import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";

export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find({ published: true })
      .select("-comments")
      .sort({ publishedAt: -1 })
      .lean();
    return NextResponse.json({ success: true, data: blogs });
  } catch (err) {
    console.error("GET /api/blogs error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
