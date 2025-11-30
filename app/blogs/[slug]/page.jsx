"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useParams } from "next/navigation";

const BlogDetailPage = () => {
  const params = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogDetail();
  }, [params.slug]);

  async function fetchBlogDetail() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/blogs/${params.slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBlog(data?.data);
    } catch (err) {
      console.error(err);
      setBlog(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header activePage="home" />
        <main className="flex-1 container mx-auto pt-8 px-4 max-w-4xl pb-8">
          <Skeleton className="h-96 w-full mb-6" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-32 w-full" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header activePage="home" />
        <main className="flex-1 container mx-auto pt-8 px-4 max-w-4xl">
          <p className="text-center text-muted-foreground">
            Bài viết không tìm thấy.
          </p>
          <Link
            href="/blogs"
            className="text-blue-500 hover:underline mt-4 inline-block"
          >
            ← Quay lại danh sách bài viết
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Header activePage="home" />

      <main className="flex-1 container mx-auto pt-8 px-4 pb-8 max-w-4xl">
        {/* Back Link */}
        <Link
          href="/blogs"
          className="text-blue-500 hover:underline mb-6 inline-block"
        >
          ← Quay lại danh sách bài viết
        </Link>

        {/* Cover Image */}
        <img
          src={blog?.coverImage?.url}
          alt={blog?.coverImage?.alt}
          className="w-full aspect-video object-cover rounded-lg mb-8"
        />

        {/* Title */}
        <h1 className="text-4xl font-bold mb-4">{blog?.title}</h1>

        {/* Meta Information */}
        <div className="flex gap-4 text-gray-500 mb-8 border-b pb-6">
          <span>
            📅 {new Date(blog?.createdAt).toLocaleDateString("vi-VN")}
          </span>
          {blog?.author && <span>✍️ {blog?.author}</span>}
          {blog?.readTime && <span>⏱️ {blog?.readTime} phút đọc</span>}
        </div>

        {/* Excerpt */}
        <p className="text-lg text-gray-600 mb-8 italic">{blog?.excerpt}</p>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-8">
          <div dangerouslySetInnerHTML={{ __html: blog?.content }} />
        </div>

        {/* Tags */}
        {blog?.tags && blog?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 border-t pt-6">
            {blog?.tags?.map((tag) => (
              <span
                key={tag}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Author Section */}
        {blog?.author && (
          <div className="bg-gray-100 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-2">Về tác giả</h3>
            <p className="text-gray-700">{blog?.authorBio || blog?.author}</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BlogDetailPage;
