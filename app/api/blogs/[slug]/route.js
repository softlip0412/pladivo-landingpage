import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";

// ✅ GET: Lấy chi tiết blog theo slug
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Slug không được để trống" },
        { status: 400 }
      );
    }

    const blog = await Blog.findOne({ slug }).lean();

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Bài viết không tìm thấy" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: blog,
      message: "Lấy chi tiết bài viết thành công",
    });
  } catch (error) {
    console.error("Error fetching blog detail:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
