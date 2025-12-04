'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Đăng nhập thất bại")
        return
      }

      if (data.redirect) {
        toast.info(data.message || "Vui lòng hoàn tất hồ sơ")
        if (data.accessToken) {
            localStorage.setItem("tempAccessToken", data.accessToken)
        }
        setTimeout(() => {
            window.location.href = data.redirect
        }, 1000)
        return
      }

      toast.success("Đăng nhập thành công 🎉")
      console.log("User:", data.user)

      // Delay redirect to show toast
      setTimeout(() => {
        window.location.href = "/"
      }, 500)
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Có lỗi xảy ra, vui lòng thử lại")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-sky-600 mb-2">
            <a href="/">Pladivo</a>
          </h1>
          <p className="text-gray-600">Chào mừng quay lại! Vui lòng đăng nhập vào tài khoản của bạn.</p>
        </div>

        {/* Form đăng nhập */}
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-800">Đăng Nhập</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Trường Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Địa chỉ Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Nhập email của bạn"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Trường Mật khẩu */}
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu của bạn"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Quên mật khẩu */}
              <div className="flex justify-end">
                <a href="/forgot-password" className="text-sm text-sky-600 hover:text-sky-700">
                  Quên mật khẩu?
                </a>
              </div>

              {/* Nút Đăng nhập */}
              <Button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang đăng nhập...
                  </div>
                ) : (
                  'Đăng Nhập'
                )}
              </Button>
            </form>

            {/* Link Đăng ký */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Chưa có tài khoản?{' '}
                <a href="/signup" className="text-sky-600 hover:text-sky-700 font-semibold">
                  Đăng ký
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quay lại Trang chủ */}
        <div className="text-center mt-6">
          <a href="/" className="text-gray-600 hover:text-sky-600 transition-colors">
            ← Quay lại Trang chủ
          </a>
        </div>
      </div>
    </div>
  )
}
