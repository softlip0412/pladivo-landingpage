'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Ticket, User, Mail, Phone, MapPin, Hash } from 'lucide-react'
import { toast } from 'sonner'

export default function TicketBookingDialog({ event, open, onOpenChange }) {
  const [loading, setLoading] = useState(false)
  const [ticketConfig, setTicketConfig] = useState(null)
  const [loadingConfig, setLoadingConfig] = useState(true)

  // Form state
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [selectedTicketType, setSelectedTicketType] = useState('')
  const [selectedArea, setSelectedArea] = useState('')
  const [quantity, setQuantity] = useState(1)

  // Derived state
  const [availableAreas, setAvailableAreas] = useState([])
  const [unitPrice, setUnitPrice] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [maxQuantity, setMaxQuantity] = useState(0)

  // Fetch ticket sale config when dialog opens
  useEffect(() => {
    if (open && event) {
      fetchTicketConfig()
    } else {
      // Reset form when dialog closes
      resetForm()
    }
  }, [open, event])

  // Update available areas when ticket type changes
  useEffect(() => {
    if (selectedTicketType && ticketConfig) {
      const ticketType = ticketConfig.ticket_types.find(
        (tt) => tt.type === selectedTicketType
      )
      if (ticketType) {
        setAvailableAreas(ticketType.seating_areas || [])
        setUnitPrice(ticketType.price)
        const available = ticketType.quantity - ticketType.sold
        setMaxQuantity(available)
        
        // Reset area and quantity when ticket type changes
        setSelectedArea('')
        setQuantity(1)
      }
    }
  }, [selectedTicketType, ticketConfig])

  // Calculate total price when quantity or unit price changes
  useEffect(() => {
    setTotalPrice(unitPrice * quantity)
  }, [unitPrice, quantity])

  const fetchTicketConfig = async () => {
    try {
      setLoadingConfig(true)
      const response = await fetch(`/api/ticket-sale-configs?bookingId=${event.id}`)
      const data = await response.json()
      
      if (data.success && data.data) {
        setTicketConfig(data.data)
      } else {
        toast.error('Không thể tải thông tin vé')
      }
    } catch (error) {
      console.error('Error fetching ticket config:', error)
      toast.error('Lỗi khi tải thông tin vé')
    } finally {
      setLoadingConfig(false)
    }
  }

  const resetForm = () => {
    setCustomerName('')
    setCustomerEmail('')
    setCustomerPhone('')
    setSelectedTicketType('')
    setSelectedArea('')
    setQuantity(1)
    setUnitPrice(0)
    setTotalPrice(0)
    setAvailableAreas([])
    setMaxQuantity(0)
  }

  const validateForm = () => {
    if (!customerName.trim()) {
      toast.error('Vui lòng nhập họ tên')
      return false
    }
    if (!customerEmail.trim()) {
      toast.error('Vui lòng nhập email')
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customerEmail)) {
      toast.error('Email không hợp lệ')
      return false
    }
    if (!customerPhone.trim()) {
      toast.error('Vui lòng nhập số điện thoại')
      return false
    }
    if (!selectedTicketType) {
      toast.error('Vui lòng chọn loại vé')
      return false
    }
    if (!selectedArea) {
      toast.error('Vui lòng chọn khu vực')
      return false
    }
    if (quantity < 1) {
      toast.error('Số lượng vé phải lớn hơn 0')
      return false
    }
    if (quantity > maxQuantity) {
      toast.error(`Chỉ còn ${maxQuantity} vé`)
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)

      const response = await fetch('/api/ticket-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: event.id,
          customerName,
          customerEmail,
          customerPhone,
          ticketType: selectedTicketType,
          ticketArea: selectedArea,
          quantity,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Tạo đơn hàng thành công!')
        onOpenChange(false)
        // Redirect to payment page
        window.location.href = data.data.paymentUrl
      } else {
        toast.error(data.message || 'Lỗi khi tạo đơn hàng')
      }
    } catch (error) {
      console.error('Error creating order:', error)
      toast.error('Lỗi khi tạo đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  // Get on-sale ticket types
  const getOnSaleTicketTypes = () => {
    if (!ticketConfig) return []
    
    const now = new Date()
    return ticketConfig.ticket_types.filter((tt) => {
      const saleStart = new Date(tt.sale_start_date)
      const saleEnd = new Date(tt.sale_end_date)
      return now >= saleStart && now <= saleEnd && (tt.quantity - tt.sold) > 0
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Ticket className="h-6 w-6 text-blue-600" />
            Đặt vé sự kiện
          </DialogTitle>
          <DialogDescription>
            {event?.customer_name} - {event?.address}
          </DialogDescription>
        </DialogHeader>

        {loadingConfig ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Đang tải thông tin vé...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Thông tin khách hàng
              </h3>

              <div className="space-y-2">
                <Label htmlFor="customerName">Họ và tên *</Label>
                <Input
                  id="customerName"
                  placeholder="Nguyễn Văn A"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="customerEmail"
                      type="email"
                      placeholder="email@example.com"
                      className="pl-10"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Số điện thoại *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="customerPhone"
                      type="tel"
                      placeholder="0123456789"
                      className="pl-10"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Selection */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Ticket className="h-5 w-5 text-blue-600" />
                Chọn vé
              </h3>

              <div className="space-y-2">
                <Label htmlFor="ticketType">Loại vé *</Label>
                <Select value={selectedTicketType} onValueChange={setSelectedTicketType}>
                  <SelectTrigger id="ticketType">
                    <SelectValue placeholder="Chọn loại vé" />
                  </SelectTrigger>
                  <SelectContent>
                    {getOnSaleTicketTypes().map((tt) => (
                      <SelectItem key={tt.type} value={tt.type}>
                        {tt.type} - {tt.price.toLocaleString('vi-VN')} VNĐ
                        <span className="text-xs text-gray-500 ml-2">
                          (Còn {tt.quantity - tt.sold} vé)
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTicketType && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="area">Khu vực *</Label>
                    <Select value={selectedArea} onValueChange={setSelectedArea}>
                      <SelectTrigger id="area">
                        <SelectValue placeholder="Chọn khu vực" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableAreas.map((area) => (
                          <SelectItem key={area.area_name} value={area.area_name}>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {area.area_name}
                              <span className="text-xs text-gray-500">
                                ({area.seat_count} ghế)
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Số lượng vé *</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        max={maxQuantity}
                        placeholder="1"
                        className="pl-10"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Tối đa: {maxQuantity} vé
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Price Summary */}
            {selectedTicketType && selectedArea && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 space-y-3">
                <h3 className="font-semibold text-lg text-blue-900">Tổng thanh toán</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700">Đơn giá:</span>
                    <span className="font-medium">{unitPrice.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700">Số lượng:</span>
                    <span className="font-medium">×{quantity}</span>
                  </div>
                  <div className="border-t border-blue-200 pt-2 flex justify-between">
                    <span className="font-semibold text-blue-900">Tổng cộng:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {totalPrice.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                disabled={loading}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={loading || !selectedTicketType || !selectedArea}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Tiếp tục thanh toán'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
