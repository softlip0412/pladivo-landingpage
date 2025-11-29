"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

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
      <Header activePage="home" />

      <main className="flex-1 container mx-auto pt-8">
        <h1 className="text-2xl font-bold mb-4">Blogs</h1>
        <div className="grid grid-cols-3 gap-4">
          {loading ? (
            <>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-60 w-full" />
              ))}
            </>
          ) : blogs?.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Không có bài viết.
            </p>
          ) : (
            blogs?.map?.((post) => (
              <Link
                key={post.id}
                href={`/blogs/${post?.slug}`}
                className="bg-white flex flex-col rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <img
                  src={post?.coverImage?.url}
                  alt={post?.coverImage?.alt}
                  className="w-full aspect-video"
                />
                <div className="flex flex-col p-4">
                  <h2 className="text-xl font-semibold">{post?.title}</h2>
                  <p className="text-gray-700">{post?.excerpt}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Blogs;
