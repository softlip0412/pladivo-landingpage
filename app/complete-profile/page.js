'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'sonner'

export default function CompleteProfilePage() {
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if we have the temp token
    const token = localStorage.getItem("tempAccessToken")
    if (!token) {
      toast.error("Phiên làm việc hết hạn, vui lòng đăng nhập lại")
      router.push("/login")
    }
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const token = localStorage.getItem("tempAccessToken")
    if (!token) {
        toast.error("Lỗi xác thực")
        router.push("/login")
        return
    }

    try {
      const res = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Cập nhật thất bại")
        return
      }

      toast.success("Cập nhật hồ sơ thành công! Chào mừng bạn.")
      // Clear temp token
      localStorage.removeItem("tempAccessToken")
      
      // Redirect to home
      window.location.href = "/"
    } catch (error) {
      console.error("Profile completion error:", error)
      toast.error("Có lỗi xảy ra, vui lòng thử lại")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100 p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-gray-800">Hoàn tất hồ sơ</CardTitle>
          <p className="text-sm text-gray-500 mt-2">Vui lòng cung cấp thêm thông tin để hoàn tất đăng ký</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập (Username)</Label>
                <Input 
                    id="username" 
                    name="username" 
                    value={formData.username} 
                    onChange={handleChange} 
                    placeholder="VD: nguyenvan_a"
                    required 
                />
                <p className="text-xs text-gray-500">Dùng để đăng nhập sau này</p>
                </div>

                <div className="space-y-2">
                <Label htmlFor="full_name">Họ và tên</Label>
                <Input 
                    id="full_name" 
                    name="full_name" 
                    value={formData.full_name} 
                    onChange={handleChange} 
                    placeholder="VD: Nguyễn Văn A"
                    required 
                />
                </div>

                <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input 
                    id="phone" 
                    name="phone" 
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

                <div className="space-y-2">
                <Label htmlFor="gender">Giới tính</Label>
                <Select onValueChange={(val) => handleSelectChange('gender', val)}>
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

                <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input 
                    id="address" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                    placeholder="Địa chỉ liên hệ"
                />
                </div>
            </div>

            <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 mt-6" disabled={isLoading}>
              {isLoading ? "Đang cập nhật..." : "Hoàn tất"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
