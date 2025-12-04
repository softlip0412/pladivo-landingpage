"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function VerifyEmailPage() {
  const [status, setStatus] = useState("Đang xác minh...")
  const [error, setError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const verify = async () => {
      const params = new URLSearchParams(window.location.search)
      const token = params.get("token")
      if (!token) {
        setStatus("❌ Token không hợp lệ")
        setError(true)
        return
      }

      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })

        const data = await res.json()
        if (!res.ok) {
          setStatus("❌ " + (data.error || "Xác minh thất bại"))
          setError(true)
        } else {
          setStatus("✅ Xác minh thành công! Đang chuyển hướng...")
          // Store temporary token for profile completion
          if (data.accessToken) {
            localStorage.setItem("tempAccessToken", data.accessToken)
          }
          setTimeout(() => {
            router.push("/complete-profile")
          }, 1500)
        }
      } catch (err) {
        setStatus("Có lỗi xảy ra, vui lòng thử lại.")
        setError(true)
      }
    }

    verify()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-6 shadow-lg text-center">
        <CardContent className="pt-6">
          {!error && status.includes("Đang") && (
             <Loader2 className="h-10 w-10 animate-spin text-sky-600 mx-auto mb-4" />
          )}
          <h1 className={`text-xl font-semibold ${error ? "text-red-600" : "text-gray-800"}`}>
            {status}
          </h1>
          {error && (
            <a href="/login" className="text-sky-600 hover:underline mt-4 block">
              Quay lại đăng nhập
            </a>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
