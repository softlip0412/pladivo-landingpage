'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Lock, Mail, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import VerificationDialog from '@/components/auth/VerificationDialog'
import CompleteProfileDialog from '@/components/auth/CompleteProfileDialog'

const eventImages = [
  {
    src: '/events/conference.jpg',
    title: 'Hội nghị & Sự kiện doanh nghiệp',
    description: 'Tổ chức sự kiện chuyên nghiệp cho doanh nghiệp'
  },
  {
    src: '/events/concert.jpg',
    title: 'Sự kiện ca nhạc & Giải trí',
    description: 'Trải nghiệm âm nhạc đỉnh cao'
  },
  {
    src: '/events/corporate.jpg',
    title: 'Team Building & Gala Dinner',
    description: 'Kết nối và gắn kết đội ngũ'
  },
  {
    src: '/events/wedding.jpg',
    title: 'Tiệc cưới & Sự kiện cá nhân',
    description: 'Khoảnh khắc đáng nhớ của bạn'
  }
]

export default function SignupPage() {
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // New states for dialog flow
  const [showVerificationDialog, setShowVerificationDialog] = useState(false)
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [registeredUserId, setRegisteredUserId] = useState(null)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [verificationToken, setVerificationToken] = useState('')

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % eventImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

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

      // Store user info and show verification dialog
      setRegisteredUserId(data.user.user_id)
      setRegisteredEmail(formData.email)
      setShowVerificationDialog(true)
      
      toast.success("Tạo tài khoản thành công! Vui lòng kiểm tra email để lấy mã xác minh.")
      
      // Reset form
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

  const handleVerified = (accessToken) => {
    // Close verification dialog and open profile dialog
    setShowVerificationDialog(false)
    setVerificationToken(accessToken)
    setShowProfileDialog(true)
  }

  const handleCloseVerificationDialog = () => {
    setShowVerificationDialog(false)
    // Optionally reset state
  }

  const handleCloseProfileDialog = () => {
    setShowProfileDialog(false)
    // Reset all state
    setRegisteredUserId(null)
    setRegisteredEmail('')
    setVerificationToken('')
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % eventImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + eventImages.length) % eventImages.length)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Pladivo</h1>
            <p className="text-slate-400">Nền tảng quản lý sự kiện hàng đầu</p>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-2">Tạo tài khoản</h2>
            <p className="text-slate-400">Bắt đầu hành trình tổ chức sự kiện của bạn</p>
          </div>

          {!showEmailForm ? (
            <div className="space-y-4">
              {/* Google Button */}
              <Button
                type="button"
                onClick={handleGoogleSignup}
                disabled={isLoading}
                className="w-full bg-white hover:bg-gray-50 text-gray-800 h-12 text-base font-medium border-0"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Tiếp tục với Google
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-900 text-slate-400">hoặc</span>
                </div>
              </div>

              {/* Email Button */}
              <Button
                type="button"
                onClick={() => setShowEmailForm(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-medium"
              >
                <Mail className="w-5 h-5 mr-2" />
                Tiếp tục với Email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="name@example.com"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">Mật khẩu</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    name="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="Tạo mật khẩu"
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 pr-10"
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-200">Xác nhận mật khẩu</Label>
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="terms" 
                  name="terms" 
                  checked={formData.terms} 
                  onChange={handleChange} 
                  className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500" 
                />
                <Label htmlFor="terms" className="text-sm text-slate-300">
                  Tôi đồng ý với <a href="#" className="text-blue-400 hover:underline">điều khoản sử dụng</a>
                </Label>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  type="button" 
                  onClick={() => setShowEmailForm(false)}
                  variant="outline"
                  className="flex-1 bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800"
                  disabled={isLoading}
                >
                  Quay lại
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700" 
                  disabled={isLoading}
                >
                  {isLoading ? "Đang tạo..." : "Đăng ký"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          )}

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-slate-400">
              Đã có tài khoản?{' '}
              <a href="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
                Đăng nhập
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Image Carousel */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-blue-600 to-blue-800 overflow-hidden">
        {/* Carousel */}
        <div className="relative h-full">
          {eventImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/50 to-transparent z-10" />
              <div 
                className="h-full w-full bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${image.src})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              
              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-12 z-20">
                <h3 className="text-4xl font-bold text-white mb-4">{image.title}</h3>
                <p className="text-xl text-blue-100">{image.description}</p>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {eventImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="absolute top-8 right-8 z-30 bg-white/10 backdrop-blur-md rounded-lg p-4">
          <div className="flex items-center gap-3 text-white">
            <div className="text-center">
              <div className="text-2xl font-bold">1.5K+</div>
              <div className="text-xs text-blue-100">Sự kiện</div>
            </div>
            <div className="w-px h-10 bg-white/30" />
            <div className="text-center">
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-xs text-blue-100">Khách hàng</div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Dialog */}
      <VerificationDialog
        isOpen={showVerificationDialog}
        onClose={handleCloseVerificationDialog}
        userId={registeredUserId}
        email={registeredEmail}
        onVerified={handleVerified}
      />

      {/* Complete Profile Dialog */}
      <CompleteProfileDialog
        isOpen={showProfileDialog}
        onClose={handleCloseProfileDialog}
        accessToken={verificationToken}
        userEmail={registeredEmail}
      />
    </div>
  )
}
