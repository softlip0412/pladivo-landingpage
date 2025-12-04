'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { toast } from 'sonner'

export default function SignupPage() {
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true)
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error('Google signup error:', error)
      toast.error('Có lỗi xảy ra khi đăng nhập với Google')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validateForm = () => {
    if (!formData.terms) {
      toast.error("Bạn phải đồng ý với điều khoản sử dụng")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu không khớp")
      return false
    }
    return true
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
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
        toast.error(data.error || "Đăng ký thất bại")
        return
      }

      toast.success("Tạo tài khoản thành công 🎉. Vui lòng kiểm tra email để xác minh.")
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        terms: false
      })
      setShowEmailForm(false)
    } catch (error) {
      console.error("Signup error:", error)
      toast.error("Có lỗi xảy ra, vui lòng thử lại")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-gray-800">Tạo tài khoản</CardTitle>
          <p className="text-sm text-gray-500 mt-2">Chọn phương thức đăng ký</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Signup Button */}
          <Button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 shadow-sm h-12 text-base font-medium transition-all"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">hoặc</span>
            </div>
          </div>

          {/* Email Signup Button */}
          {!showEmailForm ? (
            <Button
              type="button"
              onClick={() => setShowEmailForm(true)}
              className="w-full bg-sky-600 hover:bg-sky-700 h-12 text-base font-medium"
            >
              <Mail className="w-5 h-5 mr-2" />
              Continue with Email
            </Button>
          ) : (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="name@example.com"
                      className="pl-10"
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      id="password" 
                      name="password" 
                      type={showPassword ? "text" : "password"}
                      placeholder="Tạo mật khẩu"
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu"
                      className="pl-10"
                      value={formData.confirmPassword} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    name="terms" 
                    checked={formData.terms} 
                    onChange={handleChange} 
                    className="rounded border-gray-300 text-sky-600 focus:ring-sky-500" 
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-600">
                    Tôi đồng ý với <a href="#" className="text-sky-600 hover:underline">điều khoản sử dụng</a>
                  </Label>
                </div>

                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    onClick={() => setShowEmailForm(false)}
                    variant="outline"
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Quay lại
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-sky-600 hover:bg-sky-700" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Đang tạo..." : "Đăng ký"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Đã có tài khoản?{' '}
              <a href="/login" className="text-sky-600 hover:text-sky-700 font-semibold">
                Đăng nhập
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
