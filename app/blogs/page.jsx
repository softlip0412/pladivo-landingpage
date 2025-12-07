"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import AnimatedHero from "@/components/AnimatedHero";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchList();
  }, []);

  async function fetchList() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBlogs(Array.isArray(data?.data) ? data?.data : []);
    } catch (err) {
      console.error(err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Header activePage="blogs" />

      {/* Hero Section */}
      <AnimatedHero
        variant="creative"
        subtitle="Kiến thức & Góc nhìn"
        title="Pladivo Journal."
        description="Khám phá những câu chuyện, mẹo tổ chức sự kiện và xu hướng mới nhất được cập nhật bởi đội ngũ chuyên gia."
      />

      <main className="flex-1 container mx-auto px-4 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                 <Skeleton className="h-64 w-full rounded-2xl" />
                 <Skeleton className="h-4 w-1/3" />
                 <Skeleton className="h-8 w-full" />
                 <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : blogs?.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl">
            <p className="text-gray-500 text-lg">Chưa có bài viết nào.</p>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* Featured Post (First Item) */}
            {blogs[0] && (
               <Link href={`/blogs/${blogs[0]?.slug}`} className="group block">
                 <div className="grid md:grid-cols-2 gap-8 items-center bg-gray-50 rounded-3xl p-6 md:p-8 hover:bg-indigo-50/50 transition-colors duration-500 border border-transparent hover:border-indigo-100">
                    <div className="order-2 md:order-1 space-y-4">
                       <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold text-xs uppercase tracking-wider">
                            Mới nhất
                          </span>
                          <span>{new Date().toLocaleDateString('vi-VN')}</span>
                       </div>
                       <h2 className="text-3xl md:text-4xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">
                         {blogs[0]?.title}
                       </h2>
                       <p className="text-gray-600 text-lg line-clamp-3 leading-relaxed">
                         {blogs[0]?.excerpt || "Đọc bài viết mới nhất từ chúng tôi để cập nhật những xu hướng và kiến thức bổ ích trong lĩnh vực tổ chức sự kiện."}
                       </p>
                       <div className="pt-4">
                          <span className="inline-flex items-center text-indigo-600 font-semibold group-hover:translate-x-2 transition-transform">
                             Đọc tiếp <span className="ml-2">→</span>
                          </span>
                       </div>
                    </div>
                    <div className="order-1 md:order-2 overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500">
                       <img
                         src={blogs[0]?.coverImage?.url || "https://images.unsplash.com/photo-1496128858413-b36217c2ce36?auto=format&fit=crop&q=80"}
                         alt={blogs[0]?.coverImage?.alt || blogs[0]?.title}
                         className="w-full aspect-[4/3] object-cover transform group-hover:scale-105 transition-transform duration-700"
                       />
                    </div>
                 </div>
               </Link>
            )}

            {/* Remaining Posts Grid */}
            {blogs.length > 1 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                   <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
                   Bài viết khác
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {blogs.slice(1).map((post) => (
                    <Link
                      key={post.id}
                      href={`/blogs/${post?.slug}`}
                      className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                      <div className="relative overflow-hidden aspect-video">
                        <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors z-10" />
                        <img
                          src={post?.coverImage?.url || "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80"}
                          alt={post?.coverImage?.alt || post?.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                         <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-semibold text-gray-700 shadow-sm">
                            Blog
                         </div>
                      </div>
                      
                      <div className="flex flex-col flex-1 p-6">
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                           <span>{new Date().toLocaleDateString('vi-VN')}</span>
                           <span>•</span>
                           <span>5 phút đọc</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                          {post?.title}
                        </h2>
                        <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">
                          {post?.excerpt || "Nhấp để đọc chi tiết bài viết này..."}
                        </p>
                        <div className="mt-auto border-t pt-4 border-gray-50">
                           <span className="text-sm font-medium text-indigo-600 group-hover:underline">
                             Xem chi tiết
                           </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Blogs;
