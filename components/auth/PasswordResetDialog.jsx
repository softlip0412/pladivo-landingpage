'use client'

import { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, KeyRound, Eye, EyeOff } from 'lucide-react'

export default function PasswordResetDialog({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [passwords, setPasswords] = useState({ new_password: '', confirm_password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
  const inputRefs = useRef([])

  // Countdown timer
  useEffect(() => {
    if (!isOpen || step !== 2 || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, step, timeLeft])

  // Reset when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1)
      setEmail('')
      setCode(['', '', '', '', '', ''])
      setPasswords({ new_password: '', confirm_password: '' })
      setTimeLeft(600)
    }
  }, [isOpen])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Step 1: Send OTP
  const handleSendOTP = async () => {
    if (!email) {
      toast.error('Vui lòng nhập email')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Gửi mã xác minh thất bại')
        return
      }

      toast.success('Đã gửi mã xác minh đến email của bạn!')
      setStep(2)
      setTimeLeft(600)
    } catch (error) {
      console.error('Send OTP error:', error)
      toast.error('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Step 2: OTP handling
  const handleCodeChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    
    if (!/^\d{6}$/.test(pastedData)) {
      toast.error('Vui lòng paste mã 6 số hợp lệ')
      return
    }

    const newCode = pastedData.split('')
    setCode(newCode)
    inputRefs.current[5]?.focus()
  }

  const handleVerifyOTP = () => {
    const verificationCode = code.join('')
    
    if (verificationCode.length !== 6) {
      toast.error('Vui lòng nhập đầy đủ 6 số')
      return
    }

    // Move to step 3
    setStep(3)
  }

  const handleResend = () => {
    setCode(['', '', '', '', '', ''])
    handleSendOTP()
  }

  // Step 3: Reset password
  const handleResetPassword = async () => {
    if (!passwords.new_password || !passwords.confirm_password) {
      toast.error('Vui lòng nhập đầy đủ thông tin')
      return
    }

    if (passwords.new_password.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự')
      return
    }

    if (passwords.new_password !== passwords.confirm_password) {
      toast.error('Mật khẩu không khớp')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/auth/verify-reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code: code.join(''),
          new_password: passwords.new_password
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Đặt lại mật khẩu thất bại')
        return
      }

      toast.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.')
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <KeyRound className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Đặt lại mật khẩu
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === 1 && 'Nhập email để nhận mã xác minh'}
            {step === 2 && 'Nhập mã xác minh đã được gửi đến email của bạn'}
            {step === 3 && 'Nhập mật khẩu mới cho tài khoản của bạn'}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                autoFocus
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                onClick={handleSendOTP}
                disabled={isSubmitting}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  'Gửi mã xác minh'
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 py-4">
            {/* OTP Input */}
            <div className="flex justify-center gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="h-14 w-12 rounded-lg border-2 border-gray-300 text-center text-2xl font-semibold focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {/* Timer */}
            <div className="text-center">
              {timeLeft > 0 ? (
                <p className="text-sm text-gray-600">
                  Mã có hiệu lực trong <span className="font-semibold text-red-600">{formatTime(timeLeft)}</span>
                </p>
              ) : (
                <p className="text-sm text-red-600 font-semibold">
                  Mã đã hết hạn. Vui lòng gửi lại mã mới.
                </p>
              )}
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerifyOTP}
              disabled={code.join('').length !== 6 || timeLeft <= 0}
              className="w-full h-12 bg-red-600 hover:bg-red-700"
            >
              Tiếp tục
            </Button>

            {/* Resend Link */}
            <div className="text-center">
              <button
                onClick={handleResend}
                disabled={isSubmitting}
                className="text-sm text-red-600 hover:text-red-700 hover:underline disabled:text-gray-400 disabled:no-underline"
              >
                {isSubmitting ? 'Đang gửi...' : 'Không nhận được mã? Gửi lại'}
              </button>
            </div>

            {/* Back button */}
            <Button
              onClick={() => setStep(1)}
              variant="outline"
              className="w-full"
              disabled={isSubmitting}
            >
              Quay lại
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new_password">Mật khẩu mới <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Input
                  id="new_password"
                  type={showPassword ? "text" : "password"}
                  value={passwords.new_password}
                  onChange={(e) => setPasswords(prev => ({ ...prev, new_password: e.target.value }))}
                  placeholder="Nhập mật khẩu mới"
                  className="pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500">Mật khẩu phải có ít nhất 6 ký tự</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password">Xác nhận mật khẩu <span className="text-red-500">*</span></Label>
              <Input
                id="confirm_password"
                type={showPassword ? "text" : "password"}
                value={passwords.confirm_password}
                onChange={(e) => setPasswords(prev => ({ ...prev, confirm_password: e.target.value }))}
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                className="flex-1"
                disabled={isSubmitting}
              >
                Quay lại
              </Button>
              <Button
                onClick={handleResetPassword}
                disabled={isSubmitting}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Đặt lại mật khẩu'
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
