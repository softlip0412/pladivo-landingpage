'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2, UserCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CompleteProfileDialog({ 
  isOpen, 
  onClose, 
  accessToken,
  userEmail 
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, gender: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.username || !formData.full_name || !formData.phone) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Hoàn tất hồ sơ thất bại')
        return
      }

      toast.success('Hoàn tất hồ sơ thành công! 🎉')
      
      // Close dialog and redirect to home page
      onClose()
      setTimeout(() => {
        router.push('/')
      }, 500)
    } catch (error) {
      console.error('Complete profile error:', error)
      toast.error('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate username suggestion from email
  const suggestUsername = () => {
    if (userEmail && !formData.username) {
      const suggestion = userEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '_')
      setFormData(prev => ({ ...prev, username: suggestion }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <UserCheck className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-center text-2xl">Hoàn tất hồ sơ</DialogTitle>
          <DialogDescription className="text-center">
            Vui lòng cung cấp thêm thông tin để hoàn tất đăng ký
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">
              Tên đăng nhập (Username) <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="username"
                name="username"
                placeholder="VD: nguyenvan_a"
                value={formData.username}
                onChange={handleChange}
                required
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={suggestUsername}
                className="whitespace-nowrap"
              >
                Gợi ý
              </Button>
            </div>
            <p className="text-xs text-gray-500">Dùng để đăng nhập sau này</p>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="full_name">
              Họ và tên <span className="text-red-500">*</span>
            </Label>
            <Input
              id="full_name"
              name="full_name"
              placeholder="VD: Nguyễn Văn A"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone and Date of Birth */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">
                Số điện thoại <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="0123456789"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Ngày sinh</Label>
              <Input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label htmlFor="gender">Giới tính</Label>
            <Select value={formData.gender} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Nam</SelectItem>
                <SelectItem value="female">Nữ</SelectItem>
                <SelectItem value="other">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ liên hệ</Label>
            <Input
              id="address"
              name="address"
              placeholder="Địa chỉ liên hệ"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 mt-6"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              'Hoàn tất'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
