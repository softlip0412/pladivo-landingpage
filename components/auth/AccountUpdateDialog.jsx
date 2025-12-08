'use client'

import { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Shield, Eye, EyeOff } from 'lucide-react'
import { apiFetch } from '@/lib/api'

export default function AccountUpdateDialog({ 
  isOpen, 
  onClose, 
  field, // 'username', 'phone', or 'password'
  currentValue,
  onSuccess 
}) {
  const [step, setStep] = useState(1) // 1: Input new value, 2: Verify OTP
  const [formData, setFormData] = useState({
    old_password: '',
    new_value: '',
    confirm_value: ''
  })
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
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
      setFormData({ old_password: '', new_value: '', confirm_value: '' })
      setCode(['', '', '', '', '', ''])
      setTimeLeft(600)
    }
  }, [isOpen])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getFieldLabel = () => {
    const labels = {
      username: 'Tên đăng nhập',
      phone: 'Số điện thoại',
      password: 'Mật khẩu'
    }
    return labels[field] || field
  }

  const getFieldPlaceholder = () => {
    const placeholders = {
      username: 'Nhập tên đăng nhập mới',
      phone: 'Nhập số điện thoại mới',
      password: 'Nhập mật khẩu mới'
    }
    return placeholders[field] || ''
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRequestOTP = async () => {
    // Validation
    if (field === 'password') {
      if (!formData.old_password) {
        toast.error('Vui lòng nhập mật khẩu cũ')
        return
      }
      if (!formData.new_value || formData.new_value.length < 6) {
        toast.error('Mật khẩu mới phải có ít nhất 6 ký tự')
        return
      }
      if (formData.new_value !== formData.confirm_value) {
        toast.error('Mật khẩu mới không khớp')
        return
      }
    } else {
      if (!formData.new_value) {
        toast.error(`Vui lòng nhập ${getFieldLabel().toLowerCase()} mới`)
        return
      }
    }

    setIsSubmitting(true)

    try {
      const res = await apiFetch('/api/auth/request-account-update-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field,
          new_value: formData.new_value,
          old_password: field === 'password' ? formData.old_password : undefined
        }),
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
      console.error('Request OTP error:', error)
      toast.error('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsSubmitting(false)
    }
  }

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

  const handleVerifyAndUpdate = async () => {
    const verificationCode = code.join('')
    
    if (verificationCode.length !== 6) {
      toast.error('Vui lòng nhập đầy đủ 6 số')
      return
    }

    setIsVerifying(true)

    try {
      const res = await apiFetch('/api/auth/verify-and-update-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: verificationCode,
          field,
          new_value: formData.new_value
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Xác minh thất bại')
        setCode(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
        return
      }

      toast.success(data.message || 'Cập nhật thành công!')
      onSuccess(data.user)
      onClose()
    } catch (error) {
      console.error('Verify error:', error)
      toast.error('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = () => {
    setCode(['', '', '', '', '', ''])
    handleRequestOTP()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <Shield className="h-6 w-6 text-orange-600" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Thay đổi {getFieldLabel()}
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === 1 
              ? `Nhập ${getFieldLabel()?.toLowerCase() || 'thông tin'} mới để nhận mã xác minh`
              : 'Nhập mã xác minh đã được gửi đến email của bạn'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4 py-4">
            {field === 'password' && (
              <div className="space-y-2">
                <Label htmlFor="old_password">Mật khẩu cũ <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input
                    id="old_password"
                    name="old_password"
                    type={showOldPassword ? "text" : "password"}
                    value={formData.old_password}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu cũ"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="new_value">{getFieldLabel()} mới <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Input
                  id="new_value"
                  name="new_value"
                  type={field === 'password' && !showNewPassword ? "password" : "text"}
                  value={formData.new_value}
                  onChange={handleChange}
                  placeholder={getFieldPlaceholder()}
                  className={field === 'password' ? 'pr-10' : ''}
                />
                {field === 'password' && (
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>

            {field === 'password' && (
              <div className="space-y-2">
                <Label htmlFor="confirm_value">Xác nhận mật khẩu mới <span className="text-red-500">*</span></Label>
                <Input
                  id="confirm_value"
                  name="confirm_value"
                  type={showNewPassword ? "text" : "password"}
                  value={formData.confirm_value}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>
            )}

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
                onClick={handleRequestOTP}
                disabled={isSubmitting}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
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
        ) : (
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
                  className="h-14 w-12 rounded-lg border-2 border-gray-300 text-center text-2xl font-semibold focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {/* Timer */}
            <div className="text-center">
              {timeLeft > 0 ? (
                <p className="text-sm text-gray-600">
                  Mã có hiệu lực trong <span className="font-semibold text-orange-600">{formatTime(timeLeft)}</span>
                </p>
              ) : (
                <p className="text-sm text-red-600 font-semibold">
                  Mã đã hết hạn. Vui lòng gửi lại mã mới.
                </p>
              )}
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerifyAndUpdate}
              disabled={isVerifying || code.join('').length !== 6 || timeLeft <= 0}
              className="w-full h-12 bg-orange-600 hover:bg-orange-700"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xác minh...
                </>
              ) : (
                'Xác minh và cập nhật'
              )}
            </Button>

            {/* Resend Link */}
            <div className="text-center">
              <button
                onClick={handleResend}
                disabled={isSubmitting}
                className="text-sm text-orange-600 hover:text-orange-700 hover:underline disabled:text-gray-400 disabled:no-underline"
              >
                {isSubmitting ? 'Đang gửi...' : 'Không nhận được mã? Gửi lại'}
              </button>
            </div>

            {/* Back button */}
            <Button
              onClick={() => setStep(1)}
              variant="outline"
              className="w-full"
              disabled={isVerifying || isSubmitting}
            >
              Quay lại
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
