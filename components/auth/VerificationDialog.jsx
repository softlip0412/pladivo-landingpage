'use client'

import { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, Mail } from 'lucide-react'

export default function VerificationDialog({ 
  isOpen, 
  onClose, 
  userId, 
  email,
  onVerified 
}) {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const inputRefs = useRef([])

  // Countdown timer
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return

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
  }, [isOpen, timeLeft])

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    
    // Only accept 6 digits
    if (!/^\d{6}$/.test(pastedData)) {
      toast.error('Vui lòng paste mã 6 số hợp lệ')
      return
    }

    const newCode = pastedData.split('')
    setCode(newCode)
    inputRefs.current[5]?.focus()
  }

  const handleVerify = async () => {
    const verificationCode = code.join('')
    
    if (verificationCode.length !== 6) {
      toast.error('Vui lòng nhập đầy đủ 6 số')
      return
    }

    setIsVerifying(true)

    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: userId, 
          code: verificationCode 
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Xác minh thất bại')
        // Clear code on error
        setCode(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
        return
      }

      toast.success('Xác minh thành công! 🎉')
      onVerified(data.accessToken)
    } catch (error) {
      console.error('Verification error:', error)
      toast.error('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)

    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Gửi lại mã thất bại')
        return
      }

      toast.success('Đã gửi lại mã xác minh!')
      setTimeLeft(600) // Reset timer
      setCode(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch (error) {
      console.error('Resend error:', error)
      toast.error('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <DialogTitle className="text-center text-2xl">Xác minh tài khoản</DialogTitle>
          <DialogDescription className="text-center">
            Chúng tôi đã gửi mã xác minh 6 số đến email
            <br />
            <span className="font-semibold text-gray-900">{email}</span>
          </DialogDescription>
        </DialogHeader>

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
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="h-14 w-12 rounded-lg border-2 border-gray-300 text-center text-2xl font-semibold focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus={index === 0}
              />
            ))}
          </div>

          {/* Timer */}
          <div className="text-center">
            {timeLeft > 0 ? (
              <p className="text-sm text-gray-600">
                Mã có hiệu lực trong <span className="font-semibold text-blue-600">{formatTime(timeLeft)}</span>
              </p>
            ) : (
              <p className="text-sm text-red-600 font-semibold">
                Mã đã hết hạn. Vui lòng gửi lại mã mới.
              </p>
            )}
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={isVerifying || code.join('').length !== 6 || timeLeft <= 0}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xác minh...
              </>
            ) : (
              'Xác minh'
            )}
          </Button>

          {/* Resend Link */}
          <div className="text-center">
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline disabled:text-gray-400 disabled:no-underline"
            >
              {isResending ? 'Đang gửi...' : 'Không nhận được mã? Gửi lại'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
